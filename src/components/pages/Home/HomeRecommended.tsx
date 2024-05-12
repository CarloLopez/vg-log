import { useState, useEffect } from "react";
import { BacklogItemState } from "../../../types/gameTypes";
import { Options, getDbVectorsParams } from "../../../objects/GameRecommender";
import GameRecommender from "../../../objects/GameRecommender";

// TODO: CHANGE USEEFFECT DEPENDENCIES BASED ON SPECIFIC OPTIONS, MAYBE OBJECT WITHIN OBJECT

type HomeRecommendedProps = {
 backlogItems: BacklogItemState[];
}

const HomeRecommended = ({backlogItems}: HomeRecommendedProps) => {
  
  const [loading] = useState(true);
  const [error, setError] = useState('');
  const [recommender] = useState(new GameRecommender(backlogItems));
  const [options] = useState<Options>({
    genreDepth: 3,
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
      // for both regular and reverse results
      const regularSimilarities = recommender.getCosineSimilarities(userVector, regularResults.result);
      const reverseSimilarities = recommender.getCosineSimilarities(userVector, reverseResults.result);

      // order the results based on user selection
      const sortedRegular = recommender.filterResults(regularSimilarities);
      const sortedReverse = recommender.filterResults(reverseSimilarities, true);

      console.log('reg');
      console.log(sortedRegular);
      console.log('rev');
      console.log(sortedReverse);

    } catch (error) {
      setError('Failed to Fetch Games from Database.');
    } 
  }, [userVectorLoaded, dbResultsLoaded, recommender, userVector, dbResults, options])

  if (error) {
    return <>{error}</>;
  }

  if (loading) {
    return <>Loading...</>;
  }
}

export default HomeRecommended;