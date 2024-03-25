import { GamesFilter } from "../types/urlTypes";
import apiRequest from "./apiRequest";
import { gamePlatforms } from "../objects/filterObjects";

const allowedPlatforms = gamePlatforms.map(platform => platform.id);
const allowedCategories = [0, 8, 9, 10, 11, 12];

const getGames = async (gamesFilter: GamesFilter) => {
  let query = '';

  let whereQuery = `where parent_game=null & version_parent=null & cover!=null & category=(${allowedCategories.join(',')})`;

  if (gamesFilter.where) {
    for (const filter in gamesFilter.where) {
      let values = gamesFilter.where[filter];
      values = values.includes(',') ? `[${values}]` : `(${values})`;
      whereQuery += ` & ${filter}=${values}`;
    }
  }

  if (!whereQuery.includes(' & platforms=')) whereQuery += ` & platforms=(${allowedPlatforms.join(',')})`;

  if (gamesFilter.minRating) {
    whereQuery += ` & total_rating >= ${gamesFilter.minRating}`;
  }

  query += `${whereQuery}; `;

  if (gamesFilter.search) {
    query += `search"${gamesFilter.search}"; `;
  }

  if (gamesFilter.sort) {
    query += `sort ${gamesFilter.sort} desc; `;
  }

  const limit = '500';

  query += `limit ${limit};`;

  const body = `fields cover.image_id, name, slug; ${query}`;

  console.log(`API REQUEST: ${query}`);
  return await apiRequest(body);

}

export default getGames;