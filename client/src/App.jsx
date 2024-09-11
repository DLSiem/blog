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
  CreateBlog,
} from "./pages";

import { HomeLayout, ProtectedRoutes, OnlyNoneAuth } from "./components";

import { update } from "./actions/userActions";

import { createBlog } from "./actions/blogActions";

import { getBlog, getBlogBySlug } from "./loaders/blogLoader";

import { AuthProvider } from "./context/AuthContext";
import EditProfile from "./pages/EditProfile";

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
        path: "create",
        action: createBlog,
        element: (
          <ProtectedRoutes>
            <CreateBlog />
          </ProtectedRoutes>
        ),
      },
      {
        path: "image",
        element: <ImageUpload />,
      },
      {
        path: "profile",
        action: update,
        children: [
          {
            index: true,
            element: (
              <ProtectedRoutes>
                <Profile />
              </ProtectedRoutes>
            ),
          },
          {
            path: "update",
            action: update,
            element: (
              <ProtectedRoutes>
                <EditProfile />
              </ProtectedRoutes>
            ),
          },
        ],
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
            element: (
              <OnlyNoneAuth>
                <Signup />,
              </OnlyNoneAuth>
            ),
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
