// import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Home, Profile, Auth, Login, Signup } from "./pages";
import { HomeLayout } from "./components";

import { authActions } from "./actions/authActions";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/auth",
    children: [
      {
        index: true,
        element: <Auth />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
        action: authActions,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
