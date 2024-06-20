import { useState, useContext } from "react";
import { GameDataContext } from "../../pages/Game/GamePage";
import { UserDataContext } from "../../pages/Game/GamePage";
import deleteNoteFromBacklog from "../../../api/database/deleteNoteFromBacklog";
import DialogBox from "../DialogBox";
import EditNote from "../../pages/Game/GameBody/GameBodyContent/GameBodyNotes/EditNote";
import { NoteItem } from "../../../../../shared/types/gameTypes";

const Goal = ({id, content, title}: NoteItem) => {

  const gameData = useContext(GameDataContext);
  const {username, setBacklogData} = useContext(UserDataContext);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [error, setError] = useState('');

  const deleteNote = async () => {
    const errorMessage = 'Error Deleting Note.'
    try {
      const response = await deleteNoteFromBacklog({username, gameId: gameData.id, noteId: id});
      if (response.ok) {
        setBacklogData(prevBacklogData => {
          const newBacklogData = {...prevBacklogData};
          const newNotes = newBacklogData.notes.filter(note => note.id !== id);
          newNotes.forEach(note => {
            if (note.id > id) {
              note.id--;
            }
          })
          newBacklogData.notes = newNotes;
          return newBacklogData;
        })
      } else {
        setError(errorMessage);
      }
    } catch (error) {
      setError(errorMessage);
    }
  }

  if (error) {
    return <>{error}</>
  }

  return (
    <>
      <div>
        
        <div>
          <label>Title</label>
          <div>{title}</div>
        </div>

        <div>
          <label>Note</label>
          <div>{content}</div>
        </div>

        <button onClick={() => setDialogOpen(true)}>EDIT</button>
        <button onClick={deleteNote}>DELETE</button>
        
      </div>
      <DialogBox dialogOpen={dialogOpen} toggleVisibility={() => setDialogOpen(false)}>
        <EditNote id={id} currentContent={content} currentTitle={title} toggleVisibility={() => setDialogOpen(false)}/>
      </DialogBox>
    </>
  )
}

export default Goal;