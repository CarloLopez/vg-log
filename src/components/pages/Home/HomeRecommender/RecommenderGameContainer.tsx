import { useState } from "react";
import { DbGameResult } from "../../../../objects/GameRecommender";
import { RecommenderData } from "./HomeRecommender";
import GameCoverArray from "../../../common/Cover/GameCoverArray";
import ToggleSwitch from "../../../common/ToggleSwitch";

type RecommenderGameContainerProps = {
  data: RecommenderData;
}

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

const RecommenderGameContainer = ({data}: RecommenderGameContainerProps) => {

  const [reverseClicked, setReverseClicked] = useState(false);

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