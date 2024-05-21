import _ from 'lodash';
import { useState, useContext } from "react";
import { HomeRecommenderContext } from "./HomeRecommender";
import Slider from "../../../common/input/Slider";

const RecommenderSettings = () => {

  const {
    backlogSettings, 
    databaseSettings, 
    filterSettings, 
    setBacklogSettings, 
    setDatabaseSettings, 
    setFilterSettings,
    setUserVectorLoaded,
    setSimilarityCalculated,
  } = useContext(HomeRecommenderContext);
  
  // make deep copies for local changes of settings w/o altering real setting states
  const [backlogSettingsCopy, setBacklogSettingsCopy] = useState(_.cloneDeep(backlogSettings));
  const [databaseSettingsCopy, setDatabaseSettingsCopy] = useState(_.cloneDeep(databaseSettings));
  const [filterSettingsCopy, setFilterSettingsCopy] = useState(_.cloneDeep(filterSettings));
  
  const [backlogSettingsAltered, setbacklogSettingsAltered] = useState(false);
  const [databaseSettingsAltered, setDatabaseSettingsAltered] = useState(false);
  const [filterSettingsAltered, setFilterSettingsAltered] = useState(false);

  const databaseSettingsHandle = () => {
    setDatabaseSettingsAltered(true);
  }

  const filterSettingsHandle = () => {
    setFilterSettingsAltered(true);
  }

  const handleGenreDepthChange = (value: number) => {
    databaseSettingsHandle();
    setDatabaseSettingsCopy(current => {
      return {
        ...current,
        genreDepth: value,
      }
    })
  }

  const handleYearsChange = (value: number) => {
    databaseSettingsHandle();
    setDatabaseSettingsCopy(current => {
      return {
        ...current,
        years: value,
      }
    })
  }

  const handleSimilarityChange = (value: number) => {
    filterSettingsHandle();
    setFilterSettingsCopy(current => {
      return {
        ...current,
        similarity: value,
      }
    })
  }

  const handlePopularityChange = (value: number) => {
    filterSettingsHandle();
    setFilterSettingsCopy(current => {
      return {
        ...current,
        popularity: value,
      }
    })
  }

  const handleRatingChange = (value: number) => {
    filterSettingsHandle();
    setFilterSettingsCopy(current => {
      return {
        ...current,
        rating: value,
      }
    })
  }

  // resets flag states so that relevant API queries are re-run.
  const handleApplyClick = () => {
    if (filterSettingsAltered) {
      setFilterSettings(filterSettingsCopy);
    }

    if (databaseSettingsAltered) {
      setDatabaseSettings(databaseSettingsCopy);
      setSimilarityCalculated(false);
      setDatabaseSettingsAltered(false);
    }

    if (backlogSettingsAltered) {
      setBacklogSettings(backlogSettingsCopy);
      setUserVectorLoaded(false);
      setSimilarityCalculated(false);
      setbacklogSettingsAltered(false);
    }

  }
  
  return ( 
    <div>

      <hr></hr>
      <div>
        <label htmlFor="">Genre Depth</label>
        <Slider initial={databaseSettings.genreDepth} min={1} max={5} step={1} handleChange={handleGenreDepthChange}/>
      </div>
      <div>
        <label htmlFor="">Recency</label>
        <Slider initial={databaseSettings.years} min={0} max={25} step={1} metric="Years" handleChange={handleYearsChange}/>
      </div>

      <hr></hr>
      <div>
        <label htmlFor="">Genre Similarity</label>
        <Slider initial={filterSettings.similarity} min={0} max={1} step={0.1} handleChange={handleSimilarityChange}/>
      </div>
      <div>
        <label htmlFor="">Game Popularity</label>
        <Slider initial={filterSettings.popularity} min={0} max={1} step={0.1} handleChange={handlePopularityChange}/>
      </div>
      <div>
        <label htmlFor="">Game Rating</label>
        <Slider initial={filterSettings.rating} min={0} max={1} step={0.1} handleChange={handleRatingChange}/>
      </div>

      <button onClick={handleApplyClick}>Apply</button>

    </div>
  )
}

export default RecommenderSettings;