import { useState, useEffect, useContext } from "react";
import { FilterList, Filter, Filters } from "../../../../api/apiTypes";
import filterGames from "../../../../api/filterGames";
import { Game } from "../../../../api/apiTypes";
import { DiscoverContext } from "../DiscoverPage";
import GameCoverArray from "../../../common/Cover/GameCoverArray";

type ExtractFilterParams = {
  filters: Filters;
  check: string;
}

const extractFilter = ({ filters, check }: ExtractFilterParams) => {
  
  // checks if the object list of filters contains the one we want to check, and deletes it from the object
  if (filters[check]) {
    const value = filters[check].values;
    delete filters[check];

    if (!Array.isArray(value)) {
      // returns the acquired value so we can reassign it to the correct FilterList property
      return value;
    }
  }
  // returns undefined if the check fails
  return undefined;
}

const formatFilterList = (filters: Filters) => {
  // create the filterlist. assigns all filters in the URL to their correct FilterList object properties.
  
  const filterList: FilterList = {};

  // extract search filter, if applicable 
  const search = extractFilter({filters, check:'search'});
  if (search) filterList.search = search;
  
  // extract sort filters, if applicable
  const fieldSort = extractFilter({filters, check:'fieldSort'});
  const sortBy = extractFilter({filters, check:'sortBy'});
  if (fieldSort && (sortBy === 'asc' || sortBy === 'desc')) filterList.sort = {fieldSort, sortBy};

  // extract specify filters, if applicable
  const fieldSpecify = extractFilter({filters, check:'fieldSpecify'});
  const operator = extractFilter({filters, check:'operator'});
  const specifyBy = extractFilter({filters, check:'specifyBy'});
  if (fieldSpecify && operator && specifyBy) filterList.specify = {fieldSpecify, operator, specifyBy};

  // extract pagination filter, if applicable
  const limit = Number(extractFilter({filters, check:'limit'}));
  const page = Number(extractFilter({filters, check:'page'}));
  if (limit || page) filterList.pagination = {limit, page};

  // finally, fill in 'where', if there are any remaining filters
  if (Object.keys(filters).length > 0) {
    filterList.where = filters;
  }
  
  return(filterList);
}

const GameResults = () => {

  const { setFilterList, searchParams } = useContext(DiscoverContext)

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState<Game[]>();

  useEffect(() => {

    const getGameList = async () => {
      const filters: Filters = {};

      // extracts all filters in the URL and enters the key and values into the filters object
      searchParams.forEach((value, key) => {

        const values = value.includes(',') ? value.split(',') : value;
        let exact = false;
    
        if (Array.isArray(values) && values[values.length - 1] === 'exact') {
          exact = true;
          values.pop();
        }
    
        const subfilter: Filter = exact ? {values, exact} : {values};
        filters[key] = subfilter;
      })

      // take the unsorted filters object, and create a formatted filterList object to pass into the api request function
      const filterList = formatFilterList(filters);
      // pass to parent component so changes are reflected in the filter buttons
      setFilterList(filterList);
      
      try {
        const gamesData = await filterGames(filterList);
        setData(gamesData);
      } catch (error) {
        setError('Failed to fetch game details. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    getGameList();
  }, [searchParams, setFilterList])

  if (loading) {
    return <>Loading...</>;
  }

  if (error) {
    return <>{error}</>;
  }

  if (data) {
    return <GameCoverArray games={data} />
  }
}

export default GameResults;