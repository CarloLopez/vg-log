import { MOCK_GOALS } from "../../../../../../../../shared/mock-data/mockData";
import { useState, createContext } from "react";
import { GoalItem } from "../../../../../../../../shared/types/gameTypes";
import Goal from "../../../../../common/input/Goal";
import DialogBox from "../../../../../common/DialogBox";
import AddGoal from "./AddGoal";

type GoalsContext = {
  setGoals: React.Dispatch<React.SetStateAction<GoalItem[]>>;
}

//TODO: ADD GOAL AND QUERY BACKEND FOR ID
export const GoalsContext = createContext<GoalsContext>({
  setGoals: () => {},
});

const GameBodyGoals = () => {

  const [goals, setGoals] = useState(MOCK_GOALS);
  const [dialogOpen, setDialogOpen] = useState(false);

  const order = {'critical': 1, 'high': 2, 'medium': 3, 'low': 4, 'none': 5};
  const sortedGoals = goals.sort((a, b) => order[a.priority] - order[b.priority]);

  console.log(goals);

  return (
    <GoalsContext.Provider value={{setGoals}}>
      <button onClick={() => setDialogOpen(true)}>ADD GOAL</button>
      <ol>
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
      </ol>
      {dialogOpen ? (
      <DialogBox dialogOpen={dialogOpen} toggleVisibility={() => setDialogOpen(false)}>
        <AddGoal toggleVisibility={() => setDialogOpen(false)}/>
      </DialogBox> ) : ""}
    </GoalsContext.Provider>
  )
}

export default GameBodyGoals;