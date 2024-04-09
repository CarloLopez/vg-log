import { GoalsContext } from "./GameBodyGoals";
import React, { useState, useContext } from "react";
import { Priority, GoalItem } from "../../../../../../types/gameTypes";
import { priorities } from "../../../../../../objects/filterObjects";
import Dropdown from "../../../../../common/Array/Dropdown";

type AddGoalProps = {
  toggleVisibility: () => void;
}

const AddGoal = ({toggleVisibility}: AddGoalProps) => {
  
  const {setGoals} = useContext(GoalsContext);
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('none');

  const priorityList = priorities.map(priority => priority.value);

  const handleChangeContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  }

  const handleChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
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
        const newGoal: GoalItem = {id: 0, content, completed: false, priority};
        if (description) {
          newGoal.description = description;
        }
        newGoals.push(newGoal);
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
          onChange={handleChangeContent}
        />
      </div>

      <div>
        <label>Priority</label>
        <Dropdown handleChange={handleChangeDropdown} options={priorities}/>
      </div>

      <div>
        <label>Description</label>
        <input 
          name="description" 
          type="text" 
          value={description} 
          placeholder="Enter Description (Optional)"
          onChange={handleChangeDescription}
        />
      </div>

      <button onClick={onClick}>CONFIRM</button>
    </div>
  )
}

export default AddGoal;