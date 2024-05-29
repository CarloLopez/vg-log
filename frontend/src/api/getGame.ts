import apiRequest from "./apiRequest";

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
  where slug = "${gameSlug}";`

  return await apiRequest(body, 'games');
}

export default getGame;