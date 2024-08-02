import { UserDataContext } from "../../../GamePage";
import { GameDataContext } from "../../../GamePage";
import React, { useState, useContext } from "react";
import addNoteToBacklog from "../../../../../../api/database/addNoteToBacklog";

type AddNoteProps = {
  toggleVisibility: () => void;
}

const AddNote = ({toggleVisibility}: AddNoteProps) => {
  
  const gameData = useContext(GameDataContext);
  const {username, inBacklog, setBacklogData} = useContext(UserDataContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');


  const handleChangeContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  }

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }

  const onClick = async () => {
    
    if (content && title && inBacklog) {
      try {
        const response = await addNoteToBacklog({username, gameId: gameData.id, note: {title, content}});
        if (response.ok) {
          const data = await response.json();
  
          setBacklogData(prevBacklogData => {
            const newBacklogData = {...prevBacklogData};
            const newNotes = [...newBacklogData.notes];
            newNotes.push(data);
            newBacklogData.notes = newNotes;
  
            return newBacklogData;
          })
        } else {
          setError('Error Adding Note.')
        }
      } catch (error) {
        setError('Error Adding Note.');
      }

      toggleVisibility();
    }
  }

  if (error) {
    return <>{error}</>
  }

  return (
    <div className="flex flex-col justify-center items-center gap-2">
      <div className="flex flex-col">
        <label htmlFor="content">Title</label>
        <input 
          name="conttitleent" 
          type="text" 
          value={title} 
          placeholder="Enter Title"
          onChange={handleChangeTitle}
          className="text-black"
        />
      </div>

      <div className="flex flex-col">
        <label>Note</label>
        <input 
          name="content" 
          type="text" 
          value={content} 
          placeholder="Enter Note"
          onChange={handleChangeContent}
          className="text-black"
        />
      </div>

      <button onClick={onClick} className="hover:scale-105">CONFIRM</button>
    </div>
  )
}

export default AddNote;