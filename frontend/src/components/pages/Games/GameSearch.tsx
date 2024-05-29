import SearchBar from "../../layout/SearchBar";
import { useContext } from "react";
import { GamesPageContext } from "./GamesPage";

const GameSearch = () => {

  const {searchParams, setSearchParams} = useContext(GamesPageContext);

  const onSearch = (searchTerm: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (searchTerm === "") {
      newSearchParams.delete('search');
    } else {
      newSearchParams.set('search', searchTerm);
      newSearchParams.delete('sort'); // IGDB API doesnt allow search and sort together
    }
    setSearchParams(newSearchParams);  
  }

  const handleButtonClick = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('search');
    setSearchParams(newSearchParams);  
  }
  
  return (
    <>
      <SearchBar onSearch={onSearch} initialValue={searchParams.get('search') || ""}/>
      <button disabled={searchParams.get('search') ? false : true} onClick={handleButtonClick}>Clear</button>
    </>
  )
}

export default GameSearch;