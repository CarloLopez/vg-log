import apiRequest from "../apiRequest";

const getGameGenres = async (gameIds: number[]) => {  
  const body = `
  fields
    id, 
    genres;
  where 
    id = (${gameIds});`
  
  return await apiRequest(body);
}

export default getGameGenres;