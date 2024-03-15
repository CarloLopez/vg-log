import { useContext } from "react";
import { GameDataContext } from "../../../GamePage";
import AgeRatings from "./AgeRatings/AgeRatings";
import LinkArray from "../../../../../common/LinkArray/LinkArray";
import InvolvedCompanies from "./InvolvedCompanies/InvolvedCompanies";

const GameBodyInfo = () => {
  
  const gameData = useContext(GameDataContext);

  return (
    <>
      <ul>

        <li>
          <div>Age Ratings</div>
          {gameData.age_ratings ? <AgeRatings ageRatings={gameData.age_ratings}/> : "No Information Found."}
        </li>

        <li>
          <div>Game Modes</div>
          {gameData.game_modes ? <LinkArray items={gameData.game_modes}/> : "No Information Found."}
        </li>

        <li>
          <div>Player Perspectives</div>
          {gameData.player_perspectives ? <LinkArray items={gameData.player_perspectives} /> : "No Information Found."}
        </li>

        <li>
          <div>Themes</div>
          {gameData.themes ? <LinkArray items={gameData.themes} /> : "No Information Found."}
        </li>

        <li>
          <div>Developers</div>
          {gameData.involved_companies ? (
            <InvolvedCompanies companies={gameData.involved_companies} filter={"developers"} /> 
          ) : "No Information Found."}
        </li>

        <li>
          <div>Publishers</div>
          {gameData.involved_companies ? (
            <InvolvedCompanies companies={gameData.involved_companies} filter={"publishers"} /> 
          ) : "No Information Found."}
        </li>

        <li>
          <div>Supporting Companies</div>
          {gameData.involved_companies ? ( 
            <InvolvedCompanies companies={gameData.involved_companies} filter={"supporters"} /> 
          ) : "No Information Found."}
        </li>
        
      </ul>
    </>
  );
}

export default GameBodyInfo;