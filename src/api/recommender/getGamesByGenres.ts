import apiRequest from "../apiRequest";
import { allowedCategories } from "../../objects/filterObjects";

type getGamesByGenresParams = {
  regular: number[];
  reverse: number[];
}

function subquery(genreIds: number[]) {
  const body = `
  fields
    id,
    cover.image_id,
    name,
    slug,
    total_rating_count,
    genres;
  where 
    genres = (${genreIds})
    & parent_game=null
    & version_parent=null
    & cover!=null
    & category=(${allowedCategories.join(',')})
    & rating != null;
  sort
    total_rating_count desc;
  limit
   500;`

  return body;
}

const getGamesByGenres = async ({regular, reverse}: getGamesByGenresParams) => {  
  const body = `
  query games "regular" {
    ${subquery(regular)}
  };

  query games "reverse" {
    ${subquery(reverse)}
  };`
  
  return await apiRequest(body, 'multiquery');
}

export default getGamesByGenres;