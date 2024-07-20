import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthContext } from "../../context/AuthContextUser";
import { CartContext } from "../../context/CartContext";
import "./topbar.css";

const TopBar = () => {
  const [storeLocation, setStoreLocation] = useState(2);
  const [openProfile, setOpenProfile] = useState(false);
  const userInfo = useSelector((state) => state.user.userInfo);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { handleLogout } = useContext(CartContext);

  const handleUserLogout = () => {
    logout();
    handleLogout();
    localStorage.clear();
  };

  return (
    <div className="topbar bg-[#fff4fc] text-sm text-[#404040] backdrop-blur-md">
      <div className="mx-0 px-0 text-left h-10 align-middle leading-10 items-center flex justify-between">
        {/* CSKH & HOTLINE */}
        <span className="pl-10 text-sm leading-4 min-w-64 !flex items-center">
          Mua Hàng và CSKH:
          <Link
            to="https://mail.google.com/mail/?view=cm&fs=1&to=a.Belly%26Babe%40gmail.com"
            title="Hotline Mua hàng - 1800 6609"
            className="ml-1 text-[#cb2e7c] hover:text-[#ff379b] mr-1 cursor-pointer no-underline text-sm"
            target="_blank"
            onClick={(e) => {
              e.preventDefault();
              window.open(
                "https://mail.google.com/mail/?view=cm&fs=1&to=a.belly%26babe%40gmail.com",
                "gmailCompose",
                "width=600,height=600"
              );
            }}
          >
            bellybabe@gmail.com
          </Link>
        </span>
        {/* Address */}
        <Link
          to="location"
          className="text-sm h-[19px] min-w-[135px] pl-[19px] bg-[url(https://cdn1.concung.com/themes/desktop4.1/image/v40/icon/store.png)] bg-no-repeat bg-contain items-center leading-[14px] cursor-pointer no-underline flex active:text-[#a062d2]"
          title="Tìm Siêu Thị Gần Nhất"
        >
          Tìm Siêu thị
          <span className="text-[#ff379b] ml-1 inline-block">
            ({storeLocation})
          </span>
        </Link>
        {/* Ship */}
        <div className="mt-0 pt-0 inline-block rounded-lg pr-[10px]">
          <div className="leading-[21px] bg-[url(https://cdn1.concung.com/themes/desktop4.1/image/v40/icon/sieu-toc.png)] bg-no-repeat">
            <Link to="/address" className="no-underline">
              <span title="Login" className="w-full flex">
                <span className="pl-[10px] text-[#111] text-sm ml-4">
                  <span className="text-[#404040]">
                    Nhập địa chỉ để mua hàng giao
                  </span>
                </span>
              </span>
            </Link>
          </div>
        </div>
        {/* User Info or Login */}
        {isAuthenticated ? (
          <div className="flex items-center relative pr-10">
            <span className="text-[#67686C] items-center text-sm text-center flex no-underline bg-transparent">
              <div className="mr-3">👋 Chào {userInfo.name || "Ba Mẹ"}</div>
              <span
                className="cursor-pointer h-5 mr-[3px] w-[21px] bg-[url(https://cdn1.concung.com/themes/desktop4.1/image/v40/icon/customer-login.png)] bg-no-repeat bg-contain bg-center inline-block"
                onClick={() => setOpenProfile((prev) => !prev)}
              ></span>
              <div
                className={`dropDownProfile absolute top-9 right-8 z-50 w-[90px] h-fit rounded-lg py-1 ${openProfile ? "open" : ""
                  }`}
              >
                <div className="flex flex-col">
                  <ul className="list-none flex flex-col m-0 p-0">
                    <li className="hover:text-secondary hover:transform hover:scale-110">
                      <Link to="/order" style={{ color: "inherit" }}>
                        Đơn hàng
                      </Link>
                    </li>
                    <li className="cursor-pointer hover:text-secondary hover:transform hover:scale-110">
                      <Link to="/userinfo" style={{ color: "inherit" }}>
                        Thông tin
                      </Link>
                    </li>
                    <li
                      className="cursor-pointer hover:text-secondary hover:transform hover:scale-110"
                      onClick={handleUserLogout}
                    >
                      Đăng xuất
                    </li>
                  </ul>
                </div>
              </div>
            </span>
          </div>
        ) : (
          <div className="flex items-center relative pr-10">
            <Link
              className="text-[#67686C] items-center text-sm text-center flex no-underline bg-transparent"
              to="/login"
              title="Thông tin khách hàng"
            >
              <span className="cursor-pointer h-5 mr-[5px] w-[21px] bg-[url(https://cdn1.concung.com/themes/desktop4.1/image/v40/icon/customer-login.png)] bg-no-repeat bg-contain bg-center inline-block"></span>
              Đăng Nhập
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
