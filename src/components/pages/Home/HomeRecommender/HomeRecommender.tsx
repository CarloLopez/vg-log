import { useState, useEffect } from "react";
import { BacklogItemState } from "../../../../types/gameTypes";
import { Options, getDbVectorsParams, DbGameResult } from "../../../../objects/GameRecommender";
import GameRecommender from "../../../../objects/GameRecommender";
import RecommenderContainer from "./RecommenderContainer";

// TODO: CHANGE USEEFFECT DEPENDENCIES BASED ON SPECIFIC OPTIONS

type HomeRecommenderProps = {
 backlogItems: BacklogItemState[];
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

  const [recommender] = useState(new GameRecommender(backlogItems));
  const [options] = useState<Options>({
    genreDepth: 5,
    platforms: [0],
  })
  const [userVector, setUserVector] = useState<number[]>([])
  const [dbResults, setDbResults] = useState<getDbVectorsParams>({
    regularResults: {name: '', result: []},
    reverseResults: {name: '', result: []},
  })

  // execution states for synchronisation purposes
  const [userBacklogLoaded, setUserBacklogLoaded] = useState(false);
  const [userVectorLoaded, setUserVectorLoaded] = useState(false);
  const [dbResultsLoaded, setDbResultsLoaded] = useState(false);

  useEffect(() => {
    recommender.options = options;
  }, [recommender, options])

   // get user's backlog information prior to vectorisation
  useEffect(() => {
    const getBacklogInfo = async() => {
      try {
        await recommender.getBacklogInfo();
        setUserBacklogLoaded(true);
      } catch (error) {
        setError('Failed to Retrieve User Backlog Data.');
      } 
    }  
    getBacklogInfo();
  }, [recommender])

  // create user's vector based on backlog items
  useEffect(() => {
    if (!userBacklogLoaded) return;

    try {
      // get normalised frequency vector for games in user backlog.
      const userVector = recommender.calculateUserVector();
      setUserVector(userVector);
      setUserVectorLoaded(true);
    } catch (error) {
      setError('Failed to Load User Data.');
    } 
  }, [userBacklogLoaded, recommender, options])

  // retrieve list of games from IGDB API
  useEffect(() => {
    if (!userBacklogLoaded) return;

    const getDbResults = async() => {
      try {
        const dbResults = await recommender.getDbGames();
        setDbResults(dbResults);
        setDbResultsLoaded(true);
      } catch (error) {
        setError('Failed to Fetch Games from Database.');
      } 
    }  
    getDbResults();
  }, [userBacklogLoaded, recommender, options])

  // retrieve similarity results using user-specified options
  useEffect(() => {
    if (!userVectorLoaded || !dbResultsLoaded) return;

    try {
      // get genre vectors for IGDB database items
      const {regularResults, reverseResults} = recommender.getDbVectors(dbResults);

      // perform cosine similarity analysis for each IGDB game compared to the user vector
      // only for regular results, as reverse results (least played genre) tends to be low similarity by nature
      const regularSimilarities = recommender.getCosineSimilarities(userVector, regularResults.result);
      const reverseSimilarities = recommender.getCosineSimilarities(userVector, reverseResults.result);

      // order the results based on user selection
      const sortedRegular = recommender.filterResults(regularSimilarities);
      const sortedReverse = recommender.filterResults(reverseSimilarities, true);

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
  }, [userVectorLoaded, dbResultsLoaded, recommender, userVector, dbResults, options])

  if (error) {
    return <>{error}</>;
  }

  if (loading) {
    return <>Loading...</>;
  }

  if (data) {
    return (
      <RecommenderContainer data={data}/>
    )
  }
}

export default HomeRecommender;