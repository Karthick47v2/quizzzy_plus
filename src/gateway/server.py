import utils
import access
import validate
import os
import pika
import json
import gridfs
from flask import Flask, request
from flask_pymongo import PyMongo
from dotenv import load_dotenv

load_dotenv()


server = Flask(__name__)
server.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET')

mongo_pdf = PyMongo(server, uri=os.environ.get('MONGO_URI'))

# mongo = PyMongo(server)

fs = gridfs.GridFS(mongo_pdf.db)

conn = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq'))
channel = conn.channel()


@server.route('/login', methods=['POST'])
def login():
    token, err = access.login(request)

    if not err:
        return token
    else:
        return err


@server.route('/upload', methods=['POST'])
def upload():
    access, err = validate.token(request)

    if err:
        return err

    access = json.loads(access)

    if access['admin']:
        if len(request.files) > 1:
            return "atleast 1 file required", 401

        for _, f in request.files.items():
            err = utils.upload(f, fs, channel, access)

            if err:
                return err
        return 'sucess', 200
    else:
        return 'not authorized', 401


@server.route('/download', methods=['GET'])
def download():
    pass


if __name__ == '__main__':
    server.run(host='0.0.0.0', port=8080)
