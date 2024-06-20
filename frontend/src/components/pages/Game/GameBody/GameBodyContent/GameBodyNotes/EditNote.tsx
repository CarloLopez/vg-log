import { UserDataContext } from "../../../GamePage";
import { GameDataContext } from "../../../GamePage";
import React, { useState, useContext } from "react";
import editNoteInBacklog from "../../../../../../api/database/editNoteInBacklog";

type EditNoteProps = {
  id: number;
  currentTitle: string;
  currentContent: string;
  toggleVisibility: () => void;
}

const EditNote = ({id, currentTitle, currentContent, toggleVisibility}: EditNoteProps) => {
  
  const gameData = useContext(GameDataContext);
  const {username, inBacklog, setBacklogData} = useContext(UserDataContext);
  const [title, setTitle] = useState(currentTitle);
  const [content, setContent] = useState(currentContent);
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
        const response = await editNoteInBacklog({username, gameId: gameData.id, note: {id, title, content}});
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setBacklogData(prevBacklogData => {
            const updatedNotes = prevBacklogData.notes.map(note => {
              if (note.id === id) {
                return {
                  ...note,
                  title,
                  content,
                  lastEdited: new Date(),
                };
              }
              return note;
            });
  
            return {
              ...prevBacklogData,
              notes: updatedNotes,
            };
          });
        } else {
          setError('Error Editing Note.');
        }
      } catch (error) {
        setError('Error Editing Note.');
      }
  
      toggleVisibility();
    }
  };

  if (error) {
    return <>{error}</>
  }

  return (
    <div>
      <div>
        <label htmlFor="content">Title</label>
        <input 
          name="conttitleent" 
          type="text" 
          value={title} 
          placeholder="Enter Title"
          onChange={handleChangeTitle}
        />
      </div>

      <div>
        <label>Note</label>
        <input 
          name="content" 
          type="text" 
          value={content} 
          placeholder="Enter Note"
          onChange={handleChangeContent}
        />
      </div>

      <button onClick={onClick}>CONFIRM</button>
    </div>
  )
}

export default EditNote;