import plotly.express as px
import pandas as pd

## Function to transform json to a dataframe for needed track analysis
def jsonToPD(json):
    appendDF = pd.DataFrame({"danceability": [json[0]['danceability']],
                            'energy': [json[0]['energy']],
                            'acousticness': [json[0]['acousticness']],
                            'instrumentalness': [json[0]['instrumentalness']],
                            'liveness': [json[0]['liveness']],
                            'valence': [json[0]['valence']],
                            })
    return appendDF

## Create a radar graph of track analysis
def createRadar(df):    
    newPD = pd.DataFrame(dict(
        r = [df['danceability'].mean(), df['energy'].mean(),
            df['acousticness'].mean(), df['instrumentalness'].mean(), 
            df['liveness'].mean(), df['valence'].mean()],
        theta = ['danceability', 'energy', 'acousticness', 'instrumentalness', 'liveness', 'valence']))

    fig = px.line_polar(newPD, r='r', theta='theta', line_close=True)
    fig.show()