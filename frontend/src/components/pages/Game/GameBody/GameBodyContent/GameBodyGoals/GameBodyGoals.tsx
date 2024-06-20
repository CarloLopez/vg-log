import { useState, useContext, useEffect } from "react";
import { UserDataContext } from "../../../GamePage";
import Goal from "../../../../../common/input/Goal";
import { GoalItem } from "../../../../../../../../shared/types/gameTypes";
import DialogBox from "../../../../../common/DialogBox";
import AddGoal from "./AddGoal";

const GameBodyGoals = () => {

  const {inBacklog, backlogData} = useContext(UserDataContext);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [goals, setGoals] = useState<GoalItem[]>([]);

  useEffect(() => {
    setGoals(backlogData.goals);
  }, [backlogData])

  const order = {'critical': 1, 'high': 2, 'medium': 3, 'low': 4, 'none': 5};
  const sortedGoals = goals.sort((a, b) => order[a.priority] - order[b.priority]);

  if (!inBacklog) {
    return <>Add Game to Backlog to Add Goals</>
  }

  return (
    <>
      <button onClick={() => setDialogOpen(true)}>ADD GOAL</button>
      <ul>
        {sortedGoals.map(goal => {
          return (
          <li key={goal.id}>
            <Goal 
              id={goal.id} 
              content={goal.content} 
              completed={goal.completed}
              priority={goal.priority}
              description={goal.description}
            />
          </li>
          )
        })}
      </ul>
      {dialogOpen ? (
      <DialogBox dialogOpen={dialogOpen} toggleVisibility={() => setDialogOpen(false)}>
        <AddGoal toggleVisibility={() => setDialogOpen(false)}/>
      </DialogBox> ) : ""}
    </>
  )
}

export default GameBodyGoals;