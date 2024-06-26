import os
import requests
import json
from flask import Flask, request
from flask_cors import CORS
import pyrebase

server = Flask(__name__)
CORS(server, resources={r"/*": {"origins": "*"}})

server.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET')

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


@server.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    try:
        auth.create_user_with_email_and_password(
            email, password)
        user = auth.sign_in_with_email_and_password(
            email, password)
        auth.update_profile(user['idToken'], display_name=username)
        return 'Registration successful', 200
    except requests.HTTPError as e:
        error_json = e.args[1]
        error = json.loads(error_json)['error']['message']
        if error == "EMAIL_EXISTS":
            return "Email already exists", 403
        return "Registration failed: " + str(e), 403
    except Exception as e:
        return "Registration failed: " + str(e), 403


@server.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    try:
        user = auth.sign_in_with_email_and_password(
            email, password)

        return user['idToken'], 200
    except requests.HTTPError as e:
        return "Login failed: " + str(e), 403
    except Exception as e:
        return "Login failed: " + str(e), 403


if __name__ == '__main__':
    server.run(host='0.0.0.0', port=5000, debug=True)
