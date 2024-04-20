import pika
import json


def upload(f, fs, channel, access):
    try:
        fid = fs.put(f)
    except Exception as err:
        return 'internal server error', 500

    msg = {
        'pdf_id': str(fid),
        'temp_id': None,
        'username': access['username'],
    }

    try:
        channel.basic_publish(
            exchange='', routing_key='pdf', body=json.dumps(msg), properties=pika.BasicProperties(delivery_mode=pika.spec.PERSISTENT_DELIVERY_MODE))
    except:
        fs.delete(fid)
        return 'internal server error', 500
