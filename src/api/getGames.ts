import { GamesFilter } from "../types/urlTypes";
import apiRequest from "./apiRequest";

const getGames = async (gamesFilter: GamesFilter) => {
  let query = '';

  let whereQuery = 'where parent_game=null & version_parent=null & category=(0,8,9,10,11,12) & cover!=null';

  if (gamesFilter.where) {
    for (const filter in gamesFilter.where) {
      let values = gamesFilter.where[filter];
      values = values.includes(',') ? `[${values}]` : `(${values})`;
      whereQuery += ` & ${filter}=${values}`;
    }
  }

  if (gamesFilter.minRating) {
    whereQuery += ` & total_rating >= ${gamesFilter.minRating}`;
  }

  query += `${whereQuery}; `;

  if (gamesFilter.search) {
    query += `search"${gamesFilter.search}; "`;
  }

  if (gamesFilter.sort) {
    query += `sort ${gamesFilter.sort} desc; `;
  }

  const limit = '25';
  let page = '1';

  if (gamesFilter.page) {
    page = gamesFilter.page;
  }

  query += `limit ${limit}; offset ${(Number(page) - 1) * Number(limit)};`;

  const body = `fields cover.image_id, name, slug; ${query}`;

  console.log(`API REQUEST: ${query}`);
  return await apiRequest(body);

}

export default getGames;