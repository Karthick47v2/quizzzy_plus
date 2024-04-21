import jwt
import datetime
import os
from flask import Flask, request
from flask_mysqldb import MySQL
from dotenv import load_dotenv

load_dotenv()

server = Flask(__name__)
server.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET')
mysql = MySQL(server)

server.config['MYSQL_HOST'] = os.environ.get('MYSQL_HOST')
server.config['MYSQL_USER'] = os.environ.get('MYSQL_USER')
server.config['MYSQL_PASSWORD'] = os.environ.get('MYSQL_PASSWORD')
server.config['MYSQL_DB'] = os.environ.get('MYSQL_DB')
server.config['MYSQL_PORT'] = os.environ.get('MYSQL_PORT')


@server.route('/login', methods=['POST'])
def login():
    auth = request.authorization

    if not auth:
        return 'missing credentials', 401

    cur = mysql.connection.cursor()
    res = cur.execute(
        'SELELCT email, password FROM user WHERE email=%s', (auth.username,)
    )

    if res > 0:
        user_row = cur.fetchone()
        email = user_row[0]
        password = user_row[1]

        if auth.username != email or auth.password != password:
            return 'invalid credentials', 401
        else:
            return create_jwt(auth.username, os.environ.get('FLASK_SECRET'), True)

    else:
        return 'invalid credentials', 401


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
    server.run(host='0.0.0.0', port=5000)