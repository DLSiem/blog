import { Outlet } from "react-router-dom";

import { Header, Footer } from "../components";

const HomeLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4 bg-gray-100">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default HomeLayout;
