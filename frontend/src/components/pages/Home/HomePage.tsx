import { MOCK_BACKLOG } from "../../../../../shared/mock-data/mockData";
import { useState } from "react";
import { BacklogItem } from "../../../../../shared/types/gameTypes";
import HomeBacklog from "./HomeBacklog";
import HomeRecommender from "./HomeRecommender/HomeRecommender";

const HomePage = () => {
  
  const [backlog] = useState<BacklogItem[]>(MOCK_BACKLOG);
  const [gameIds] = useState(backlog.map(game => game.id));

    return (
      <div>
        <div>
          <h1>Welcome Back,</h1>
          <h2>user_name</h2>
        </div>
        <hr />
        <HomeBacklog gameIds={gameIds} backlogItems={backlog}/>
        <hr />
        <HomeRecommender backlogItems={backlog}/>
      </div>
    );
  }

export default HomePage;