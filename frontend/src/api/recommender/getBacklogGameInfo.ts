import apiRequest from "../apiRequest";

const getBacklogGameInfo = async (gameIds: number[]) => {  
  const body = `
  fields
    id,
    platforms,
    themes, 
    genres;
  where 
    id = (${gameIds});`
  
  return await apiRequest(body, 'games');
}

export default getBacklogGameInfo;