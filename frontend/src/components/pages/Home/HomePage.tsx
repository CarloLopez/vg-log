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

  if (backlog.length > 0) {
    
    const inProgress = backlog.filter(game => game.status === 'inProgress');
    const notStarted = backlog.filter(game => game.status === 'notStarted');

    return (
      <div>
        <div>
          <h1>Welcome Back,</h1>
          <h2>{username}</h2>
        </div>
        <HomeBacklog gameIds={backlog.map(game => game.id)} backlogItems={backlog}/>
        
        {(inProgress.length > 0 || notStarted.length > 0) && (
          <div>
            <h4>{inProgress.length === 0 && notStarted.length > 0 ? "Start a New Game from Your Backlog:" : "Suggested Backlog Game To Complete:"}</h4>
            <BacklogRecommender userBacklog={backlog}/>
          </div>
        )}

        {(inProgress.length === 0 && notStarted.length === 0) && (
          <div>
            <h4>Add Games To Your Backlog To Play!</h4>
          </div>
        )}

        {(backlog.length > 0) && (
          <div>
            <h4>Recommended New Games Based on Your Backlog History:</h4>
            <HomeRecommender backlogItems={backlog}/>
          </div>
        )}
      </div>
    );
  }
}

export default HomePage;