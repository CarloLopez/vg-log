
type addNoteToBacklogParams = {
  username: string;
  gameId: number;
  note: {
    title: string;
    content: string;
  };
}

const addNoteToBacklog = async ({username, gameId, note}: addNoteToBacklogParams) => {
  const URL = import.meta.env.VITE_SERVER_BASE_URL;
  return await fetch(`${URL}/users/${username}/backlog/${gameId}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ note }),
  })
}

export default addNoteToBacklog;