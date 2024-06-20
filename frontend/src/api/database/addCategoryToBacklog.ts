
type addCategoryToBacklogParams = {
  username: string;
  categoryName: string;
}

const addCategoryToBacklog = async ({username, categoryName}: addCategoryToBacklogParams) => {
  const URL = import.meta.env.VITE_SERVER_BASE_URL;
  return await fetch(`${URL}/users/${username}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ categoryName: categoryName }),
  })
}

export default addCategoryToBacklog;