
type GameRatingsProps = {
  rating?: number | null;
  rating_count?: number | null;
}

const GameRatings = ({ rating=null, rating_count=null}: GameRatingsProps) => {

  return (
    <div className="flex gap-1">
      <div className="flex items-center font-bold text-2xl">{rating ? `${Math.floor(rating).toString()}/100` : "N/A"}</div>
      <div className="flex items-center italic">{rating_count ? `(${rating_count.toString()})` : "No Ratings"}</div>
    </div>
  );
}

export default GameRatings;