import { GoalItem } from "../../../../shared/types/gameTypes";

type editGoalInBacklogParams = {
  username: string;
  gameId: number;
  goal: GoalItem;
}

const editGoalInBacklog = async ({username, gameId, goal}: editGoalInBacklogParams) => {
  const URL = import.meta.env.VITE_SERVER_BASE_URL;
  return await fetch(`${URL}/users/${username}/backlog/${gameId}/goals/${goal.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content: goal.content, description: goal.description, completed: goal.completed, priority: goal.priority}),
  })
}

export default editGoalInBacklog;