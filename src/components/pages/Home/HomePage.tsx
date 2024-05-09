import { MOCK_BACKLOG } from "../../../mock-data/mockData";
import { useState } from "react";
import { BacklogItemState } from "../../../types/gameTypes";
import HomeBacklog from "./HomeBacklog";
import HomeRecommended from "./HomeRecommended";

const HomePage = () => {
  
  const [backlog] = useState<BacklogItemState[]>(MOCK_BACKLOG);
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
        <HomeRecommended backlogItems={backlog}/>
      </div>
    );
  }

export default HomePage;