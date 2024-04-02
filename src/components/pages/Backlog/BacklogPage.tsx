import { MOCK_BACKLOG, MOCK_CATEGORIES } from "../../../mock-data/mockData";
import { useState, useEffect, createContext } from "react";
import getBacklog from "../../../api/getBacklog";
import BacklogCardArray from "./BacklogCardArray";
import BacklogOrderDropdown from "./BacklogOrderDropdown";
import BacklogCategoryDropdown from "./BacklogCategoryDropdown";
import BacklogStatusFilter from "./BacklogStatusFilter";
import { Game, BacklogItem, BacklogItemState, Category} from "../../../types/gameTypes";

type BacklogPageContext = {
  setOrder: React.Dispatch<React.SetStateAction<string>>;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  categories: Category[];
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}

export const BacklogPageContext = createContext<BacklogPageContext>({
  setOrder: () => {},
  setCategories: () => {},
  categories: [],
  setCategory: () => {},
})

const BacklogPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState<BacklogItem[]>([]);
  const [gameSelection] = useState<BacklogItemState[]>(MOCK_BACKLOG);
  
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [category, setCategory] = useState('');
  const [order, setOrder] = useState('');
  const [filters, setFilters] = useState(['inProgress', 'notStarted', 'completed', 'dropped']);
  

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
    // filter data for caterogy
    let filteredData = category ? data.filter(game => game.state.category?.toString() === category) : data;
    // filter data for status
    filteredData = filteredData.filter(game => filters.includes(game.state.status));
    // sort based on user selection
    const sortedData = sortData(filteredData);
    console.log(sortedData);
    return (
      <BacklogPageContext.Provider value={{setOrder, setCategories, categories, setCategory}}>
        <BacklogOrderDropdown />
        <BacklogCategoryDropdown />
        <BacklogStatusFilter setFilters={setFilters}/>
        <BacklogCardArray items={sortedData}/>
      </BacklogPageContext.Provider>
    )
  }
}

export default BacklogPage;