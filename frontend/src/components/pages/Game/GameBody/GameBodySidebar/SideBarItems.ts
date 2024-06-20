import React from "react";
import GameBodyGoals from "../GameBodyContent/GameBodyGoals/GameBodyGoals";
import GameBodyInfo from "../GameBodyContent/GameBodyInfo/GameBodyInfo";
import GameBodyMedia from "../GameBodyContent/GameBodyMedia";
import GameBodyNotes from "../GameBodyContent/GameBodyNotes/GameBodyNotes";
import GameBodySimilar from "../GameBodyContent/GameBodySimilar";

export type SidebarItem = {
  id: string;
  label: string;
  component: React.ComponentType;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  {id: 'goals', label: 'Goals', component: GameBodyGoals},
  {id: 'notes', label: 'Notes', component: GameBodyNotes},
  {id: 'media', label: 'Media', component: GameBodyMedia},
  {id: 'info', label: 'Info', component: GameBodyInfo},
  {id: 'similar', label: 'Similar', component: GameBodySimilar},
];

export default SIDEBAR_ITEMS;