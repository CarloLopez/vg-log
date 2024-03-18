import { useState, createContext } from "react";
import { SetURLSearchParams, useSearchParams } from "react-router-dom";
import GameResults from "./GameResults/GameResults";
import FilterBar from "../../common/Actions/FilterBar";
import { FilterList } from "../../../api/apiTypes";

type DiscoverContextType = {
  filterList: FilterList;
  setFilterList: React.Dispatch<React.SetStateAction<FilterList>>;
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
  filterArray: FilterArrayItem[];
  setFilterArray: React.Dispatch<React.SetStateAction<FilterArrayItem[]>>;
}

export const DiscoverContext = createContext<DiscoverContextType>({
  filterList: {},
  setFilterList: () => {},
  searchParams: new URLSearchParams(),
  setSearchParams: () => {},
  filterArray: [],
  setFilterArray: () => {},
} as DiscoverContextType);

export type FilterArrayItem = {
  key: string;
  values: number[];
  exact?: boolean;
}

const DiscoverPage = () => {

  const [filterList, setFilterList] = useState<FilterList>({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterArray, setFilterArray] = useState<FilterArrayItem[]>([]);

  console.log(filterArray);

  return (
    <DiscoverContext.Provider value={{filterList, setFilterList, searchParams, setSearchParams, filterArray, setFilterArray}}>
      <FilterBar />
      <hr />
      <GameResults />
    </DiscoverContext.Provider>
  );
}

export default DiscoverPage;