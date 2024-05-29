import { BacklogPageContext } from "../../pages/Backlog/BacklogPage";
import { useState, useContext, useEffect } from "react";
import EditableButton from "../input/EditableButton";

const CategoriesContainer = () => {
  
  type LocalCategories = {
    id?: number;
    name?: string;
  }
  
  const {categories} = useContext(BacklogPageContext);
  const [localCategories, setlocalCategories] = useState<LocalCategories[]>([]);
  const [addDisabled, setAddDisabled] = useState(false);

  // update local category copy every time parent categories state changes
  useEffect(() => {
    setlocalCategories([...categories]);
  }, [categories])

  return (
    <div>
        <button 
          disabled={addDisabled}
          onClick={() => {
            setAddDisabled(true);
            setlocalCategories([{}, ...localCategories]);
          }}
        >
          ADD NEW
        </button>
      <ul>
        {
          localCategories.map(category => {
            return <li key={category.id || 0}><EditableButton id={category.id} initialValue={category.name} addDisabled={addDisabled} setAddDisabled={setAddDisabled}/></li>
            // TODO: ADD ONCLICK TO CHANGE CATEGORY
          })
        }
      </ul>
    </div>
  )
}

export default CategoriesContainer;