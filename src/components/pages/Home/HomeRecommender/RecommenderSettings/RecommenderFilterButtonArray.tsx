import RecommenderFilterButton from "./RecommenderFilterButton";

type RecommenderFilterButtonArrayProps = {
  list: {id: string, name: string}[];
  checkIsActive: (id: string) => boolean;
  handleOnClick: (id: string) => void;
}

const RecommenderFilterButtonArray = ({list, checkIsActive, handleOnClick}: RecommenderFilterButtonArrayProps) => {
  return (
    <ul>
      {
        list.map(item => {
          return <RecommenderFilterButton key={item.id} label={item.name} id={item.id} checkIsActive={checkIsActive} handleOnClick={handleOnClick}/>
        })
      }
    </ul>
  )
}

export default RecommenderFilterButtonArray;