// import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import {
  Home,
  Profile,
  Auth,
  Login,
  Signup,
  ImageUpload,
  BlogPage,
} from "./pages";

import { HomeLayout, ProtectedRoutes, OnlyNoneAuth } from "./components";

import { update } from "./actions/userActions";

import { getBlog, getBlogBySlug } from "./loaders/blogLoader";

import { AuthProvider } from "./context/AuthContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    id: "root",
    children: [
      {
        index: true,
        loader: getBlog,
        element: <Home />,
      },
      {
        path: ":slug",
        loader: getBlogBySlug,
        element: <BlogPage />,
      },
      {
        path: "image",
        element: <ImageUpload />,
      },
      {
        path: "profile",
        action: update,
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
          },
          {
            path: "signup",
            element: <Signup />,
          },
          {
            path: "logout",
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
