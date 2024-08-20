import json
import random

# load JSON data
with open('./games.json', 'r') as f:
    data = json.load(f)

# create user profiles
def create_synthetic_users(num_users, genres, platforms):
    users = []
    for i in range(num_users):
        user = {
            'id': i,
            'preferred_genres': random.sample(genres, k=3),
            'preferred_platforms': random.sample(platforms, k=2)
        }
        users.append(user)
    return users

# extract unique genres and platforms from the data
all_genres = list({
    genre 
    for game in data 
    if 'genres' in game 
    for genre in game['genres']
})

all_platforms = list({
    platform 
    for game in data 
    if 'platforms' in game 
    for platform in game['platforms']
})

# create 1000 synthetic user profiles with preferences
synthetic_users = create_synthetic_users(1000, all_genres, all_platforms)

# generate synthetic backlogs based on user profiles
def generate_user_backlog(synthetic_users, games_data):
    user_backlogs = []
    for user in synthetic_users:
        preferred_genres = user['preferred_genres']
        preferred_platforms = user['preferred_platforms']
        
        # filter games based on user preferred genres and platforms
        preferred_games = [
            game for game in games_data 
            if 'genres' in game and 'platforms' in game and
               any(genre in game['genres'] for genre in preferred_genres) and
               any(platform in game['platforms'] for platform in preferred_platforms)
        ]
        
        if len(preferred_games) > 0:
            # weight games by their popularity (total_rating_count)
            total_rating_sum = sum(game.get('total_rating_count', 0) for game in preferred_games)
            if total_rating_sum > 0:
                weights = [game.get('total_rating_count', 0) / total_rating_sum for game in preferred_games]
            else:
                weights = [1/len(preferred_games)] * len(preferred_games)

            # determine backlog size for the user
            backlog_size = min(random.randint(5, 20), len(preferred_games))

            # sample games for the user's backlog without replacement
            user_backlog = random.choices(preferred_games, weights=weights, k=backlog_size)
        else:
            user_backlog = []

        backlog_items = []
        for game in user_backlog:
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
synthetic_user_backlogs = generate_user_backlog(synthetic_users, data)

# output to JSON
with open('syntheticData.json', 'w') as f:
    json.dump(synthetic_user_backlogs, f, indent=4)
