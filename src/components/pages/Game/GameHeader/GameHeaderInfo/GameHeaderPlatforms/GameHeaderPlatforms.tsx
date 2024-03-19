import { Platform } from "../../../../../../types/gameTypes";
import LinkArray from "../../../../../common/Array/LinkArray";

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