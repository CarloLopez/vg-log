
type setGameCategoryParams = {
  username: string;
  gameId: number;
  categoryId: number;
}

const setGameCategory = async ({username, gameId, categoryId}: setGameCategoryParams) => {
  const URL = import.meta.env.VITE_SERVER_BASE_URL;
  return await fetch(`${URL}/users/${username}/backlog/${gameId}/category`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ categoryId: categoryId }),
  })
}

export default setGameCategory;