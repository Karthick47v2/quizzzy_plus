import os
import json
import random
import PyPDF2

from flask import Flask, request, jsonify
from llama_index.llms.llama_cpp import LlamaCPP
from llama_index.llms.llama_cpp.llama_utils import (
    messages_to_prompt,
    completion_to_prompt,
)

def extract_text_from_pdf(pdf_file):
    # Use PyPDF2 to extract text from PDF
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
    mcq_json["options"] = random.sample(mcq_json["options"], k=4)  # Shuffle and take 4
    if mcq_json["answer"] not in mcq_json["options"]:
        mcq_json["options"][0] = mcq_json["answer"]
    return mcq_json

def gnerate_questions(text_chunks, llm):

  results = {
        "mcq_questions": [],
        "true_false_questions": []
  }

  used_chunks = set()
  generated_questions = set()

  # Generate 5 sets of questions
  for _ in range(5):
    # Stop if no unique chunks left
    if len(used_chunks) == len(text_chunks):
            break

    chunk = random.choice(list(set(text_chunks) - used_chunks))
    used_chunks.add(chunk)

    prompt_mcq = f"""Generate a JSON-formatted response with a multiple-choice question (MCQ) based on this passage. Include the following:
                 * **question:** The question text (ask about a specific fact or ask to identify the INCORRECT statement).
                 * **options:** An array of four possible answer choices. Include ONE correct answer and three plausible distractors.
                 * **answer:** The single correct answer (marked within the 'options' array).
                 Passage: {chunk}"""

    prompt_true_false = f"""Generate a JSON-formatted response with a true/false statement based on this passage. Include the following:
                        * **statement:** A statement that is clearly true or false.
                        * **answer:** 'True' or 'False'.
                        Passage: {chunk} """


    # MCQ
    response_mcq = llm.complete(prompt_mcq)
    response_mcq_dict = json.loads(response_mcq.json())
    json_mcq_text = response_mcq_dict["text"]
    mcq_json = json.loads(json_mcq_text)

    mcq_json = limit_mcq_options(mcq_json)

    # duplication Check
    if mcq_json["question"] not in generated_questions:
      generated_questions.add(mcq_json["question"])
      results["mcq_questions"].append(mcq_json)

    # True/False
    response_tf = llm.complete(prompt_true_false)
    response_tf_dict = json.loads(response_tf.json())
    json_tf_text = response_tf_dict["text"]
    tf_json = json.loads(json_tf_text)

    # duplication Check
    if tf_json["statement"] not in generated_questions:
      generated_questions.add(tf_json["statement"])
      results["true_false_questions"].append(tf_json)

  return results

app = Flask(__name__)

# Load your LLM Model
model_url = "https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.1-GGUF/resolve/main/mistral-7b-instruct-v0.1.Q4_K_M.gguf"
llm = LlamaCPP(
    model_url=model_url,
    model_path=None,
    temperature=0.1,
    max_new_tokens=256,
    context_window=3900,
    generate_kwargs={},
    model_kwargs={"n_gpu_layers": 1},
    messages_to_prompt=messages_to_prompt,
    completion_to_prompt=completion_to_prompt,
    verbose=True,
)

@app.route('/generate-questions', methods=['POST'])
def generate_questions():
    if 'files' not in request.files:
        return jsonify({'error': 'No files uploaded'}), 400

    text_chunks = []
    for file in request.files.getlist('files'):
        if file.filename.endswith('.pdf'):
            try:
                # TODO: save in firebase and read
                pdf_text = extract_text_from_pdf(file)
                text_chunks.extend(chunk_text(pdf_text))
            except Exception as e:
                return jsonify({'error': f'Error processing {file.filename}: {str(e)}'}), 500
            
    generated_questions_json = generate_questions(text_chunks, llm)

    return generated_questions_json


if __name__ == '__main__':
    app.run(debug=True) 
