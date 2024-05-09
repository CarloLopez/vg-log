import apiRequest from "../apiRequest";
import { allowedCategories } from "../../objects/filterObjects";

const getGamesByGenres = async (genreIds: number[]) => {  
  const body = `
  fields
    id,
    cover.image_id,
    name,
    slug,
    hypes,
    genres;
  where 
    genres = (${genreIds})
    & parent_game=null
    & version_parent=null
    & cover!=null
    & category=(${allowedCategories.join(',')})
    & rating != null;
  sort
    hypes desc;
  limit
   500;`
  
  return await apiRequest(body);
}

export default getGamesByGenres;