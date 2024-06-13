import { BacklogItem } from "../../../../../shared/types/gameTypes";

type HomeGameStatsProps = {
  data: BacklogItem[];
}

const HomeGameStats = ({data}: HomeGameStatsProps) => {
  return (
    <div>
      <div>{data.length}</div>
      <div>
        <div>{data.filter(game => game.state.status === 'inProgress').length} In-Progress</div>
        <div>{data.filter(game => game.state.status === 'notStarted').length} Not-Started</div>
        <div>{data.filter(game => game.state.status === 'completed').length} Completed</div>
        <div>{data.filter(game => game.state.status === 'dropped').length} Dropped</div>
      </div>
    </div>
  )
}

export default HomeGameStats;