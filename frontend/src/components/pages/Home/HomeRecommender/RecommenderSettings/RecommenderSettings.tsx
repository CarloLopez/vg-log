import _ from 'lodash';
import { useState, useContext } from "react";
import { HomeRecommenderContext } from "../HomeRecommender";
import Slider from "../../../../common/input/Slider";
import RecommenderFilterButtonArray from './RecommenderFilterButtonArray';
import { gamePlatforms, statuses } from '../../../../../../../shared/objects/filterObjects';
import { Status } from '../../../../../../../shared/types/gameTypes';

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
    <div style={{ display: visible ? 'block' : 'none'}} className='flex flex-col gap-2 justify-center'>

      <div className='py-2 flex flex-col gap-1'>
        <div className="flex justify-center">Backlog Status Filter</div>
        <RecommenderFilterButtonArray list={statusIDs} checkIsActive={statusesCheckIsActive as ((id: string) => boolean)} handleOnClick={statusesHandleOnClick as ((id: string) => void)}/>
      </div>

      <hr></hr>
      <div className='py-2'>
        <label htmlFor="" className="flex justify-center">Genre Depth</label>
        <Slider initial={databaseSettings.genreDepth} min={1} max={5} step={1} handleChange={handleGenreDepthChange}/>
      </div>
      <div className='py-2'>
        <label htmlFor="" className="flex justify-center">Recency</label>
        <Slider initial={databaseSettings.years} min={0} max={25} step={1} metric="Years" handleChange={handleYearsChange}/>
      </div>
      <div className='py-2'>
        <RecommenderFilterButtonArray list={gamePlatforms} checkIsActive={platformsCheckIsActive} handleOnClick={platformsHandleOnClick}/>
      </div>

      <hr></hr>
      <div className='py-2'>
        <label htmlFor="" className="flex justify-center">Genre Similarity</label>
        <Slider initial={filterSettings.similarity} min={0} max={1} step={0.1} handleChange={handleSimilarityChange}/>
      </div>
      <div>
        <label htmlFor="" className="flex justify-center">Game Popularity</label>
        <Slider initial={filterSettings.popularity} min={0} max={1} step={0.1} handleChange={handlePopularityChange}/>
      </div>
      <div>
        <label htmlFor="" className="flex justify-center">Game Rating</label>
        <Slider initial={filterSettings.rating} min={0} max={1} step={0.1} handleChange={handleRatingChange}/>
      </div>

      <div className="flex justify-center">
        <button onClick={handleApplyClick} className=' bg-emerald-600 font-bold text-black px-3 text-lg'>Apply</button>
      </div>

    </div>
  )
}

export default RecommenderSettings;