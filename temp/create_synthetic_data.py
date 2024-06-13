import pandas as pd
import json
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.cluster import KMeans
import random

# load JSON
with open('./backend/games.json', 'r') as f:
  data = json.load(f)

# create dataframe
igdb_data = pd.DataFrame(data)

# ensure genres and platforms are lists and handle NaN values
igdb_data['genres'] = igdb_data['genres'].apply(lambda x: x if isinstance(x, list) else [])
igdb_data['platforms'] = igdb_data['platforms'].apply(lambda x: x if isinstance(x, list) else [])

# one-hot encoding
mlb_genres = MultiLabelBinarizer()
mlb_platforms = MultiLabelBinarizer()

# create matrix
genre_matrix = mlb_genres.fit_transform(igdb_data['genres'])
platform_matrix = mlb_platforms.fit_transform(igdb_data['platforms'])

features = pd.concat([
    pd.DataFrame(genre_matrix, columns=mlb_genres.classes_),
    pd.DataFrame(platform_matrix, columns=mlb_platforms.classes_)
], axis=1)

# use K-means clustering
kmeans = KMeans(n_clusters=10, random_state=42)
igdb_data['cluster'] = kmeans.fit_predict(features)


# create user profiles
def create_synthetic_users(num_users, igdb_data, genres, platforms):
    users = []
    for i in range(num_users):
        user = {
            'id': i,
            'preferred_genres': random.sample(genres, k=3),
            'preferred_platforms': random.sample(platforms, k=2)
        }
        users.append(user)
    return users

genres = mlb_genres.classes_.tolist()
platforms = mlb_platforms.classes_.tolist()

# create 1000 synthetic user profiles with preferences
synthetic_users = create_synthetic_users(1000, igdb_data, genres, platforms)


# generate synthetic backlogs based on user profiles
def generate_user_backlog(synthetic_users, igdb_data):
    user_backlogs = []
    for user in synthetic_users:
        preferred_genres = user['preferred_genres']
        preferred_platforms = user['preferred_platforms']
        
        # filter games based on user preferred genres and platforms
        preferred_games = igdb_data[
            igdb_data['genres'].apply(lambda x: any(genre in x for genre in preferred_genres)) &
            igdb_data['platforms'].apply(lambda x: any(platform in x for platform in preferred_platforms))
        ]
        
        # weight games by their popularity (total_rating_count)
        weights = preferred_games['total_rating_count'] / preferred_games['total_rating_count'].sum()
        
        # filter out games with zero weights
        preferred_games = preferred_games[weights > 0]
        weights = weights[weights > 0]
        
        # determine backlog size for the user
        backlog_size = min(random.randint(5, 20), len(preferred_games))
        
        # sample games for the user's backlog without replacement
        if len(preferred_games) > 0:
            user_backlog = preferred_games.sample(n=backlog_size, weights=weights, replace=False)
        else:
            user_backlog = preferred_games
        
        backlog_items = []
        for _, game in user_backlog.iterrows():
            backlog_items.append({
                'id': game['id'],
                'status': random.choices(
                    ['notStarted', 'inProgress', 'completed', 'dropped'], 
                    weights=[0.4, 0.3, 0.2, 0.1]
                )[0],
                'name': game['name']
            })
        
        user_backlogs.append({
            'user_id': user['id'],
            'backlog': backlog_items
        })
    return user_backlogs

# generate backlogs for synthetic users
synthetic_user_backlogs = generate_user_backlog(synthetic_users, igdb_data)

# output to json
with open('syntheticData.json', 'w') as f:
    json.dump(synthetic_user_backlogs, f, indent=4)