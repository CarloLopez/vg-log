type addGameToBacklogParams = {
  username: string;
  id: number;
}

const addGameToBacklog = async ({username, id}: addGameToBacklogParams) => {
  const URL = import.meta.env.VITE_SERVER_BASE_URL;
  return await fetch(`${URL}/users/${username}/backlog`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ game: { id: id, status: 'notStarted', category: null } }),
  })
}

export default addGameToBacklog;