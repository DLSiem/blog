// import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Home, Profile, Auth, Login, Signup } from "./pages";

import { HomeLayout, ProtectedRoutes, OnlyNoneAuth } from "./components";

import { authActions, isAuthenticated, logout } from "./actions/authActions";

import { UserProvider } from "./utils/UserContext";

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
            element: (
              <OnlyNoneAuth>
                <Login />
              </OnlyNoneAuth>
            ),
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
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;
