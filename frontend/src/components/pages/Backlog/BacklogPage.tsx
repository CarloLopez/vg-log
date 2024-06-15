import { MOCK_BACKLOG, MOCK_CATEGORIES } from "../../../../../shared/mock-data/mockData";
import { useState, useEffect, createContext } from "react";
import getBacklog from "../../../api/getBacklog";
import BacklogCardArray from "./BacklogCardArray";
import BacklogOrderDropdown from "./BacklogOrderDropdown";
import BacklogCategoryDropdown from "./BacklogCategoryDropdown";
import BacklogStatusFilter from "./BacklogStatusFilter";
import DialogBox from "../../common/DialogBox";
import { Game, BacklogCardItem, BacklogItem, Category} from "../../../../../shared/types/gameTypes";

type BacklogPageContext = {
  setOrder: React.Dispatch<React.SetStateAction<string>>;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  categories: Category[];
  setData: React.Dispatch<React.SetStateAction<BacklogCardItem[]>>;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDialogContent: React.Dispatch<React.SetStateAction<JSX.Element>>;
}

export const BacklogPageContext = createContext<BacklogPageContext>({
  setOrder: () => {},
  setCategories: () => {},
  categories: [],
  setData: () => {},
  setCategory: () => {},
  setDialogOpen: () => {},
  setDialogContent: () => {},
})

const BacklogPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [gameSelection] = useState<BacklogItem[]>(MOCK_BACKLOG);
  const [data, setData] = useState<BacklogCardItem[]>([]);
  const [sortedData, setSortedData] = useState<BacklogCardItem[]>([]);
  
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [category, setCategory] = useState('');
  const [order, setOrder] = useState('');
  const [filters, setFilters] = useState(['inProgress', 'notStarted', 'completed', 'dropped']);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState(<></>);
  

  useEffect(() => {
    const idList = gameSelection.map(game => game.id);

      const getData = async() => {
        try {
          const data: Game[] = await getBacklog(idList);
          const merged: BacklogCardItem[] = [];

          data.forEach(item => {
            const backlogItem: BacklogCardItem = {
              game: item,
              state: {id: 0, status: 'notStarted', category: null, notes: [], goals: []},
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

  useEffect(() => {

    // filter data for caterogy
    let filteredData = category ? data.filter(game => game.state.category?.toString() === category) : data;
    
    // filter data for status
    filteredData = filteredData.filter(game => filters.includes(game.state.status));

    // sort data based on user selection
    const defaultOrder = {'inProgress': 1, 'notStarted': 2, 'completed': 3, 'dropped': 4};
    let sortedData: BacklogCardItem[] = []
    switch (order) {
      case '':
        sortedData = filteredData.sort((a, b) => defaultOrder[a.state.status] - defaultOrder[b.state.status]);
        break;
      case 'name':
        sortedData = filteredData.sort((a, b) => a.game.name.localeCompare(b.game.name));
        break;
    }

    setSortedData(sortedData);

  }, [data, category, filters, order])

  if (loading) {
    return <>Loading...</>;
  }

  if (error) {
    return <>{error}</>;
  }

  if (data) {
    return (
      <BacklogPageContext.Provider value={{setOrder, setCategories, categories, setData, setCategory, setDialogOpen, setDialogContent}}>
        <BacklogOrderDropdown />
        <BacklogCategoryDropdown />
        <BacklogStatusFilter setFilters={setFilters}/>
        <BacklogCardArray items={sortedData}/>
        {dialogOpen ? <DialogBox dialogOpen={dialogOpen} toggleVisibility={() => setDialogOpen(false)}>{dialogContent}</DialogBox> : ""}
      </BacklogPageContext.Provider>
    )
  }
}

export default BacklogPage;