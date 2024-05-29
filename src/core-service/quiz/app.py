import pyrebase
import json
import random
import PyPDF2
import os
from flask import Flask, jsonify, request
from llama_index.llms.openai import OpenAI
from multiprocessing import Pool
from dotenv import load_dotenv

load_dotenv()


firebase_config = {
    'apiKey': "AIzaSyAyTNs5FQxsCtjP3HcSwBbtq2DvKp1CWWQ",
    'authDomain': "quizzzy-plus.firebaseapp.com",
    'projectId': "quizzzy-plus",
    'storageBucket': "quizzzy-plus.appspot.com",
    'messagingSenderId': "403474519501",
    'appId': "1:403474519501:web:82cfabebbd8beaea53e084",
    'databaseURL': "https://quizzzy-plus-default-rtdb.firebaseio.com/"
}

firebase = pyrebase.initialize_app(firebase_config)
storage = firebase.storage()
db = firebase.database()


llm = OpenAI(model="gpt-3.5-turbo-0125", temperature=0.7, max_tokens=512)

app = Flask(__name__)

UPLOAD_FOLDER = 'qapdf'


def extract_text_from_pdf(pdf_file):
    with open(pdf_file, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ''
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            text += page.extract_text()
    return text


def chunk_text(text, chunk_size=512):
    chunks = []
    words = text.split()
    for i in range(0, len(words), chunk_size):
        chunks.append(" ".join(words[i:i+chunk_size]))
    return chunks


def limit_mcq_options(mcq_json):
    """Limits MCQ options to four, ensuring at least one distractor."""
    mcq_json["options"] = random.sample(
        mcq_json["options"], k=4)  # shuffle and take 4
    if mcq_json["answer"] not in mcq_json["options"]:
        mcq_json["options"][0] = mcq_json["answer"]
    return mcq_json


def generate_question(mcq, tf):
    mcq_dict, tf_dict = None, None
    response_mcq = llm.complete(mcq)
    try:
        mcq_dict = json.loads(response_mcq.text)
    except json.JSONDecodeError:
        pass

    response_tf = llm.complete(tf)
    try:
        tf_dict = json.loads(response_tf.text)
    except json.JSONDecodeError:
        pass
    return mcq_dict, tf_dict


def generate_questions_json(text_chunks):
    text_chunks = text_chunks[:3]
    results = {
        "mcq_questions": [],
        "true_false_questions": []
    }
    generated_questions = set()

    mcq_prompts = [f"""Generate a JSON-formatted response with a multiple-choice question (MCQ) based on this passage. Include the following:
                     * **question:** The question text (ask about a specific fact or ask to identify the INCORRECT statement).
                     * **options:** An array of four possible answer choices. Include ONE correct answer and three plausible distractors.
                     * **answer:** The single correct answer (marked within the 'options' array).
                     Passage: {chunk}""" for chunk in text_chunks]

    tf_prompts = [f"""Generate a JSON-formatted response with a true/false statement based on this passage. Include the following:
                     * **statement:** A statement that is clearly true or false.
                     * **answer:** 'True' or 'False'.
                     Passage: {chunk}""" for chunk in text_chunks]

    prompts = [(mcq_prompts[i], tf_prompts[i])
               for i in range(len(text_chunks))]

    with Pool() as pool:
        for mcq_json, tf_json in pool.starmap(generate_question, prompts):
            # MCQ
            if mcq_json:
                mcq_json = limit_mcq_options(mcq_json)
                if mcq_json["question"] not in generated_questions:
                    generated_questions.add(mcq_json["question"])
                    results["mcq_questions"].append(mcq_json)

            # True/False
            if tf_json and tf_json["statement"] not in generated_questions:
                generated_questions.add(tf_json["statement"])
                results["true_false_questions"].append(tf_json)

    return results


@app.route('/gen_qa', methods=['POST'])
def generate_questions():
    try:
        data = request.json
        user_id = data.get('user_id', '')
        filename = data.get('data', '').get('filename', '')

        storage.child(filename).download(path='', filename=filename)

        user_id = 123
        text_chunks = []
        text_chunks.extend(chunk_text(extract_text_from_pdf('temp.pdf')))

        generated_questions_json = generate_questions_json(text_chunks)

        db.child('qa').child(user_id).set(generated_questions_json)

        if os.path.exists(filename):
            os.remove(filename)

        return 'Questions generated', 200

    except Exception as e:
        return str(e), 403


@app.route('/get_qa', methods=['POST'])
def get_qa():
    try:
        data = request.json
        user_id = data.get('user_id', '')
        results = db.child('qa').child(user_id).get().val()

        return jsonify(results), 200

    except Exception as e:
        print(e)
        return str(e), 403


if __name__ == '__main__':
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

    app.run(host='0.0.0.0', port=5002, debug=True)
