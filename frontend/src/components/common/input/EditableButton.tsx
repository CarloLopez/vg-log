import { useState } from "react";

type EditableButtonProps = {
  id?: number;
  initialValue?: string;
  addDisabled: boolean;
  setAddDisabled: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditableButton = ({ id, initialValue, addDisabled, setAddDisabled }: EditableButtonProps) => {
  const [name, setName] = useState(initialValue);
  const [inputValue, setInputValue] = useState(initialValue);

  return (
    <div>
      <button>DELETE</button>
      {name ? (
        <>
          <button>{name}</button>
          <button
            onClick={() => {
              setName(undefined);
              setAddDisabled(true);
            }}
            disabled={addDisabled}
          >
            EDIT
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter Name"
            value={inputValue ?? ''}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
          <button
            onClick={() => {
              setName(inputValue);
              setAddDisabled(false);
              // TODO: logic to save to/update database 
              // and update parent 'categories' state
              console.log(id);
            }}
            disabled={inputValue?.trim() === ''}
          >
            SAVE
          </button>
        </>
      )}
    </div>
  );
};

export default EditableButton;