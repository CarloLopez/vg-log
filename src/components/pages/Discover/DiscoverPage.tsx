import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import GameResults from "./GameResults/GameResults";
import FilterBar from "../../common/Actions/FilterBar";
import { FilterList } from "../../../api/apiTypes";

export type filterArrayItem = {
  key: string;
  values: number[];
  exact?: boolean;
}

const DiscoverPage = () => {

  const [filterList, setFilterList] = useState<FilterList>({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterArray, setFilterArray] = useState<filterArrayItem[]>([]);

  console.log(filterArray);

  return (
    <>
      <FilterBar filterArray={filterArray} setFilterArray={setFilterArray} setSearchParams={setSearchParams}/>
      <hr />
      <GameResults searchParams={searchParams} setFilterList={setFilterList}/>
    </>
  );
}

export default DiscoverPage;