import GameCoverArray from "../../../common/Cover/GameCoverArray";
import { CollaborativeGameRecommender } from "../../../../models/CollaborativeGameRecommender";
import { useState, useEffect } from "react";
import { Game } from "../../../../../../shared/types/gameTypes";
import { BacklogItemState } from "../../../../../../shared/types/gameTypes";

type BacklogRecommenderProps = {
  userBacklog: BacklogItemState[];
}

const BacklogRecommender = ({userBacklog}: BacklogRecommenderProps) => {
  const [data, setData] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getRecommendedGame = async () => {
      try {
        const recommender = new CollaborativeGameRecommender(userBacklog);
        const gameData: Game[] = await recommender.getCollaborativeRecommendation();
        setData(gameData);
      } catch (error) {
        setError('Error Loading Collaborative Data.');
      } finally {
        setLoading(false);
      }
    }

    getRecommendedGame();
  }, [])
  
  if (loading) {
    return <>Loading...</>
  }

  if (error) {
    return <>{error}</>
  }

  if (data) {
    return <GameCoverArray games={data}/>
  }
}

export default BacklogRecommender;