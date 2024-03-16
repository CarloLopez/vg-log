import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, Filters, Match } from "../../../api/apiTypes";
import { FilterList } from "../../../api/apiTypes";
import filterGames from "../../../api/filterGames";

type ExtractFilterParams = {
  filters: Filters;
  check: string;
}

const extractFilter = ({ filters, check }: ExtractFilterParams) => {
  if (filters[check]) {
    const value = filters[check].values;
    delete filters[check];

    if (!Array.isArray(value)) {
      return value;
    }
  }
  return undefined;
}

const DiscoverPage = () => {

  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {

    const getGameList = async () => {
      const filters: Filters = {};

      searchParams.forEach((value, key) => {

        const values = value.includes(',') ? value.split(',') : value;
        let match: Match = '';
    
        if (Array.isArray(values)) {
          const filter = values[values.length - 1];
          if (filter === 'or' || filter === 'exact') {
            match = filter;
            values.pop();
          }
        }
    
        const subfilter: Filter = {values, match}
        filters[key] = subfilter;
      })
      
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

      // finally, fill in where
      if (Object.keys(filters).length > 0) filterList.where = filters;

      console.log(filterList);
      
      try {
        if(searchParams.size > 0) {
          const data = await filterGames(filterList);
          console.log(data);
        }
      } catch (error) {
        setError('Failed to fetch game details. Please try again later.');
      } finally {
        setLoading(false);
        if(searchParams.size === 0) {
          setError('Error: No Parameters Set.');
        }
      }
    }

    getGameList();
  }, [searchParams])

  if (loading) {
    return <>Loading...</>;
  }

  if (error) {
    return <>{error}</>;
  }

  return (
    <>
    TEST
    </>
  );
}

export default DiscoverPage;