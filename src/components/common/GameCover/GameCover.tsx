type GameCoverProps = {
  coverID: string;
  size: string;
  gameName: string;
}

const GameCover = ({ coverID, size, gameName }: GameCoverProps) => {
  const url = `https://images.igdb.com/igdb/image/upload/t_cover_${size}/${coverID}.jpg`;

  return (
    <img src={url} alt={'Cover Image of ' + gameName} />
  );
}

export default GameCover;