import { useState } from "react";
import Note from "../../../../common/input/Note";
import { MOCK_NOTES } from "../../../../../mock-data/mockData";

const GameBodyNotes = () => {
  
  // TODO: GET SPECIFIC NOTES FROM BACKEND WHERE GAME ID MATCHES 
  const [notes, setNotes] = useState(MOCK_NOTES);

  const handleClick = () => {
    setNotes(prevNotes => {
      const curNotes = [...prevNotes];
      // change id here to free id in backend
      curNotes.unshift({id: 0, title: "", content: ""});
      return curNotes;
    })
  }
  
  return (
    <div>
      <button onClick={handleClick}>ADD NEW NOTE</button>
      <ul>
        {notes.map(note => {
          return <li key={note.id}><Note title={note.title} content={note.content}/></li>
        })}
      </ul>
    </div>
  );
}

export default GameBodyNotes;