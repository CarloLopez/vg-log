import { GoalItem } from "../../../../../shared/types/gameTypes";
import { useState, useContext } from "react";
import { GameDataContext } from "../../pages/Game/GamePage";
import { UserDataContext } from "../../pages/Game/GamePage";
import editGoalInBacklog from "../../../api/database/editGoalInBacklog";
import deleteGoalFromBacklog from "../../../api/database/deleteGoalFromBacklog";
import DialogBox from "../DialogBox";
import EditGoal from "../../pages/Game/GameBody/GameBodyContent/GameBodyGoals/EditGoal";
import { priorities } from "../../../../../shared/objects/filterObjects";
import { Priority } from "../../../../../shared/types/gameTypes";

const Goal = ({id, content, completed, priority, description}: GoalItem) => {

  const gameData = useContext(GameDataContext);
  const {username, setBacklogData} = useContext(UserDataContext);
  const [completedChecked, setCompletedChecked] = useState(completed);
  const [showDescription, setShowDescription] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [error, setError] = useState('');

  const deleteGoal = async () => {
    try {
      const response = await deleteGoalFromBacklog({username, gameId: gameData.id, goalId: id});
      if (response.ok) {
        setBacklogData(prevBacklogData => {
          const newBacklogData = {...prevBacklogData};
          const newGoals = newBacklogData.goals.filter(goal => goal.id !== id);
          newGoals.forEach(goal => {
            if (goal.id > id) {
              goal.id--;
            }
          })
          newBacklogData.goals = newGoals;
          return newBacklogData;
        })
      } else {
        setError('Failed to delete goal.');
      }
    } catch (error) {
      setError('Failed to delete goal.');
    }
  }

  if (error) {
    return <>{error}</>
  }

  return (
    <>
      <div className="flex bg-slate-800 gap-2 p-2">

      <div className="flex justify-center items-center gap-1">
          <input 
            type="checkbox" 
            name="completed" 
            checked={completedChecked} 
            onChange={async (e) => {
              const isChecked = e.target.checked;

              const newGoal: GoalItem = {
                id: id,
                content: content,
                completed: isChecked,
                priority: priority,
              } 

              if (description) {
                newGoal.description = description;
              }
              
              try {
                const response = await editGoalInBacklog({username, gameId: gameData.id, goal: newGoal});
                if (response.ok) {
                  setBacklogData(prevBacklogData => {
                    const newBacklogData = {...prevBacklogData};
                    const curGoal = newBacklogData.goals.find(item => item.id === id) as GoalItem;
                    curGoal.completed = newGoal.completed;
                    return newBacklogData;
                  })
                  setCompletedChecked(isChecked);
                }
              } catch (error) {
                setError('Failed to edit goal.')
              }

            }}
            className="flex justify-center items-center"
          />
        </div>

        <div>
          <div className="font-bold">{content}</div>
          {description && (
            <div>
            {!showDescription && <button onClick={() => setShowDescription(state => !state)}>{showDescription ? "" : "Show Description"}</button>}
            {showDescription ? <div>{description}</div> : ""}
            </div>
          )}
          
          <div className="flex gap-1">
            <label>Priority -</label>
            <div>{priorities.find(item => item.value as Priority === priority)?.label}</div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setDialogOpen(true)}>EDIT</button>
            <button onClick={deleteGoal}>DELETE</button>
          </div>
          
          </div>
        </div>
        
      <DialogBox dialogOpen={dialogOpen} toggleVisibility={() => setDialogOpen(false)}>
        <EditGoal goalId={id} currentContent={content} currentDescription={description} currentPriority={priority} completed={completed} toggleVisibility={() => setDialogOpen(false)}/>
      </DialogBox>
    </>
  )
}

export default Goal;