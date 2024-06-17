import { useState, useContext } from "react";
import { UserDataContext } from "../../pages/Game/GamePage";
import { GameDataContext } from "../../pages/Game/GamePage";
import EditableBox from "./EditableBox";
import { NoteItem } from "../../../../../shared/types/gameTypes";
import deleteNoteFromBacklog from "../../../api/database/deleteNoteFromBacklog";

const Note = ({id, title, content}: NoteItem) => {

  // TODO: PASS IN BACKEND UPDATE FUNCTIONS TO TITLE AND CONTENT

  const gameData = useContext(GameDataContext);
  const {username, setBacklogData} = useContext(UserDataContext);

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
    return <div>{error}</div>
  }

  return (
    <div>
      <label>Title</label>
      <EditableBox initialValue={title} updateFunction={() => {null}}/>
      <label>Note</label>
      <EditableBox initialValue={content} updateFunction={() => {null}}/>
      <button onClick={deleteNote}>DELETE NOTE</button>
    </div>
  )
}

export default Note;