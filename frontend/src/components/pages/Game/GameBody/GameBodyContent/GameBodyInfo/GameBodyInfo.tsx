import { useContext } from "react";
import { GameDataContext } from "../../../GamePage";
import AgeRatings from "./AgeRatings/AgeRatings";
import LinkArray from "../../../../../common/Array/LinkArray";
import InvolvedCompanies from "./InvolvedCompanies/InvolvedCompanies";
import GameCover from "../../../../../common/Cover/GameCover";
import GameCoverArray from "../../../../../common/Cover/GameCoverArray";

const GameBodyInfo = () => {
  
  const gameData = useContext(GameDataContext);

  return (
      <>
        <ul className="flex flex-col gap-3">

          <li>
            <h4 className="font-bold">Synopsis</h4>
            <div>{gameData.storyline || "No Story Synopsis."}</div>
          </li>

          <li>
            <h4 className="font-bold">Age Ratings</h4>
            {gameData.age_ratings ? <AgeRatings ageRatings={gameData.age_ratings}/> : "No Information Found."}
          </li>

          <li>
            <h4 className="font-bold">Game Modes</h4>
            {gameData.game_modes ? <LinkArray items={gameData.game_modes}/> : "No Information Found."}
          </li>

          <li>
            <h4 className="font-bold">Player Perspectives</h4>
            {gameData.player_perspectives ? <LinkArray items={gameData.player_perspectives} /> : "No Information Found."}
          </li>

          <li>
            <h4 className="font-bold">Themes</h4>
            {gameData.themes ? <LinkArray items={gameData.themes} /> : "No Information Found."}
          </li>

          <li>
            <h4 className="font-bold">Developers</h4>
            {gameData.involved_companies ? (
              <InvolvedCompanies companies={gameData.involved_companies} filter={"developers"} /> 
            ) : "No Information Found."}
          </li>

          <li>
            <h4 className="font-bold">Publishers</h4>
            {gameData.involved_companies ? (
              <InvolvedCompanies companies={gameData.involved_companies} filter={"publishers"} /> 
            ) : "No Information Found."}
          </li>

          <li>
            <h4 className="font-bold">Supporting Companies</h4>
            {gameData.involved_companies ? ( 
              <InvolvedCompanies companies={gameData.involved_companies} filter={"supporters"} /> 
            ) : "No Information Found."}
          </li>

        </ul>

        <hr />
          
          {gameData.expansions ? (
            <>
              <h4 className="font-bold">Expansions</h4>
              <GameCoverArray games={gameData.expansions} />
            </>
          ) : ""}

          {gameData.dlcs ? (
            <>
              <h4 className="font-bold">DLC</h4>
              <GameCoverArray games={gameData.dlcs} />
            </>
          ) : ""}

          {gameData.parent_game ? (
            <>
              <h4 className="font-bold">Parent Game</h4>
              <GameCover game={gameData.parent_game} size="small" link={gameData.parent_game.slug}/>
            </>
          ) : ""}
      </>
  );
}

export default GameBodyInfo;