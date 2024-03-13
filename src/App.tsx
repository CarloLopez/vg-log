import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import ErrorPage from './ErrorPage.tsx';
import Layout from './components/layout/Layout.tsx';
import HomePage from './components/pages/Home/HomePage.tsx';
import BacklogPage from './components/pages/Backlog/BacklogPage.tsx';
import DiscoverPage from './components/pages/Discover/DiscoverPage.tsx';
import ProfilePage from './components/pages/Profile/ProfilePage.tsx';
import GamePage from './components/pages/Game/GamePage.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { path: 'home', element: <HomePage /> },
      { path: 'backlog', element: <BacklogPage /> },
      { path: 'discover', element: <DiscoverPage /> },
      { path: 'profile', element: <ProfilePage /> },
      // Navigating to /game/ without specifying an ID returns you to index.
      { path: 'game', element: <Navigate to='/' replace={true} /> },
      { path: 'game/:gameSlug', element: <GamePage />},
    ],
  },
])

const App = () => {
  return (
    <RouterProvider router={router} />
  );
}

export default App;