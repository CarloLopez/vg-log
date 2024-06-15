type removeGameFromBacklogParams = {
  username: string;
  id: number;
}

const removeGameFromBacklog = async ({username, id}: removeGameFromBacklogParams) => {
  const URL = import.meta.env.VITE_SERVER_BASE_URL;
  return await fetch(`${URL}/users/${username}/backlog/${id}`, {
    method: 'DELETE',
  })
}

export default removeGameFromBacklog;