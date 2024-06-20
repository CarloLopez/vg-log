import { useState, useContext } from "react";
import addCategoryToBacklog from "../../../api/database/addCategoryToBacklog";
import { LoginContext } from "../../../App";
import { BacklogPageContext } from "../../pages/Backlog/BacklogPage";
import { Category } from "../../../../../shared/types/gameTypes";
import setGameCategory from "../../../api/database/setGameCategory";
import deleteCategoryFromBacklog from "../../../api/database/deleteCategory";
import editCategoryInBacklog from "../../../api/database/editCategoryInBacklog";

type EditableButtonProps = {
  gameId: number;
  categoryId: number;
  initialValue?: string;
  addDisabled: boolean;
  setAddDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditableButton = ({gameId, categoryId, initialValue, addDisabled, setAddDisabled, setDialogOpen }: EditableButtonProps) => {
  
  const {username} = useContext(LoginContext);
  const {setCategories, setData} = useContext(BacklogPageContext);
  
  const [name, setName] = useState(initialValue);
  const [inputValue, setInputValue] = useState(initialValue);
  const [editing, setEditing] = useState(false);

  const [error, setError] = useState('');

  const addCategory = async () => {
    if (inputValue) {
      try {
        const response = await addCategoryToBacklog({username, categoryName: inputValue});

        if (response.ok) {
          const newCategory: Category = await response.json();
          setCategories(prevCategories => {
            return [...prevCategories, newCategory];
          })
          setName(inputValue);
          setAddDisabled(false);
        }

      } catch (error) {
        setError ('Error Adding Category.')
      }
    } 
  }

  const setCategory = async () => {
    try {
      const response = await setGameCategory({username, gameId, categoryId});
      if (response.ok) {
        setData(prevData => {
          const newData = [...prevData];
          const curGame = newData.find(game => game.game.id === gameId);
          if (curGame) {
            if (curGame.state.category === categoryId) {
              curGame.state.category = null;
            } else {
              curGame.state.category = categoryId;
            }
          }
          return newData;
        })
        setDialogOpen(false);
      }
    } catch (error) {
      setError('Error Updating Game Category.');
    }
  }

  const deleteCategory = async () => {
    try {
      const response = await deleteCategoryFromBacklog({username, categoryId});
      if (response.ok) {
        setData(prevData => {
          const newData = [...prevData];

          newData.forEach(item => {
            if (item.state.category === categoryId) {
              item.state.category = null;
            }
          })

          return newData;
        })
        setCategories(prevCategories => {
          const newCategories = prevCategories.filter(category => category.id !== categoryId);
          return newCategories;
        })
     }
    } catch (error) {
      setError('Error Deleting Category.');
    }
  }

  const editCategory = async () => {
    
    if (inputValue) {
      try {
        const response = await editCategoryInBacklog({username, categoryId, name: inputValue});
        if (response.ok) {
          setCategories(prevCategories => {
            const newCategories = [...prevCategories];
            const selected = newCategories.find(category => category.id === categoryId);
            if (selected) {
              selected.name = inputValue;
            }
            return newCategories;
          })
          setName(inputValue);
          setAddDisabled(false);
        }
      } catch (error) {
        setError('Error Editing Category Name.');
      }
    }
    
  }

  if (error) {
    return <>{error}</>
  }

  return (
    <div>
      <button onClick={deleteCategory}>DELETE</button>
      {name ? (
        <>
          <button onClick={setCategory}>{name}</button>
          <button
            onClick={() => {
              setName(undefined);
              setAddDisabled(true);
              setEditing(true);
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
            onClick={async () => {

              if (editing) {
                editCategory();
              } else {
                addCategory();
              }

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