import { useState, useContext } from "react";
import { GameDataContext } from "../../GamePage";
import { UserDataContext } from "../../GamePage";
import Note from "../../../../common/input/Note";
import addNoteToBacklog from "../../../../../api/database/addNoteToBacklog";

const GameBodyNotes = () => {
  
  const gameData = useContext(GameDataContext);
  const {username, inBacklog, backlogData, setBacklogData} = useContext(UserDataContext);
  const [error, setError] = useState('');

  // order notes by most recently edited
  const notes = backlogData.notes.sort((a, b) => b.lastEdited.getTime() - a.lastEdited.getTime());

  const addNote = async () => {
    try {
      const response = await addNoteToBacklog({username, gameId: gameData.id, note: {title: "Edit Title...", content: "Edit Contents..."}});
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
  }

  if (!inBacklog) {
    return <>Add Game to Backlog to Add Notes</>
  }

  if (error) {
    return <>{error}</>
  }
  
  return (
    <div>
      <button onClick={addNote}>ADD NEW NOTE</button>
      <ul>
        {notes.map(note => {
          return <li key={note.id}><Note id={note.id} title={note.title} content={note.content} lastEdited={note.lastEdited}/></li>
        })}
      </ul>
    </div>
  );
}

export default GameBodyNotes;