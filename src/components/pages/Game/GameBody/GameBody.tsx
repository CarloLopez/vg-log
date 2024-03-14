import { useState } from "react";
import GameBodySidebar from "./GameBodySidebar/GameBodySidebar";
import GameBodyContent from "./GameBodyContent/GameBodyContent";

const GameBody = () => {
  
  const [currentSelection, setCurrentSelection] = useState('info');
  
  return (
    <div>
      <GameBodySidebar setCurrentSelection={setCurrentSelection}/>
      <GameBodyContent content={currentSelection}/>
    </div>
  );
}

export default GameBody;