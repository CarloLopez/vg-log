import { MOCK_BACKLOG } from "../../../mock-data/mockData";
import { useState, useEffect } from "react";
import { BacklogItemState, BacklogItem, Game } from "../../../types/gameTypes";
import getBacklog from "../../../api/getBacklog";
import HomeGameStats from "./HomeGameStats";
import HomeCardArray from "./HomeCardArray";

const HomePage = () => {
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [gameSelection] = useState<BacklogItemState[]>(MOCK_BACKLOG);
  const [data, setData] = useState<BacklogItem[]>([]);

  useEffect(() => {
    const idList = gameSelection.map(game => game.id);

      const getData = async() => {
        try {
          const data: Game[] = await getBacklog(idList);
          const merged: BacklogItem[] = [];

          data.forEach(item => {
            const backlogItem: BacklogItem = {
              game: item,
              state: {id: 0, status: 'notStarted', category: null},
            };
            const selectionObj = gameSelection.find(obj => obj.id === item.id);

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
  }, [gameSelection])
  
  if (loading) {
    return <>Loading...</>;
  }

  if (error) {
    return <>{error}</>;
  }

  if (data) {
    return (
      <>
        <div>
          <h1>Welcome Back,</h1>
          <h2>user_name</h2>
        </div>
  
        <hr />
  
        <div>
  
          <div>
            <h4>Games in your backlog:</h4>
            <HomeGameStats data={data}/>
          </div>
          
          <div>
            <h4>Finish where you left off:</h4>
            <HomeCardArray data={data}/>
          </div>
  
        </div>

        <hr />

        <div>
          <h2>Recommended Games from Your Backlog:</h2>
          -BACKLOG RECOMMENDER MODEL OUTPUT GOES HERE-
        </div>
      </>
    );
  }
}

export default HomePage;