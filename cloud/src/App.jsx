import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './components/home';
import Login from './components/login';
import Register from './components/register';
import Landing from './components/landing'

// Create a router with defined routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Register />, // Home page for the root path
  },
  {
    path: "/home",
    element: <Home />, // Home page for the root path
  },
  {
    path: "/login",
    element: <Login />, // Login page
  },
]);

const App = () => {
  return (
    // Wrap your app in RouterProvider to handle routing
    <RouterProvider router={router} />
  );
};

export default App;
