import { Image } from "antd";
import { NavLink } from "react-router-dom";

// Assets
import logoAdmin from "../../../assets/logo/Untitled-1-01.png";
const AdminSidebar = () => {
  return (
    <>
      <div className="relative z-10">
        <div className="sticky flex flex-col items-center w-72 h-screen overflow-hidden text-[#A765C9] bg-white rounded-lg shadow-lg">
          <NavLink
            className="flex items-center w-full px-auto ml-8 mt-6 no-underline justify-start"
            to="/admin"
          >
            <Image
              src={logoAdmin}
              className="items-center flex justify-center"
              width={50}
              height={50}
              preview={false}
            />
            <div className="ml-2 mt-3 flex items-end text-inherit no-underline leading-none">
              <h1 className="text-[#9c67ac] text-4xl font-bold">Belly&</h1>
              <h1 className="text-3xl font-bold text-gray-800">Babe</h1>
            </div>
          </NavLink>
          <div className="w-full px-4 mt-6">
            <div className="flex flex-col items-center w-full border-t border-gray-300">
              {[
                {
                  label: "Dashboard",
                  icon: "home",
                  href: "#",
                  d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
                },
                {
                  label: "Search",
                  icon: "search",
                  href: "#",
                  d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
                },
                {
                  label: "Insights",
                  icon: "chart-bar",
                  href: "#",
                  d: "M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
                },
                {
                  label: "Docs",
                  icon: "document",
                  href: "#",
                  d: "M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2",
                },
                {
                  label: "Products",
                  icon: "shopping-cart",
                  href: "#",
                  d: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
                },
                {
                  label: "Settings",
                  icon: "cog",
                  href: "#",
                  d: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4",
                },
                {
                  label: "Messages",
                  icon: "chat",
                  href: "#",
                  d: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z",
                },
              ].map((item, index) => (
                <NavLink
                  key={index}
                  className="flex items-center w-full h-12 px-3 mt-2 rounded-lg text-inherit hover:bg-[#CE93D8] hover:text-white"
                  href={item.href}
                >
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={item.d}
                    />
                  </svg>
                  <span className="ml-3 text-sm font-medium">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
          <NavLink
            className="flex items-center justify-center w-full h-16 mt-auto bg-[#f3e5f5] text-inherit hover:bg-[#CE93D8] hover:text-white"
            href="#"
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="ml-2 text-sm font-medium">Account</span>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
