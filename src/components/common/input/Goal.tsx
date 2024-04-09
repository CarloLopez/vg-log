import EditableBox from "./EditableBox";
import Dropdown from "../Array/Dropdown";
import { priorities } from "../../../objects/filterObjects";
import { GoalItem, Priority } from "../../../types/gameTypes";
import { useState, useContext } from "react";
import { GoalsContext } from "../../pages/Game/GameBody/GameBodyContent/GameBodyGoals/GameBodyGoals";

const priorityList = priorities.map(priority => priority.value);

const Goal = ({id, content, completed, priority}: GoalItem) => {

  const {setGoals} = useContext(GoalsContext);
  const [completedChecked, setCompletedChecked] = useState(completed);

  // TODO ALSO UPDATE BACKEND IF CHANGE PRIORITY
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGoals(prevGoals => {
      const newGoals = [...prevGoals];
      const goal = newGoals.find(obj => obj.id === id);
      if (goal && priorityList.includes(e.target.value as Priority)) {
        goal.priority = e.target.value as Priority;
      }
      return newGoals;
    })
  }

  // TODO: UPDATE BACKEND FOR CHECKBOX AND GOAL TEXT CHANGE
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
      <button>DELETE GOAL</button>
    </div>
  )
}

export default Goal;