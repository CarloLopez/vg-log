import EditableBox from "./EditableBox";
import Dropdown from "../Array/Dropdown";
import { priorities } from "../../../../../shared/objects/filterObjects";
import { GoalItem, Priority } from "../../../../../shared/types/gameTypes";
import { useState, useContext } from "react";
import { GameDataContext } from "../../pages/Game/GamePage";
import { UserDataContext } from "../../pages/Game/GamePage";
import deleteGoalFromBacklog from "../../../api/database/deleteGoalFromBacklog";

const priorityList = priorities.map(priority => priority.value);

const Goal = ({id, content, completed, priority, description}: GoalItem) => {

  const gameData = useContext(GameDataContext);
  const {username, setBacklogData} = useContext(UserDataContext);
  const [completedChecked, setCompletedChecked] = useState(completed);
  const [showDescription, setShowDescription] = useState(false);

  const [error, setError] = useState('');
  const errorMessage = 'Error: Failed to Delete Goal From Backlog.';

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
        setError(errorMessage);
      }
    } catch (error) {
      setError(errorMessage);
    }
  }

  // TODO: ALSO UPDATE BACKEND IF CHANGE PRIORITY
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {

    setBacklogData(prevBacklogData => {
      const newBacklogData = {...prevBacklogData};
      const newGoals = [...newBacklogData.goals];

      const goal = newGoals.find(obj => obj.id === id);
      if (goal && priorityList.includes(e.target.value as Priority)) {
        goal.priority = e.target.value as Priority;
      }

      newBacklogData.goals = newGoals;
      return newBacklogData
    })
  }

  if (error) {
    return <>{error}</>
  }

  // TODO: UPDATE BACKEND FOR CHECKBOX, GOAL AND DESCRIPTION TEXT CHANGE
  return (
    <div>
      <EditableBox initialValue={content} updateFunction={() => {null}}/>
      <div>
        <label htmlFor="completed">Completed</label>
        <input 
          type="checkbox" 
          name="completed" 
          checked={completedChecked} 
          onChange={(e) => {
            const isChecked = e.target.checked;
            setCompletedChecked(isChecked);
          }}
        />
      </div>

      <div>
        <label>Priority</label>
        <Dropdown handleChange={handleChange} options={priorities} defaultSelection={priority}/>
      </div>

      <div>
        <button onClick={() => setShowDescription(state => !state)}>{showDescription ? "Hide Description" : "Show Description"}</button>
        {showDescription ? <EditableBox initialValue={description || ""} updateFunction={() => {null}}/> : ""}
      </div>

      <button onClick={deleteGoal}>DELETE GOAL</button>
    </div>
  )
}

export default Goal;