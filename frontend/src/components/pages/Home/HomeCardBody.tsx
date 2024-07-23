import { BacklogItem } from "../../../../../shared/types/gameTypes"
import { useNavigate } from "react-router-dom"

type HomeCardBodyProps = {
  slug: string;
  state: BacklogItem;
}

const HomeCardBody = ({slug}: HomeCardBodyProps) => {
  
  const navigate = useNavigate();

  const handleClick = (tab: string) => {
    navigate(`/game/${slug}?tab=${tab}`)
  }

  return (
    <div className="flex gap-4">
      <button onClick={() => handleClick('notes')} className="bg-slate-800 px-3 py-1 hover:scale-105">Notes</button>
      <button onClick={() => handleClick('goals')} className="bg-slate-800 px-3 py-1 hover:scale-105">Goals</button>
    </div>
  )
}

export default HomeCardBody;