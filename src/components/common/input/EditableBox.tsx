import React, { useState } from "react";

type EditableBoxProps = {
  initialValue: string;
  updateFunction: () => void;
}

const EditableBox = ({initialValue, updateFunction}: EditableBoxProps) => {
  
  const [editing, setEditing] = useState(!initialValue);
  const [value, setValue] = useState(initialValue);
  
  const handleDoubleClick = () => {
    setEditing(true);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }

  const handleBlur = () => {
    //TODO: PUT UPDATE HANDLE FUNCTION TO BACKEND HERE - updateFunction
    updateFunction();
    if (value) {
      setEditing(false);
    }
  }

  return (
    <div onDoubleClick={handleDoubleClick}>
      {
        (editing ? (
          <input type="text" value={value} placeholder="Add Text" onChange={handleChange} onBlur={handleBlur} autoFocus/>
        ) : (
          <div>{value}</div>
        ))
      }
    </div>
  )
}

export default EditableBox;