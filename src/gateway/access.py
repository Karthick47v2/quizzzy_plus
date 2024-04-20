import os
import requests


def login(request):
    auth = request.authorization

    if not auth:
        return None, ('missing credentials', 401)

    basic_auth = (auth.username, auth.password)

    resp = requests.post(
        f'http://{os.environ.get('AUTH_SERVICE_URI')}/login',
        auth=basic_auth
    )

    if resp.status_code == 200:
        return resp.text, None
    else:
        return None, (resp.text, resp.status_code)
