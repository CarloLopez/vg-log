
type deleteCategoryFromBacklogParams = {
  username: string;
  categoryId: number;
}

const deleteCategoryFromBacklog = async ({username, categoryId}: deleteCategoryFromBacklogParams) => {
  const URL = import.meta.env.VITE_SERVER_BASE_URL;
  return await fetch(`${URL}/users/${username}/categories/${categoryId}`, {
    method: 'DELETE',
  })
}

export default deleteCategoryFromBacklog;