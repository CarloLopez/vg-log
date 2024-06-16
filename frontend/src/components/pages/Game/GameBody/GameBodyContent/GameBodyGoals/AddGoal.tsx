import { UserDataContext } from "../../../GamePage";
import { GameDataContext } from "../../../GamePage";
import React, { useState, useContext } from "react";
import { Priority } from "../../../../../../../../shared/types/gameTypes";
import { priorities } from "../../../../../../../../shared/objects/filterObjects";
import Dropdown from "../../../../../common/Array/Dropdown";
import addGoalToBacklog from "../../../../../../api/database/addGoalToBacklog";
import { BacklogItem } from "../../../../../../../../shared/types/gameTypes";

type AddGoalProps = {
  toggleVisibility: () => void;
}

const AddGoal = ({toggleVisibility}: AddGoalProps) => {
  
  const gameData = useContext(GameDataContext);
  const {username, inBacklog, setBacklogData} = useContext(UserDataContext);
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('high');

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

  const onClick = async () => {
    
    if (content && priority && inBacklog) {
      try {
        const response = await addGoalToBacklog({username, gameId: gameData.id, goal: {content, priority, completed: false, description}});
        const newGoal = await response.json();

        setBacklogData(prevBacklogData => {
          const newBacklogData: BacklogItem = {...prevBacklogData};
          const newGoals = [...prevBacklogData.goals];
          newGoals.push(newGoal);
          
          newBacklogData.goals = newGoals;

          return newBacklogData;
        })


        toggleVisibility();

      } catch (error) {
        console.log('ERRRRRRRRRRRRRRRRRRRR')
      }
    }
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
        <Dropdown handleChange={handleChangeDropdown} options={priorities} defaultSelection={priority}/>
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