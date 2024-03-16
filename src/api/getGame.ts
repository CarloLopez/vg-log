const getGame = async (gameSlug: string) => {
  
  const body = `
  fields 
    age_ratings.category,
    age_ratings.rating, 
    aggregated_rating, 
    aggregated_rating_count, 
    artworks.image_id, 
    cover.image_id,
    dlcs.name,
    dlcs.cover.image_id,
    dlcs.slug,
    expansions.name,
    expansions.cover.image_id, 
    expansions.slug,
    first_release_date, 
    game_modes.name,
    genres.name,
    id,
    involved_companies.company.name,
    involved_companies.developer,
    involved_companies.publisher,
    involved_companies.supporting,
    name,
    parent_game.name,
    parent_game.cover.image_id,
    parent_game.slug,
    platforms.abbreviation,
    player_perspectives.name,
    rating,
    rating_count,
    release_dates.human,
    release_dates.platform.abbreviation,
    release_dates.region,
    screenshots.image_id,
    similar_games.cover.image_id,
    similar_games.name,
    similar_games.slug,
    slug,
    storyline,
    summary,
    themes.name,
    total_rating,
    total_rating_count,
    videos.video_id,
    videos.name,
    websites.category,
    websites.url;
  where 
    slug = "${gameSlug}";`;

  const url = 'https://cors-anywhere.herokuapp.com/https://api.igdb.com/v4/games';
  const headers = {
    'Accept': 'application/json',
    'Client-ID': '7700pxy9nm01xjre1zxrn8pfk0eaqy',
    'Authorization': 'Bearer 6dhvah2trquct9fss21son34vcpzz1',
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body,
      mode: 'cors',
    });

    // throw error with HTTP code if API request failed
    if (!response.ok) {
      throw new Error(`HTTP error: Status ${response.status}`);
    }

    const data = await response.json();
    return data[0];
    
  } catch(error) {
    // verify error type before throwing new error
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error ('Unknown Error Has Occurred');
    }
  }
}

export default getGame;