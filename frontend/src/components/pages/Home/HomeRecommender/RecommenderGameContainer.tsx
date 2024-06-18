import { useState, useContext } from "react";
import GameCoverArray from "../../../common/Cover/GameCoverArray";
import ToggleSwitch from "../../../common/ToggleSwitch";
import { HomeRecommenderContext } from "./HomeRecommender";
import { DbGameResult } from "../../../../models/ContentGameRecommender";

const RecommenderGameContainer = () => {
  const {data} = useContext(HomeRecommenderContext);
  const [reverseClicked, setReverseClicked] = useState(false);

  const cleanData = (data: DbGameResult[]) => {
    return data.map(game => {
      return {
        id: game.id,
        name: game.name,
        cover: game.cover,
        slug: game.slug
      }
    })
  }

  const regular = cleanData(data.sortedRegular);
  const reverse = cleanData(data.sortedReverse);

  const handleToggle = () => {
    setReverseClicked(current => !current);
  }

  return (
    <>
      <ToggleSwitch stateA="Regular" stateB="Reverse" handleToggle={handleToggle}/>
      <GameCoverArray games={reverseClicked ? reverse : regular}/>
    </>
  )
}

export default RecommenderGameContainer;