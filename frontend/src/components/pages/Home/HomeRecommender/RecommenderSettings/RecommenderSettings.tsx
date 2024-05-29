import _ from 'lodash';
import { useState, useContext } from "react";
import { HomeRecommenderContext } from "../HomeRecommender";
import Slider from "../../../../common/input/Slider";
import RecommenderFilterButtonArray from './RecommenderFilterButtonArray';
import { gamePlatforms, statuses } from '../../../../../../../backend/temp-data/filterObjects';
import { Status } from '../../../../../types/gameTypes';

type RecommenderSettingsProps = {
  visible: boolean;
}

const RecommenderSettings = ({visible}: RecommenderSettingsProps) => {

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

  const statusIDs = statuses.map(status => {
    return {
      id: status.value,
      name: status.label
    }
  })

  const backlogSettingsHandle = () => {
    setbacklogSettingsAltered(true);
  }
  
  const databaseSettingsHandle = () => {
    setDatabaseSettingsAltered(true);
  }

  const filterSettingsHandle = () => {
    setFilterSettingsAltered(true);
  }

  const statusesCheckIsActive = (id: Status) => {
    return backlogSettingsCopy.statuses.includes(id);
  }

  const statusesHandleOnClick = (id: Status) => {
    backlogSettingsHandle();
    setBacklogSettingsCopy(current => {
    let newStatuses: Status[] = [];
    if (current.statuses.includes(id)) {
      newStatuses = current.statuses.filter(item => item !== id);
    } else {
      newStatuses = [...current.statuses, id];
    }
    return {
      ...current,
      statuses: newStatuses,
    }
    })
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

  const platformsCheckIsActive = (id: string) => {
    return databaseSettingsCopy.platforms.includes(id);
  }

  const platformsHandleOnClick = (id: string) => {
    databaseSettingsHandle();
    setDatabaseSettingsCopy(current => {
    let newPlatforms: string[] = [];
    if (current.platforms.includes(id)) {
      newPlatforms = current.platforms.filter(item => item !== id);
    } else {
      newPlatforms = [...current.platforms, id];
    }
    return {
      ...current,
      platforms: newPlatforms,
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
    <div style={{ display: visible ? 'block' : 'none'}}>

      <div>
      <RecommenderFilterButtonArray list={statusIDs} checkIsActive={statusesCheckIsActive as ((id: string) => boolean)} handleOnClick={statusesHandleOnClick as ((id: string) => void)}/>
      </div>

      <hr></hr>
      <div>
        <label htmlFor="">Genre Depth</label>
        <Slider initial={databaseSettings.genreDepth} min={1} max={5} step={1} handleChange={handleGenreDepthChange}/>
      </div>
      <div>
        <label htmlFor="">Recency</label>
        <Slider initial={databaseSettings.years} min={0} max={25} step={1} metric="Years" handleChange={handleYearsChange}/>
      </div>
      <div>
        <RecommenderFilterButtonArray list={gamePlatforms} checkIsActive={platformsCheckIsActive} handleOnClick={platformsHandleOnClick}/>
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