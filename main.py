import requests


endpoint_url = "https://api.spotify.com/v1/me/top/tracks"
token = "token here"

response = requests.get(endpoint_url,
                    headers={"Content-Type":"application/json", 
                        "Authorization":f"Bearer {token}"})

json_response = response.json()

print(json_response)





# # OUR FILTERS
# limit=10
# market="US"
# print("Please type in interested generes")
# seed_genres=input()
# print("Please input danceability ranging from 0 - 1 on how you would like your music")
# target_danceability=input()

# query = f'{endpoint_url}limit={limit}&market={market}&seed_genres={seed_genres}&target_danceability={target_danceability}'

# response = requests.get(query, 
#                headers={"Content-Type":"application/json", 
#                         "Authorization":f"Bearer {token}"})
            
# json_response = response.json()
# uris = []

# # print(json_response)

# for i in json_response['tracks']:
#             uris.append(i)
#             print(f"\"{i['name']}\" by {i['artists'][0]['name']}")