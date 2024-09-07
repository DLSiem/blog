// import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Home, Profile, Auth, Login, Signup } from "./pages";

import { HomeLayout, ProtectedRoutes } from "./components";

import { authActions, isAuthenticated, logout } from "./actions/authActions";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    loader: isAuthenticated,
    id: "root",
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "profile",
        element: (
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "auth",
        children: [
          {
            index: true,
            element: <Auth />,
          },
          {
            path: "login",
            element: <Login />,
            action: authActions,
          },
          {
            path: "signup",
            element: <Signup />,
            action: authActions,
          },
          {
            path: "logout",
            action: logout,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
