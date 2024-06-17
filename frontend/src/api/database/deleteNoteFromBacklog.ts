
type deleteNoteFromBacklogParams = {
  username: string;
  gameId: number;
  noteId: number;
}

const deleteNoteFromBacklog = async ({username, gameId, noteId}: deleteNoteFromBacklogParams) => {
  const URL = import.meta.env.VITE_SERVER_BASE_URL;
  return await fetch(`${URL}/users/${username}/backlog/${gameId}/notes/${noteId}`, {
    method: 'DELETE',
  })
}

export default deleteNoteFromBacklog;