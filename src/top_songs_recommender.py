import spotipy
from spotipy.oauth2 import SpotifyOAuth
import cred

scope = "user-top-read"

sp = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id=cred.client_ID, client_secret= cred.client_SECRET, redirect_uri=cred.redirect_url, scope=scope))

# results = sp.current_user_recently_played()
# for idx, item in enumerate(results['items']):
#     track = item['track']
#     print(idx, track['artists'][0]['name'], " – ", track['name'])

# loop through to get top 3 genres

# get track ids and then run it with spotipy.recommendations that take track seeds


top_tracks = sp.current_user_top_tracks(limit=1, offset=0, time_range="medium_term")

genre_map = {}
for idx, item in enumerate(top_tracks["items"]):
    artistID = item['artists'][0]['id']
    artist_data = sp.artist(artist_id=artistID)
    artist_genres = artist_data['genres']
    for genre in artist_genres:
        genre_map[genre] = genre_map.get(genre, 0) + 1

sorted_map = sorted(genre_map.items(), key = lambda x:x[1], reverse = True)

top3Genres = []

for g in sorted_map[:3]:
    top3Genres.append(g[0])

genres = ",".join(top3Genres)

# print(genres)

for idx, item in enumerate(top_tracks['items']):
    artistID = [item['artists'][0]['id']]
    trackID = [item['id']]
    recs = sp.recommendations(seed_artists=artistID, seed_genres=top3Genres, seed_tracks=trackID, limit=3, country='US')

    for idx, r in enumerate(recs['tracks']):
        print(r['name'], r['id'], r['artists'][0]['name'])
        print("\n")

    # print(idx, item['name'], item['artists'][0]['name'], item['artists'][0]['id'], item['id'])
    # # item['external_urls'][0]['id']
    # print(item)
    # print("\n")