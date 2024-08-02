import { UserDataContext } from "../../../GamePage";
import { GameDataContext } from "../../../GamePage";
import React, { useState, useContext } from "react";
import { Priority } from "../../../../../../../../shared/types/gameTypes";
import { priorities } from "../../../../../../../../shared/objects/filterObjects";
import Dropdown from "../../../../../common/Array/Dropdown";
import { BacklogItem, GoalItem } from "../../../../../../../../shared/types/gameTypes";
import editGoalInBacklog from "../../../../../../api/database/editGoalInBacklog";

type EditGoalProps = {
  goalId: number;
  toggleVisibility: () => void;
  currentContent: string;
  currentDescription: string|undefined;
  currentPriority: Priority;
  completed: boolean;
  
}

const EditGoal = ({goalId, toggleVisibility, currentContent, currentDescription, currentPriority, completed}: EditGoalProps) => {
  
  const gameData = useContext(GameDataContext);
  const {username, inBacklog, setBacklogData} = useContext(UserDataContext);
  const [content, setContent] = useState(currentContent);
  const [description, setDescription] = useState(currentDescription);
  const [priority, setPriority] = useState<Priority>(currentPriority);
  const [buttonDisabled, setButtonDisabled] = useState(false);

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

  const onClickEdit = async () => {
    
    if (content && priority && inBacklog) {
      setButtonDisabled(true);
      try {
        const goal: GoalItem = {id: goalId, content, completed, priority};
        if (description) {
          goal.description = description;
        }
        const response = await editGoalInBacklog({username, gameId: gameData.id, goal});
        
        if (response.ok) {
          setBacklogData(prevBacklogData => {
            const newBacklogData: BacklogItem = {...prevBacklogData};
            let oldGoal = newBacklogData.goals.find(goal => goal.id === goalId);

            if (oldGoal) {
              oldGoal.completed = completed;
              oldGoal.content = content;
              oldGoal.priority = priority;
              if (description) {
                oldGoal.description = description;
              } else {
                delete oldGoal.description;
              }
            }
            
            console.log(newBacklogData);
            return newBacklogData;
          })
          setButtonDisabled(false);
        }

        toggleVisibility();

      } catch (error) {
        console.log('Error Adding Goal.')
      }
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col">
        <label htmlFor="content">Goal</label>
        <input 
          name="content" 
          type="text" 
          value={content} 
          placeholder="Enter Goal"
          onChange={handleChangeContent}
          className="text-black"
        />
      </div>

      <div className="flex flex-col">
        <label>Description</label>
        <input 
          name="description" 
          type="text" 
          value={description} 
          placeholder="Enter Description (Optional)"
          onChange={handleChangeDescription}
          className="text-black"
        />
      </div>

      <div className="flex gap-2">
        <label>Priority</label>
        <Dropdown handleChange={handleChangeDropdown} options={priorities} defaultSelection={priority}/>
      </div>

      <button onClick={onClickEdit} disabled={buttonDisabled} className="hover:scale-105">CONFIRM</button>
    </div>
  )
}

export default EditGoal;