
type editCategoryInBacklogParams = {
  username: string;
  categoryId: number;
  name: string;
}

const editCategoryInBacklog = async ({username, categoryId, name}: editCategoryInBacklogParams) => {
  const URL = import.meta.env.VITE_SERVER_BASE_URL;
  return await fetch(`${URL}/users/${username}/categories/${categoryId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: name }),
  })
}

export default editCategoryInBacklog;