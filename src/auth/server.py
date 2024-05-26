import jwt
import datetime
import os
import requests
import json
from flask import Flask, request
from flask_cors import CORS
from dotenv import load_dotenv
import pyrebase

load_dotenv()

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
storage = firebase.storage()

# #storage
# storage.child(cloudfilename).put(filename)
# storage.child(cloudfilenmae).download('', downloadedfilename)


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
        return 'Succes', 200
    except requests.HTTPError as e:
        error_json = e.args[1]
        error = json.loads(error_json)['error']['message']
        if error == "EMAIL_EXISTS":
            return "Email already exists", 403
        return str(e), 403
    except Exception as e:
        return str(e), 403


@server.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    try:
        user = auth.sign_in_with_email_and_password(
            email, password)

        # print(user)
        # token = create_jwt(email, os.environ.get('FLASK_SECRET'), True)

        return user['idToken'], 200
    except requests.HTTPError as e:
        return str(e), 403
    except Exception as e:
        return str(e), 403


@server.route('/validate', methods=['POST'])
def validate():
    encoded_jwt = request.headers['Authorization']

    if not encoded_jwt:
        return 'missing credentials', 401

    encoded_jwt = encoded_jwt.split(' ')[1]

    try:
        decoded = jwt.decode(encoded_jwt, os.environ.get(
            'FLASK_SECRET'), algorithm=['HS256'])
    except:
        return 'not authorized', 403

    return decoded, 200


def create_jwt(username, secret, authz):
    return jwt.encode(
        {
            'username': username,
            'exp': datetime.datetime.now(tz=datetime.timezone.utc) + datetime.timedelta(days=1),
            'iat': datetime.datetime.now(tz=datetime.timezone.utc),
            'admin': authz,
        },
        secret,
        algorithm='HS256',

    )


if __name__ == '__main__':
    server.run(host='0.0.0.0', port=5000, debug=True)
