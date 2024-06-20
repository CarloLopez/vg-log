import { BacklogPageContext } from "../../pages/Backlog/BacklogPage";
import { useState, useContext, useEffect } from "react";
import EditableButton from "../input/EditableButton";

type LocalCategories = {
  id: number;
  name?: string;
}

type CategoriesContainerProps = {
  gameId: number;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CategoriesContainer = ({gameId, setDialogOpen}: CategoriesContainerProps) => {
  
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
            setlocalCategories([...localCategories, {id: localCategories.length}]);
          }}
        >
          ADD NEW
        </button>
      <ul>
        {
          localCategories.map(category => {
            return <li key={category.id || 'temp'}><EditableButton gameId={gameId} categoryId={category.id} initialValue={category.name} addDisabled={addDisabled} setAddDisabled={setAddDisabled} setDialogOpen={setDialogOpen}/></li>
          })
        }
      </ul>
    </div>
  )
}

export default CategoriesContainer;