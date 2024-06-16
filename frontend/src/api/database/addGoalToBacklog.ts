
type addGoalToBacklogParams = {
  username: string;
  gameId: number;
  goal: {
    content: string;
    description: string;
    priority: 'critical'|'high'|'medium'|'low'|'none';
    completed: boolean;
  };
}

const addGoalToBacklog = async ({username, gameId, goal}: addGoalToBacklogParams) => {
  const URL = import.meta.env.VITE_SERVER_BASE_URL;
  return await fetch(`${URL}/users/${username}/backlog/${gameId}/goals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ goal }),
  })
}

export default addGoalToBacklog;