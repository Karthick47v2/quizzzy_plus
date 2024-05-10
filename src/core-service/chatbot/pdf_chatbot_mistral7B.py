from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, ServiceContext, StorageContext
from llama_index.llms.llama_cpp import LlamaCPP
from llama_index.legacy.llms.llama_utils import messages_to_prompt, completion_to_prompt
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.vector_stores.qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from qdrant_client.http import models
from llama_index.core.vector_stores.types import MetadataFilters, ExactMatchFilter


from flask import Flask, request, redirect, jsonify
from collections import defaultdict

import os
import subprocess

# Set environment variables
os.environ['CMAKE_ARGS'] = '-DLLAMA_CUBLAS=on'
os.environ['FORCE_CMAKE'] = '1'

# Install the package using pip
subprocess.check_call(['pip', 'install', 'llama-cpp-python', '--no-cache-dir'])

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

llm = LlamaCPP(
    model_url='https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.1-GGUF/resolve/main/mistral-7b-instruct-v0.1.Q4_K_M.gguf',
    temperature=0.1,
    max_new_tokens=256,
    context_window=3900,
    model_kwargs={"n_gpu_layers": -1},
    messages_to_prompt=messages_to_prompt,
    completion_to_prompt=completion_to_prompt,
    verbose=True,
)

# Initialize Hugging Face embeddings
embed_model = HuggingFaceEmbedding(model_name="thenlper/gte-large")

# Initialize Qdrant client
qdrant_client = QdrantClient(
    url="https://6930324d-975a-45db-a2db-d88db5f71091.us-east4-0.gcp.cloud.qdrant.io:6333",
    api_key="z8k04lUpFt5vPgUjnCr4Oay-K9GyhfD2uAOuZHh31-AiW1fv_DAqRw",
)

# Recreate Qdrant collection
vectors_config = models.VectorParams(size=1024, distance=models.Distance.COSINE)
qdrant_client.recreate_collection(collection_name="quizzy_plus_collection", vectors_config=vectors_config)

# Initialize Qdrant vector store
vector_store = QdrantVectorStore(client=qdrant_client, collection_name="quizzy_plus_collection")

# Initialize storage context
storage_context = StorageContext.from_defaults(vector_store=vector_store)

# Initialize service context
service_context = ServiceContext.from_defaults(
    chunk_size=256,
    llm=llm,
    embed_model=embed_model
)

# Initialize an empty dictionary to store vector indexes
user_index_dict = defaultdict(VectorStoreIndex)


#-----------------------------FLASK--------------------------------------#
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/upload', methods=['POST'])
def upload_file():

    if 'files[]' not in request.files:
        return redirect(request.url)
    files = request.files.getlist('files[]')

    for file in files:
        if file and allowed_file(file.filename):
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
    
    # use session id as user
    data = request.json
    user_Id = data.get('user_id', '')
    username_fn = lambda username: {"user": user_Id}
    # Load documents from a directory with user metadata
    documents = SimpleDirectoryReader(app.config['UPLOAD_FOLDER'], file_metadata=username_fn).load_data()

    # Create vector index from documents
    index = VectorStoreIndex.from_documents(documents, service_context= service_context, storage_context=storage_context)

    user_index_dict[user_Id] = index

    # Create payload index in Qdrant
    qdrant_client.create_payload_index(collection_name="quizzy_plus_collection", field_name="metadata.user", field_type=models.PayloadSchemaType.KEYWORD)

    # Update Qdrant collection
    qdrant_client.update_collection(collection_name="quizzy_plus_collection", hnsw_config=models.HnswConfigDiff(payload_m=16, m=0))


@app.route('/query', methods=['POST'])
def process_query():
    data = request.json
    query = data.get('query', '')  # Retrieve the query from the JSON data
    user_id = data.get('user_id', '')
    if query:
        index = user_index_dict[user_id]
        # Retrieve nodes based on query
        qdrant_retriever = index.as_retriever(filters=MetadataFilters(filters=[ExactMatchFilter(key="user", value=user_id)]))
        nodes_with_scores = qdrant_retriever.retrieve(query)
        max_score_node = max(nodes_with_scores, key=lambda x: x.score)
        response = {
            'text': max_score_node.text,
            'score': max_score_node.score
        }
        return jsonify(response)
    else:
        return jsonify({'error': 'No query provided'})
