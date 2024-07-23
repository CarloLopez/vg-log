import { BacklogCardItem } from "../../../../../shared/types/gameTypes";

type HomeGameStatsProps = {
  data: BacklogCardItem[];
}

const HomeGameStats = ({data}: HomeGameStatsProps) => {
  return (
    <div className="flex gap-5">
      <div className="font-bold text-7xl content-center">{data.length}</div>
      <div>
        <div className="flex">
          <div className="content-center"><div className="w-4 h-4 bg-orange-500 rounded-full"></div></div>
          <div className="content-center ml-2">{data.filter(game => game.state.status === 'inProgress').length} In-Progress</div>
        </div>
        <div className="flex">
          <div className="content-center"><div className="w-4 h-4 bg-gray-500 rounded-full"></div></div>
          <div className="content-center ml-2">{data.filter(game => game.state.status === 'notStarted').length} Not-Started</div>
        </div>
        <div className="flex">
          <div className="content-center"><div className="w-4 h-4 bg-green-500 rounded-full"></div></div>
          <div className="content-center ml-2">{data.filter(game => game.state.status === 'completed').length} Completed</div>
        </div>
        <div className="flex">
          <div className="content-center"><div className="w-4 h-4 bg-red-500 rounded-full"></div></div>
          <div className="content-center ml-2">{data.filter(game => game.state.status === 'dropped').length} Dropped</div>
        </div>
      </div>
    </div>
  )
}

export default HomeGameStats;