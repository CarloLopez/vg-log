
type deleteGoalFromBacklogParams = {
  username: string;
  gameId: number;
  goalId: number;
}

const deleteGoalFromBacklog = async ({username, gameId, goalId}: deleteGoalFromBacklogParams) => {
  const URL = import.meta.env.VITE_SERVER_BASE_URL;
  return await fetch(`${URL}/users/${username}/backlog/${gameId}/goals/${goalId}`, {
    method: 'DELETE',
  })
}

export default deleteGoalFromBacklog;