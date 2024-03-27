import { MOCK_BACKLOG, MOCK_CATEGORIES } from "../../../mock-data/mockData";
import { useState, useEffect, createContext } from "react";
import getBacklog from "../../../api/getBacklog";
import BacklogCardArray from "./BacklogCardArray";
import BacklogOrderDropdown from "./BacklogOrderDropdown";
import { Game, BacklogItem, BacklogItemState} from "../../../types/gameTypes";

type BacklogPageContext = {
  setOrder: React.Dispatch<React.SetStateAction<string>>;
}

export const BacklogPageContext = createContext<BacklogPageContext>({
  setOrder: () => {},
})

const BacklogPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [gameSelection, setGameSelection] = useState<BacklogItemState[]>(MOCK_BACKLOG);
  const [data, setData] = useState<BacklogItem[]>([]);
  const [order, setOrder] = useState('');
  

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
          setError('Failed to Load Backlog.');
        } finally {
          setLoading(false);
        }
      }  

      getData();
  }, [gameSelection])

  const sortData = (data: BacklogItem[]) => {
    const defaultOrder = {'inProgress': 1, 'notStarted': 2, 'completed': 3, 'dropped': 4};

    switch (order) {
      case '':
        return data.sort((a, b) => defaultOrder[a.state.status] - defaultOrder[b.state.status]);
      case 'name':
        return data.sort((a, b) => a.game.name.localeCompare(b.game.name));
    }
    return data;
  }

  if (loading) {
    return <>Loading...</>;
  }

  if (error) {
    return <>{error}</>;
  }

  if (data) {
    const sortedData = sortData(data);
    console.log(sortedData);
    return (
      <BacklogPageContext.Provider value={{setOrder}}>
        
        <BacklogOrderDropdown />
        <BacklogCardArray items={sortedData}/>
      </BacklogPageContext.Provider>
    )
  }
}

export default BacklogPage;