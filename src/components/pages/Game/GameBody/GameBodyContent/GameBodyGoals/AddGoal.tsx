import { GoalsContext } from "./GameBodyGoals";
import React, { useState, useContext } from "react";
import { Priority } from "../../../../../../types/gameTypes";
import { priorities } from "../../../../../../objects/filterObjects";
import Dropdown from "../../../../../common/Array/Dropdown";

type AddGoalProps = {
  toggleVisibility: () => void;
}

const AddGoal = ({toggleVisibility}: AddGoalProps) => {
  
  const {setGoals} = useContext(GoalsContext);
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<Priority>('none');

  const priorityList = priorities.map(priority => priority.value);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  }

  const handleChangeDropdown = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (priorityList.includes(e.target.value as Priority)) {
      setPriority(e.target.value as Priority);
    }
  }

  const onClick = () => {
    // TODO: UPDATE BACKLOG WHEN CONFIRM IS PRESSED
    setGoals(prevGoals => {
      const newGoals = [...prevGoals];
      if (content && priority) {
        newGoals.push({id: 0, content, completed: false, priority});
      }
      return newGoals;
    })
    toggleVisibility();
  }

  return (
    <div>
      <div>
        <label htmlFor="content">Goal</label>
        <input 
          name="content" 
          type="text" 
          value={content} 
          placeholder="Enter Goal"
          onChange={handleChangeInput}
        />
      </div>

      <div>
        <label>Priority</label>
        <Dropdown handleChange={handleChangeDropdown} options={priorities}/>
      </div>

      <button onClick={onClick}>CONFIRM</button>
    </div>
  )
}

export default AddGoal;