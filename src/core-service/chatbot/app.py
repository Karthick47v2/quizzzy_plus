from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, StorageContext, get_response_synthesizer
from llama_index.core.chat_engine.types import BaseChatEngine
from llama_index.vector_stores.qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from qdrant_client.http import models
from llama_index.core.vector_stores.types import MetadataFilters, ExactMatchFilter

from llama_index.llms.openai import OpenAI
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.postprocessor.rankgpt_rerank import RankGPTRerank
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.extractors import SummaryExtractor
from llama_index.core.ingestion import IngestionPipeline

from collections import defaultdict


from flask import Flask, request, redirect, jsonify

import os

from dotenv import load_dotenv

load_dotenv()

qdrant_client = QdrantClient(
    url=os.getenv("QDRANT_URI"),
    api_key=os.getenv("QDRANT_API_KEY"),
)

vector_store = QdrantVectorStore(
    client=qdrant_client, collection_name="quizzy_plus_collection")
storage_context = StorageContext.from_defaults(vector_store=vector_store)

llm = OpenAI(model="gpt-3.5-turbo-0125", temperature=0.7, max_tokens=512)

pipeline = IngestionPipeline(
    transformations=[
        SentenceSplitter(chunk_size=1024, chunk_overlap=20),
        SummaryExtractor(),
        OpenAIEmbedding(model="text-embedding-3-small"),
    ],
    vector_store=vector_store,
)

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'

chat_engine_dict = defaultdict(BaseChatEngine)


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in {'txt', 'pdf', 'docx'}


@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'files[]' not in request.files:
            return redirect(request.url)
        files = request.files.getlist('files[]')

        for file in files:
            if file and allowed_file(file.filename):
                file.save(os.path.join(
                    app.config['UPLOAD_FOLDER'], file.filename))

        data = request.json
        user_id = data.get('user_id', '')

        pipeline.run(documents=SimpleDirectoryReader(
            app.config['UPLOAD_FOLDER'], file_metadata=lambda _: {"user": user_id}).load_data(), num_workers=4)

        qdrant_client.create_payload_index(collection_name="quizzy_plus_collection",
                                           field_name="metadata.user", field_type=models.PayloadSchemaType.KEYWORD)
        qdrant_client.update_collection(
            collection_name="quizzy_plus_collection", hnsw_config=models.HnswConfigDiff(payload_m=16, m=0))

        index = VectorStoreIndex.from_vector_store(vector_store)
        chat_engine = index.as_chat_engine(chat_mode='best',
                                           response_synthesizer=get_response_synthesizer(
                                               response_mode="compact"),
                                           similarity_top_k=5,
                                           filters=MetadataFilters(
                                               filters=[ExactMatchFilter(key="user", value=user_id)]),
                                           node_postprocessors=[
                                               RankGPTRerank(top_n=3, llm=OpenAI(
                                                   model="gpt-3.5-turbo-0125"))
                                           ])

        chat_engine_dict[user_id] = chat_engine

        for file in files:
            file_path = os.path.join(
                app.config['UPLOAD_FOLDER'], file.filename)
            if os.path.exists(file_path):
                os.remove(file_path)

        return 'file uploaded', 200
    except Exception as e:
        return str(e), 403


@app.route('/query', methods=['POST'])
def process_query():
    try:
        data = request.json
        query = data.get('query', '')
        user_id = data.get('user_id', '')

        if query:
            chat_engine = chat_engine_dict[user_id]
            response = chat_engine.chat(query)
            return jsonify(response.response)
        else:
            return 'No query provided', 403
    except Exception as e:
        return str(e), 403


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
