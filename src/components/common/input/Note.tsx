import EditableBox from "./EditableBox";

type NoteProps = {
  title: string;
  content: string;
}

const Note = ({title, content}: NoteProps) => {

  // TODO: PASS IN BACKEND UPDATE FUNCTIONS TO TITLE AND CONTENT

  return (
    <div>
      <label>Title</label>
      <EditableBox initialValue={title} updateFunction={() => {null}}/>
      <label>Note</label>
      <EditableBox initialValue={content} updateFunction={() => {null}}/>
      <button>DELETE NOTE</button>
    </div>
  )
}

export default Note;