import spotipy
from spotipy.oauth2 import SpotifyOAuth
import cred

scope = "user-top-read"

sp = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id=cred.client_ID, client_secret= cred.client_SECRET, redirect_uri=cred.redirect_url, scope=scope))

# results = sp.current_user_recently_played()
# for idx, item in enumerate(results['items']):
#     track = item['track']
#     print(idx, track['artists'][0]['name'], " – ", track['name'])


# get track ids and then run it with spotipy.recommendations that take track seeds


top_tracks = sp.current_user_top_tracks(limit=20, offset=0, time_range="medium_term")

print(top_tracks)

for idx, item in enumerate(top_tracks['items']):
    print(idx, item['name'], item['artists'][0]['name'])