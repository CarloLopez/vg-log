type GameRatingsProps = {
  rating?: number | null;
  rating_count?: number | null;
}


const GameRatings = ({ rating=null, rating_count=null}: GameRatingsProps) => {
  return (
    <div>
      <div>{rating ? rating.toString() : "N/A"}</div>
      <div>{rating_count ? rating_count.toString() : "No Ratings"}</div>
    </div>
  );
}

export default GameRatings;