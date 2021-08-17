import spotipy
from spotipy.oauth2 import SpotifyOAuth
import cred

## Authentication and scope declaration
scope = "user-top-read,playlist-modify-public,playlist-modify-private,user-read-private,user-read-email"
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id=cred.client_ID, client_secret= cred.client_SECRET, redirect_uri=cred.redirect_url, scope=scope))

## Getting playlist information
print("What would you like your playlist to be called?")
title = input()
print("What is the description of the " + title + " playlist?")
description = input()
print("Would you like this to be a public or private playlist? public or private")
public = input()
if public == 'public':
    public = True
else:
    public = False


## Getting user information
user = sp.me()

## Create playlist and find playlist ID
new_playlist = sp.user_playlist_create(user=user['id'], name=title, public=public, description=description)
playlist_id = new_playlist['id']


top_tracks = sp.current_user_top_tracks(limit=20, offset=0, time_range="medium_term")

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
        sp.user_playlist_add_tracks(user = user['id'], playlist_id = playlist_id, tracks = [r['uri']])

