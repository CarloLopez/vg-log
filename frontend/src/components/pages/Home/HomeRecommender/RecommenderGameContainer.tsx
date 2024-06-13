import { useState, useContext } from "react";
import GameCoverArray from "../../../common/Cover/GameCoverArray";
import ToggleSwitch from "../../../common/ToggleSwitch";
import { HomeRecommenderContext } from "./HomeRecommender";
import { DbGameResult } from "../../../../models/ContentGameRecommender";
import RecommenderSettings from "./RecommenderSettings/RecommenderSettings";


const RecommenderGameContainer = () => {
  const {data} = useContext(HomeRecommenderContext);
  const [reverseClicked, setReverseClicked] = useState(false);
  const [advancedVisible, setAdvancedVisible] = useState(false);

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
      <button onClick={() => setAdvancedVisible(current => !current)}>{advancedVisible ? 'Hide Advanced' : 'Show Advanced'}</button>
      <RecommenderSettings visible={advancedVisible} />
      <GameCoverArray games={reverseClicked ? reverse : regular}/>
    </>
  )
}

export default RecommenderGameContainer;