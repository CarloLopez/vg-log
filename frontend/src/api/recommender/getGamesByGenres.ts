import apiRequest from "../apiRequest";
import { allowedCategories } from "../../../../shared/objects/filterObjects";

type getGamesByGenresParams = {
  regular: number[];
  reverse: number[];
  years: number;
  platforms: string[];
}

const getTimestamp = (years: number) => {
  const currentDate = new Date();
  const pastDate = new Date();

  pastDate.setFullYear(currentDate.getFullYear() - years);
  return Math.floor(pastDate.getTime() / 1000);
}

const getGamesByGenres = async ({regular, reverse, years, platforms}: getGamesByGenresParams) => {  

  const yearsTimestamp = years > 0 ? getTimestamp(years) : undefined;

  const subquery = (genreIds: number[]) => {
    const body = `
    fields
      id,
      cover.image_id,
      name,
      slug,
      total_rating,
      total_rating_count,
      themes,
      genres;
    where 
      genres = (${genreIds})
      & parent_game=null
      & version_parent=null
      & cover!=null
      & category=(${allowedCategories.join(',')})
      & rating >= 75
      & total_rating_count >= 50
      ${(yearsTimestamp ? '& first_release_date >= ' + yearsTimestamp : '')}
      & platforms=(${platforms.join(',')});
    limit
     500;`
    
    return body;
  }
  
  const body = `
  query games "regular" {
    ${subquery(regular)}
  };

  query games "reverse" {
    ${subquery(reverse)}
  };`
  
  console.log(body);
  return await apiRequest(body, 'multiquery');
}

export default getGamesByGenres;