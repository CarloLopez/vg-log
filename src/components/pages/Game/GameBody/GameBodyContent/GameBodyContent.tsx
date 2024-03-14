import SIDEBAR_ITEMS from "../GameBodySidebar/SideBarItems";
import { SidebarItem } from "../GameBodySidebar/SideBarItems";

type GameBodyContentProps = {
  content: string;
}

const GameBodyContent = ({content}: GameBodyContentProps) => {
  const selectedContent: SidebarItem | undefined = SIDEBAR_ITEMS.find((item) => item.id === content);
  
  return (
    <div>
      {selectedContent ? <selectedContent.component /> : <>Error: No Content Selected.</>}
    </div>
  );
}

export default GameBodyContent;