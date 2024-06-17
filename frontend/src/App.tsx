import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import ErrorPage from './ErrorPage.tsx';
import Layout from './components/layout/Layout.tsx';
import HomePage from './components/pages/Home/HomePage.tsx';
import BacklogPage from './components/pages/Backlog/BacklogPage.tsx';
import GamesPage from './components/pages/Games/GamesPage.tsx';
import ProfilePage from './components/pages/Profile/ProfilePage.tsx';
import GamePage from './components/pages/Game/GamePage.tsx';

import { createContext, useState, useEffect } from 'react';
import checkAuth from './api/database/checkAuth.ts';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { path: 'home', element: <HomePage /> },
      { path: 'backlog', element: <BacklogPage /> },
      { path: 'games', element: <GamesPage /> },
      // Navigating to /game/ without specifying an ID returns you to index.
      { path: 'game', element: <Navigate to='/' replace={true} /> },
      { path: 'game/:gameSlug', element: <GamePage />},
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
])

type LoginContext = {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
}

export const LoginContext = createContext<LoginContext>({
  username: '',
  setUsername: () => []
});

const App = () => {

  const [username, setUsername] = useState('');

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
        return;
      }
    }

    checkLoggedIn();
  }, [])

  return (
    <LoginContext.Provider value={{username, setUsername}}>
      <RouterProvider router={router} />
    </LoginContext.Provider>
  );
}

export default App;