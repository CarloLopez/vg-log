import apiRequest from "./apiRequest";

const getBacklog = async (selectedGames: number[]) => {
  const body = `
  fields
    id,
    cover.image_id,
    name,
    slug;
  where
    id = (${selectedGames});
  limit 500;`;

  return await apiRequest(body);
}

export default getBacklog;