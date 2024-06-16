type changeGameStatusParams = {
  username: string;
  id: number;
  status: 'notStarted'|'inProgress'|'completed'|'dropped'
}

const changeGameStatus = async ({username, id, status}: changeGameStatusParams) => {
  const URL = import.meta.env.VITE_SERVER_BASE_URL;

  return await fetch(`${URL}/users/${username}/backlog/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
}

export default changeGameStatus;