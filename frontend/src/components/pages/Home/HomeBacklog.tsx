import { useState, useEffect } from "react";
import { BacklogItem, BacklogCardItem, Game } from "../../../../../shared/types/gameTypes";
import getBacklog from "../../../api/getBacklog";
import HomeGameStats from "./HomeGameStats";
import HomeCardArray from "./HomeCardArray";

type HomeBacklogProps = {
  gameIds: number[];
  backlogItems: BacklogItem[];
}

const HomeBacklog = ({gameIds, backlogItems}: HomeBacklogProps) => {
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [backlog] = useState<BacklogItem[]>(backlogItems);
  const [data, setData] = useState<BacklogCardItem[]>([]);

  useEffect(() => {

      const getData = async() => {
        try {
          const data: Game[] = await getBacklog(gameIds);
          const merged: BacklogCardItem[] = [];

          data.forEach(item => {
            const backlogItem: BacklogCardItem = {
              game: item,
              state: {id: 0, status: 'notStarted', category: null, notes: [], goals: []},
            };
            const selectionObj = backlog.find(obj => obj.id === item.id);

            if (selectionObj) {
              backlogItem.state = {...selectionObj};
              merged.push(backlogItem);
            }
          })

          setData(merged);
        } catch (error) {
          setError('Failed to Load User Data.');
        } finally {
          setLoading(false);
        }
      }  

      getData();
  }, [backlog, gameIds])
  
  if (loading) {
    return <>Loading...</>;
  }

  if (error) {
    return <>{error}</>;
  }

  if (data) {
    
    const inProgress = backlog.filter(game => game.status === 'inProgress');
    
    return (
      <div>

        <div>
          <h4>Games in your backlog:</h4>
          <HomeGameStats data={data}/>
        </div>
        
        {inProgress.length > 0 && (
          <div>
            <h4>Finish Where You Left Off:</h4>
            <HomeCardArray data={data}/>
          </div>
        )}

      </div>
    );
  }
}

export default HomeBacklog;