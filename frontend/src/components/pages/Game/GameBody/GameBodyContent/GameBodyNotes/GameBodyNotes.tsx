import { useState, useContext } from "react";
import { UserDataContext } from "../../../GamePage";
import Note from "../../../../../common/input/Note";
import DialogBox from "../../../../../common/DialogBox";
import AddNote from "./AddNote";

const GameBodyNotes = () => {
  
  const {inBacklog, backlogData} = useContext(UserDataContext);
  
  const [dialogOpen, setDialogOpen] = useState(false);

  // order notes by most recently edited
  const notes = backlogData.notes.sort((a, b) => {
    // Ensure lastEdited is a Date object
    const dateA = new Date(a.lastEdited);
    const dateB = new Date(b.lastEdited);
    
    return dateB.getTime() - dateA.getTime();
});

  if (!inBacklog) {
    return <>Add Game to Backlog to Add Notes</>
  }
  
  return (
    <div className="flex flex-col gap-2">
      <button onClick={() => setDialogOpen(true)}>ADD NEW NOTE</button>
      <ul>
        {notes.map(note => {
          return <li key={note.id}><Note id={note.id} title={note.title} content={note.content} lastEdited={note.lastEdited}/></li>
        })}
      </ul>
      {dialogOpen ? (
      <DialogBox dialogOpen={dialogOpen} toggleVisibility={() => setDialogOpen(false)}>
        <AddNote toggleVisibility={() => setDialogOpen(false)}/>
      </DialogBox> ) : ""}
    </div>
  );
}

export default GameBodyNotes;