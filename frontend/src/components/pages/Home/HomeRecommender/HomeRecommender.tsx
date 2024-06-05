import { useState, useEffect, createContext } from "react";
import { BacklogItemState } from "../../../../types/gameTypes";
import { getDbVectorsParams, DbGameResult } from "../../../../objects/ContentGameRecommender";
import ContentGameRecommender from "../../../../objects/ContentGameRecommender";
import RecommenderGameContainer from "./RecommenderGameContainer";
import { Status } from "../../../../types/gameTypes";

// TODO: OWN IMPLEMENTATION OF DATABSE RECOMMENDER FOR BACKLOG ONLY?

type HomeRecommenderContext = {
  data: RecommenderData;
  backlogSettings: BacklogSettings;
  setBacklogSettings: React.Dispatch<React.SetStateAction<BacklogSettings>>;
  databaseSettings: DatabaseSettings;
  setDatabaseSettings: React.Dispatch<React.SetStateAction<DatabaseSettings>>;
  filterSettings: FilterSettings;
  setFilterSettings: React.Dispatch<React.SetStateAction<FilterSettings>>;
  setUserVectorLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  setSimilarityCalculated: React.Dispatch<React.SetStateAction<boolean>>;
}

type HomeRecommenderProps = {
 backlogItems: BacklogItemState[];
}

export type BacklogSettings = {
  statuses: Status[];
}

export type DatabaseSettings = {
  genreDepth: number;
  years: number;
  platforms: string[];
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

export const HomeRecommenderContext = createContext<HomeRecommenderContext>({
  data: {sortedRegular: [], sortedReverse: []},
  backlogSettings: {statuses: []},
  setBacklogSettings: () => {},
  databaseSettings: {genreDepth: 0, years: 0, platforms: []},
  setDatabaseSettings: () => {},
  filterSettings: {similarity: 0, popularity: 0, rating: 0},
  setFilterSettings:() => {},
  setUserVectorLoaded: () => false,
  setSimilarityCalculated: () => false,
})

const HomeRecommender = ({backlogItems}: HomeRecommenderProps) => {
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState<RecommenderData>({
    sortedRegular: [],
    sortedReverse: [],
  })

  // recommender states
  const [recommender] = useState(new ContentGameRecommender(backlogItems));
  const [userVector, setUserVector] = useState<number[]>([])
  const [dbResults, setDbResults] = useState<getDbVectorsParams>({
    regularResults: {name: '', result: []},
    reverseResults: {name: '', result: []},
  })

  // user setting states
  const [backlogSettings, setBacklogSettings] = useState<BacklogSettings>({
    statuses: ['inProgress', 'completed'],
  })
  const [databaseSettings, setDatabaseSettings] = useState<DatabaseSettings>({
    genreDepth: 5,
    years: 0,
    platforms: [],
  })
  const [filterSettings, setFilterSettings] = useState<FilterSettings>({
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
        console.log('1...');
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
        console.log('2...');
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
      console.log('3...');
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
      <HomeRecommenderContext.Provider value={{
        data, 
        backlogSettings, 
        setBacklogSettings,
        databaseSettings, 
        setDatabaseSettings,
        filterSettings,
        setFilterSettings,
        setUserVectorLoaded,
        setSimilarityCalculated,
      }}>
        <RecommenderGameContainer/>
      </HomeRecommenderContext.Provider>
    )
  }
}

export default HomeRecommender;