import GameHeaderSide from "./GameHeaderSide/GameHeaderSide";
import GameHeaderInfo from "./GameHeaderInfo/GameHeaderInfo";

const GameHeader = () => {
  return (
    <div className="flex gap-4 flex-wrap md:flex-nowrap py-3">
      <GameHeaderSide />
      <GameHeaderInfo />
    </div>
  );
}

export default GameHeader;