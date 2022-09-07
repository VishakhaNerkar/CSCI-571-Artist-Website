from xml.dom.minidom import TypeInfo
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import requests
import json

app = Flask(__name__)
CORS(app)


def fetch_artist_data(id):
    requestToSend = {
        "client_id": "40d434d0b86076e777aa",
        "client_secret": "6c5baacbb091f2a56f8b04dc7b361139",
    }

    res_authentication = requests.post('https://api.artsy.net/api/tokens/xapp_token', json=requestToSend)

    json_data = res_authentication.json()

    xapp_token = json_data['token']

    id_url = "https://api.artsy.net/api/artists/"+str(id)

    id_data = {
        'size': '10'
    }

    #print(id_url)
    #print(str(id))

    res_artist = requests.get(url=id_url, params=id_data, headers={
        'X-XAPP-Token': xapp_token})

    artist_data = res_artist.json()

    return artist_data


def fetch_artists(artist):
    requestToSend = {
        "client_id": "40d434d0b86076e777aa",
        "client_secret": "6c5baacbb091f2a56f8b04dc7b361139",
    }

    res = requests.post(
        'https://api.artsy.net/api/tokens/xapp_token', json=requestToSend)
    json_data = res.json()

    xapp_token = json_data['token']

    search_url = "https://api.artsy.net/api/search"

    search_data = {
        'q': artist,
        'size': '10'
    }

    res_search = requests.get(url=search_url, params=search_data, headers={
        'X-XAPP-Token': xapp_token})

    search_json = res_search.json()

    arr = search_json['_embedded']['results']

    artist_list = []

    for i in arr:
        if i['og_type'] == 'artist':
            artist_list.append(i)

    #print("nd size = " + str(len(data_list)))
    #print(data_list)

    return artist_list




@ app.route('/artistfetch', methods=['GET'])
def get_artist():
    # r = request.form.to_dict()
    # data = fetch_data(r['artist'])
    artist_name = request.args.get('artist_name')
    data = fetch_artists(artist_name)
    return make_response(jsonify(data), 200)


@ app.route('/getartistinfo', methods=['GET'])
def get_artist_data():
    artistID = request.args.get('id')
    data = fetch_artist_data(artistID)
    return make_response(jsonify(data), 200)

@app.route('/')
def hello():
    """HTTP Request Return"""
    return app.send_static_file('Home.html')

if __name__ == "__main__":
    app.debug = True
    app.run(host='127.0.0.1', port=8080)
