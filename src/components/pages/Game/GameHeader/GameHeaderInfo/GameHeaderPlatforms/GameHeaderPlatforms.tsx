import { Platform } from "../../../../../../api/apiTypes";
import LinkArray from "../../../../../common/LinkArray/LinkArray";

type GameHeaderPlatformsProps = {
  items: Platform[];
}

const GameHeaderPlatforms = ({ items }: GameHeaderPlatformsProps) => {
  const nameObjArray = items.map((item) => {
    const id = item.id;
    const name = item.abbreviation;
    
    return {id, name}
  })
  
  return <LinkArray items={nameObjArray}/>
}

export default GameHeaderPlatforms;