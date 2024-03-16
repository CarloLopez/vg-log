import SIDEBAR_ITEMS from "./SideBarItems";

type GameBodySideBar = {
  setCurrentSelection: (value: string) => void
};

const GameBodySidebar = ({ setCurrentSelection }: GameBodySideBar) => {
  return (
    <ul>
      {SIDEBAR_ITEMS.map((item) => {
        return (
          // update selected state in GameBody when clicked
          <li key={item.id}><button onClick={() => setCurrentSelection(item.id)}>{item.label}</button></li>
        )
      })}
    </ul>
  );
}

export default GameBodySidebar;