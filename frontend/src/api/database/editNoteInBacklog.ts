
type editGoalInBacklogParams = {
  username: string;
  gameId: number;
  note: {
    id: number;
    title: string;
    content: string;
  }
}

const editNoteInBacklog = async ({username, gameId, note}: editGoalInBacklogParams) => {
  const URL = import.meta.env.VITE_SERVER_BASE_URL;
  return await fetch(`${URL}/users/${username}/backlog/${gameId}/notes/${note.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title: note.title, content: note.content }),
  })
}

export default editNoteInBacklog;