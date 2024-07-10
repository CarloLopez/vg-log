import { useState, useEffect, createContext } from "react";
import { BacklogItem } from "../../../../../../shared/types/gameTypes";
import { getDbVectorsParams, DbGameResult } from "../../../../models/ContentGameRecommender";
import ContentGameRecommender from "../../../../models/ContentGameRecommender";
import RecommenderGameContainer from "./RecommenderGameContainer";
import { Status } from "../../../../../../shared/types/gameTypes";
import RecommenderSettings from "./RecommenderSettings/RecommenderSettings";

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
  userStatuses: Status[];
}

type HomeRecommenderProps = {
 backlogItems: BacklogItem[];
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
  userStatuses: [],
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

  // set advanced status selection based on current backlog
  const initialStatusSelection = (): Status[] => {
    let userStatuses = Array.from(new Set(backlogItems.map(game => game.status)));
    if (userStatuses.length > 1 && userStatuses.includes('dropped')) {
      userStatuses = userStatuses.filter(status => status !== 'dropped');
    }
    return userStatuses;
  }

  // user setting states
  const [backlogSettings, setBacklogSettings] = useState<BacklogSettings>({
    statuses: initialStatusSelection()
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
  const [userStatuses] = useState<Status[]>(initialStatusSelection());

  // execution states for synchronisation purposes
  const [userVectorLoaded, setUserVectorLoaded] = useState(false);
  const [similarityCalculated, setSimilarityCalculated] = useState(false);

  // advanced settings visibility
  const [advancedVisible, setAdvancedVisible] = useState(false);

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
        setLoading(false);
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
      let sortedRegular = recommender.filterResults({
        results: dbResults.regularResults.result,
        reverse: false,
        filterSettings: filterSettings,
      });
      let sortedReverse = recommender.filterResults({
        results: dbResults.reverseResults.result,
        reverse: true,
        filterSettings: filterSettings,
      });

      // don't suggest games already in a user's backlog
      const backlogIds = backlogItems.map(game => game.id);

      console.log(sortedRegular);

      sortedRegular = sortedRegular.filter(game => !backlogIds.includes(game.id)).slice(0, 25);
      sortedReverse = sortedReverse.filter(game => !backlogIds.includes(game.id)).slice(0, 25);

      setData({sortedRegular, sortedReverse});
    } catch (error) {
      setError('Error in Similarity Calculation.');
    } finally {
      setLoading(false);
    }
  }, [similarityCalculated, recommender, dbResults, filterSettings])

  if (loading) {
    return <>Loading...</>;
  }

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
      userStatuses,
    }}>
      <button onClick={() => setAdvancedVisible(current => !current)}>{advancedVisible ? 'Hide Advanced' : 'Show Advanced'}</button>
      <RecommenderSettings visible={advancedVisible} />
      {error ? <div>{error}</div> : <RecommenderGameContainer/>}
    </HomeRecommenderContext.Provider>
  )
}

export default HomeRecommender;