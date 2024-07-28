from flask import Flask, request, jsonify
from flask_cors import CORS

import os
import pyrebase


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


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


@app.route('/analyze', methods=['GET'])
def analyze():
    pass

@app.route('/analyze-by-quiz', methods=['POST'])
def analyze_by_quiz():
    pass

@app.route('/get-score', methods=['GET'])
def get_score():
    pass

@app.route('/get-score-by-quiz', methods=['POST'])
def get_score_by_quiz():
    pass

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003, debug=True)