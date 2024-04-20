import os
import requests


def token(request):
    if 'Authorization' not in request.headers:
        return None, ('missing credentials', 401)

    token = request.headers['Authorization']

    if not token:
        return None, ('missing credentials', 401)

    resp = requests.post(
        f'http://{os.environ.get('AUTH_SERVICE_URI')}/validate',
        headers={'Authorization': token},
    )

    if resp.status_code == 200:
        return resp.text, None
    else:
        return None, (resp.text, resp.status_code)
