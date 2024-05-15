import { useState, useEffect } from "react";
import { BacklogItemState } from "../../../../types/gameTypes";
import { getDbVectorsParams, DbGameResult } from "../../../../objects/GameRecommender";
import GameRecommender from "../../../../objects/GameRecommender";
import RecommenderGameContainer from "./RecommenderGameContainer";

// TODO: OWN IMPLEMENTATION OF DATABSE RECOMMENDER FOR BACKLOG ONLY

// TODO: CHANGE USEEFFECT DEPENDENCIES BASED ON SPECIFIC OPTIONS
/* 
  getBacklogInfo(): 
  - status of games filter
*/
/* 
  getDbResults(): 
  - genre depth impacts search space for API
  - release date of games to query for
  - platforms
*/
/* 
  # Filtering Final Results
  - weighting - similarity vs popularity vs rating
*/

type HomeRecommenderProps = {
 backlogItems: BacklogItemState[];
}

export type BacklogSettings = {
  inProgress: boolean;
  notStarted: boolean;
  completed: boolean;
  dropped: boolean;
}

export type DatabaseSettings = {
  genreDepth: number;
  years: number;
  platforms: number[];
}

export type FilterSettings = {
  similarity: number;
  popularity: number;
  rating: number;
}

export type RecommenderData = {
  sortedRegular: DbGameResult[];
  sortedReverse: DbGameResult[];
}

const HomeRecommender = ({backlogItems}: HomeRecommenderProps) => {
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState<RecommenderData>({
    sortedRegular: [],
    sortedReverse: [],
  })

  // recommender states
  const [recommender] = useState(new GameRecommender(backlogItems));
  const [userVector, setUserVector] = useState<number[]>([])
  const [dbResults, setDbResults] = useState<getDbVectorsParams>({
    regularResults: {name: '', result: []},
    reverseResults: {name: '', result: []},
  })

  const [backlogSettings] = useState<BacklogSettings>({
    inProgress: true,
    notStarted: false,
    completed: true,
    dropped: false,
  })

  const [databaseSettings] = useState<DatabaseSettings>({
    genreDepth: 5,
    years: 0,
    platforms: [],
  })

  const [filterSettings] = useState<FilterSettings>({
    similarity: 1,
    popularity: 0,
    rating: 0,
  })

  // execution states for synchronisation purposes
  const [userVectorLoaded, setUserVectorLoaded] = useState(false);
  const [similarityCalculated, setSimilarityCalculated] = useState(false);

  // get user's backlog information and create user vector
  useEffect(() => {
    const getBacklogInfo = async() => {
      try {
        await recommender.getBacklogInfo(backlogSettings);
        
        // get normalised frequency vector for games in user backlog.
        const userVector = recommender.calculateUserVector();
        setUserVector(userVector);
        setUserVectorLoaded(true);
      } catch (error) {
        setError('Failed to Load User Backlog Data.');
      } 
    }  
    getBacklogInfo();
  }, [recommender, backlogSettings])

  // retrieve list of games from IGDB API
  useEffect(() => {
    if (!userVectorLoaded) return;

    const getDbResults = async() => {
      try {
        const dbResults = await recommender.getDbGames(databaseSettings);
        setDbResults(dbResults);
        
        // get genre vectors for IGDB database items
        recommender.getDbVectors(dbResults);

        // perform cosine similarity analysis for each IGDB game compared to the user vector
        recommender.getCosineSimilarities(userVector, dbResults.regularResults.result);
        recommender.getCosineSimilarities(userVector, dbResults.reverseResults.result);

        setSimilarityCalculated(true);
      } catch (error) {
        setError('Failed to Fetch Games from Database.');
      } 
    }  
    getDbResults();
  }, [userVectorLoaded, recommender, userVector, databaseSettings])

  // filter and sort final results
  useEffect(() => {
    if (!similarityCalculated) return;

    try {
      // order the results based on user selection
      const sortedRegular = recommender.filterResults({
        results: dbResults.regularResults.result,
        reverse: false,
        filterSettings: filterSettings,
      });
      const sortedReverse = recommender.filterResults({
        results: dbResults.reverseResults.result,
        reverse: true,
        filterSettings: filterSettings,
      });

      console.log('reg');
      console.log(sortedRegular);
      console.log('rev');
      console.log(sortedReverse);

      setData({sortedRegular, sortedReverse});

    } catch (error) {
      setError('Error in Similarity Calculation.');
    } finally {
      setLoading(false);
    }
  }, [similarityCalculated, recommender, dbResults, filterSettings])

  if (error) {
    return <>{error}</>;
  }

  if (loading) {
    return <>Loading...</>;
  }

  if (data) {
    return (
      <RecommenderGameContainer data={data}/>
    )
  }
}

export default HomeRecommender;