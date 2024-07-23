import { useState, useEffect, useContext } from "react";
import { BacklogItem } from "../../../../../shared/types/gameTypes";
import { User } from "../../../types/userTypes";
import { LoginContext } from "../../../App";
import checkAuth from "../../../api/database/checkAuth";
import getUserData from "../../../api/database/getUserData";
import HomeBacklog from "./HomeBacklog";
import BacklogRecommender from "./BacklogRecommender/BacklogRecommender";
import HomeRecommender from "./HomeRecommender/HomeRecommender";

const HomePage = () => {
  
  const {username, setUsername} = useContext(LoginContext);

  const [backlog, setBacklog] = useState<BacklogItem[]>([]);

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
      } catch (error) {
        console.log('ERRRRRRR');
      }
    }

    if (username) {
      getUserGameData();
    }
    
  }, [username])

  if (!username) {
    return <>Log-In to Get Started</>
  }

  if (backlog.length === 0) {
    return <>Add Games to Backlog to Get Started</>
  }

  if (backlog.length > 0) {
    
    const inProgress = backlog.filter(game => game.status === 'inProgress');
    const notStarted = backlog.filter(game => game.status === 'notStarted');

    return (
      <div className="px-4">
        <div className="py-3">
          <h1 className="font-bold text-4xl flex justify-center">Welcome Back,</h1>
          <h2 className="font-bold text-3xl flex justify-center">{username.toUpperCase()}!</h2>
        </div>

        <hr></hr>

        <HomeBacklog gameIds={backlog.map(game => game.id)} backlogItems={backlog}/>
        
        {(inProgress.length > 0 || notStarted.length > 0) && (
          <div className="pb-4">
            <h4 className="font-bold flex justify-center">{inProgress.length === 0 && notStarted.length > 0 ? "Start a New Game from Your Backlog:" : "Recommended Backlog Game to Complete:"}</h4>
            <div className="flex justify-center"><BacklogRecommender userBacklog={backlog}/></div>
          </div>
        )}

        <hr></hr>

        {(inProgress.length === 0 && notStarted.length === 0) && (
          <div className="py-3">
            <h4>Add Games To Your Backlog To Play!</h4>
          </div>
        )}

        {(backlog.length > 0) && (
          <div className="py-3">
            <h4 className="font-bold flex justify-center">Recommended New Games</h4>
            <HomeRecommender backlogItems={backlog}/>
          </div>
        )}
      </div>
    );
  }
}

export default HomePage;