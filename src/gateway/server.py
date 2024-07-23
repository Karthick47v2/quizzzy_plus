import os
import requests
import pyrebase
# import pika
from flask import Flask, request
from flask_cors import CORS
# from dotenv import load_dotenv

# load_dotenv()

server = Flask(__name__)
CORS(server, resources={r"/*": {"origins": "*"}})
# server.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET')

# conn = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq'))
# channel = conn.channel()


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

auth = firebase.auth()


@server.route('/login', methods=['POST'])
def login():
    res = requests.post(
        f'http://{os.environ.get("AUTH_SERVICE_URI")}/login',
        json=request.json
    )
    return res.text, res.status_code


@server.route('/register', methods=['POST'])
def register():
    res = requests.post(
        f'http://{os.environ.get("AUTH_SERVICE_URI")}/register',
        json=request.json
    )
    return res.text, res.status_code


@server.route('/chatbot/<path:path>', methods=['POST'])
def chatbot_route(path):
    auth_header = request.headers.get('Authorization')

    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split('Bearer ')[1]
        user_id = auth.get_account_info(token)['users'][0]['email']
        res = requests.post(
            f'http://{os.environ.get("CHAT_SERVICE_URI")}/{path}', json={'user_id': user_id, 'data': request.json})
        return res.text, res.status_code
    else:
        return 'Unauthorized', 401


if __name__ == '__main__':
    server.run(host='0.0.0.0', port=8080, debug=True)
