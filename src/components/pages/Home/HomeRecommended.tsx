import { useState, useEffect } from "react";
import { BacklogItem } from "../../../types/gameTypes";
import { BacklogItemState } from "../../../types/gameTypes";
import GameRecommender from "../../../objects/GameRecommender";


type HomeRecommendedProps = {
 backlogItems: BacklogItemState[];
}

const HomeRecommended = ({backlogItems}: HomeRecommendedProps) => {
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data] = useState<BacklogItem[]>([]);


  useEffect(() => {

      const getData = async() => {
        try {
          
          const recommender = new GameRecommender(backlogItems);

          // get normalised frequency vector for games in user backlog.
          const userVector = await recommender.getUserVector();
          
          // get genre vectors for IGDB database items
          const dbVectors = await recommender.getDbVectors();

          // perform cosine similarity analysis for each IGDB game compared to the user vector
          const cosineSimilarities = recommender.getCosineSimilarities(userVector, dbVectors);

          console.log(cosineSimilarities);

        } catch (error) {
          setError('Failed to Load User Data.');
        } finally {
          setLoading(false);
        }
      }  

      getData();
  }, [backlogItems])
  
  if (loading) {
    return <>Loading...</>;
  }

  if (error) {
    return <>{error}</>;
  }

  if (data) {
    return (
      <div>
      </div>
    );
  }
}

export default HomeRecommended;