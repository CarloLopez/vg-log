import GameCoverArray from "../../../common/Cover/GameCoverArray";
import { CollaborativeGameRecommender } from "../../../../models/CollaborativeGameRecommender";
import { useState, useEffect } from "react";
import { Game } from "../../../../../../shared/types/gameTypes";
import { BacklogItem } from "../../../../../../shared/types/gameTypes";
import getBacklog from "../../../../api/getBacklog";

type BacklogRecommenderProps = {
  userBacklog: BacklogItem[];
}

const BacklogRecommender = ({userBacklog}: BacklogRecommenderProps) => {
  const [data, setData] = useState<Game[]>([]);
  const [random, setRandom] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getRecommendedGame = async () => {
      try {
        const recommender = new CollaborativeGameRecommender(userBacklog);
        const gameData: Game[] = await recommender.getCollaborativeRecommendation();

        if (gameData.length === 0) {
          const selectableGames = userBacklog.filter(game => game.status === 'notStarted' || game.status === 'inProgress');
          const randomSelection = selectableGames[Math.floor(Math.random() * selectableGames.length)].id;
          const randomGame: Game[] = await getBacklog([randomSelection]);
          setRandom(randomGame);
        }

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

  if (random.length > 0) {
    return (
      <div>
        No Similar Users Found to Make a Recommendation. Random Selection From Your Backlog:
        <GameCoverArray games={random} />
      </div>
    )
  }

  if (data.length > 0) {
    return <GameCoverArray games={data}/>
  }
}

export default BacklogRecommender;