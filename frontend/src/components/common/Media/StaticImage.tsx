import { Image } from "../../../../../shared/types/gameTypes";

type StaticImageProps = {
  image: Image;
  size: string;
}

const StaticImage = ({ image, size }: StaticImageProps) => {
  
  const url = `https://images.igdb.com/igdb/image/upload/t_${size}/${image.image_id}.jpg`

  return <img src={url} alt="Game Screenshot"/>

}

export default StaticImage;