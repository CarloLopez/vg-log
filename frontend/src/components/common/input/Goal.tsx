import EditableBox from "./EditableBox";
import Dropdown from "../Array/Dropdown";
import { priorities } from "../../../../../shared/objects/filterObjects";
import { GoalItem, Priority } from "../../../../../shared/types/gameTypes";
import { useState, useContext } from "react";
import { UserDataContext } from "../../pages/Game/GamePage";

const priorityList = priorities.map(priority => priority.value);

const Goal = ({id, content, completed, priority, description}: GoalItem) => {

  const {setBacklogData} = useContext(UserDataContext);
  const [completedChecked, setCompletedChecked] = useState(completed);
  const [showDescription, setShowDescription] = useState(false);

  // TODO ALSO UPDATE BACKEND IF CHANGE PRIORITY
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

      <button>DELETE GOAL</button>
    </div>
  )
}

export default Goal;