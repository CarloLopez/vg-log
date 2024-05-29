import { useState, useEffect } from "react";
import GameBodySidebar from "./GameBodySidebar/GameBodySidebar";
import GameBodyContent from "./GameBodyContent/GameBodyContent";
import { SetURLSearchParams } from "react-router-dom";
import SIDEBAR_ITEMS from "./GameBodySidebar/SideBarItems";

type GameBodyProps = {
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
}

const GameBody = ({searchParams, setSearchParams}: GameBodyProps) => {
  
  const [currentSelection, setCurrentSelection] = useState("info");

  useEffect(() => {
    const selection = searchParams.get('tab');
    const sidebarItems = SIDEBAR_ITEMS.map(item => item.id);
    if (selection && sidebarItems.includes(selection)) {
      setCurrentSelection(selection);
    }
  }, [searchParams])
  
  return (
    <div>
      <GameBodySidebar setSearchParams={setSearchParams}/>
      <GameBodyContent content={currentSelection}/>
    </div>
  );
}

export default GameBody;