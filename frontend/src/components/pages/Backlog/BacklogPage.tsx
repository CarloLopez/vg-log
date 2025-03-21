import { useState, useEffect, createContext, useContext } from "react";
import getBacklog from "../../../api/getBacklog";
import BacklogCardArray from "./BacklogCardArray";
import BacklogOrderDropdown from "./BacklogOrderDropdown";
import BacklogCategoryDropdown from "./BacklogCategoryDropdown";
import BacklogStatusFilter from "./BacklogStatusFilter";
import DialogBox from "../../common/DialogBox";
import { Game, BacklogCardItem, BacklogItem, Category} from "../../../../../shared/types/gameTypes";
import { LoginContext } from "../../../App";
import checkAuth from "../../../api/database/checkAuth";
import { User } from "../../../types/userTypes";
import getUserData from "../../../api/database/getUserData";

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

  const {username, setUsername} = useContext(LoginContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [backlog, setBacklog] = useState<BacklogItem[]>([]);
  const [data, setData] = useState<BacklogCardItem[]>([]);
  const [sortedData, setSortedData] = useState<BacklogCardItem[]>([]);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState('');
  const [order, setOrder] = useState('');
  const [filters, setFilters] = useState(['inProgress', 'notStarted', 'completed', 'dropped']);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState(<></>);
  
  // check that user is logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const authName: string = await checkAuth();
        if (authName) {
          setUsername(authName);
          console.log(authName, 'username verified')
        }
      } catch (error) {
        setUsername('');
      }
    }

    checkLoggedIn();
  }, [])

  // get user's backlog
  useEffect(() => {
    
    const getUserGameData = async () => {
      try {
        const data: User = await getUserData();
        setBacklog(data.backlog);
        setCategories(data.categories);
      } catch (error) {
        console.log('Error Getting User Data.');
      }
    }

    if (username) {
      getUserGameData();
    }
    
  }, [username])

  useEffect(() => {
    const idList = backlog.map(game => game.id);

      const getData = async() => {
        try {
          const data: Game[] = await getBacklog(idList);
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
          setError('Failed to Load Backlog.');
        } finally {
          setLoading(false);
        }
      }  

      if (backlog.length > 0) {
        getData();
      }
  }, [backlog])

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

  if (!username) {
    return <>Log-In to Get Started</>
  }

  if (backlog.length === 0) {
    return <>Add Games to Backlog to Get Started</>
  }

  if (loading) {
    return <>Loading...</>;
  }

  if (error) {
    return <>{error}</>;
  }

  if (data) {
    return (
      <BacklogPageContext.Provider value={{setOrder, setCategories, categories, setData, setCategory, setDialogOpen, setDialogContent}}>
        <div className="flex gap-3 justify-center w-full mt-3">
          <BacklogOrderDropdown />
          <BacklogCategoryDropdown />
        </div>
        
        <div className="flex gap-3 justify-center"><BacklogStatusFilter setFilters={setFilters}/></div>
        <div className="flex justify-center"><BacklogCardArray items={sortedData}/></div>
        {dialogOpen ? <DialogBox dialogOpen={dialogOpen} toggleVisibility={() => setDialogOpen(false)}>{dialogContent}</DialogBox> : ""}
      </BacklogPageContext.Provider>
    )
  }
}

export default BacklogPage;