import { Link } from "react-router-dom";

import { useState, useEffect } from "react";
import ProfileSidebar from "../../components/siderbar/profilesidebar";

const OrderEmpty = () => {
  useEffect(() => {
    document.title = "Đơn Hàng";
    window.scrollTo(0, 0);
  }, []);

  const [selectedTab, setSelectedTab] = useState("all");

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const tabs = [
    { label: "Tất cả", value: "all" },
    { label: "Đang giao", value: "delivering" },
    { label: "Đã giao", value: "delivered" },
    { label: "Đã hủy", value: "cancelled" },
  ];

  const menuItems = [
    {
      to: "/",
      icon: "https://cdn1.concung.com/themes/desktop4.1/image//v40/icon/diamond.png",
      text: "Trang chủ",
    },
    {
      to: "/order",
      icon: "https://cdn1.concung.com/themes/desktop4.1/image//v40/icon/c-order.png",
      text: "Đơn hàng",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100 mx-28">
      <ProfileSidebar />
      <div className="flex-1 p-4 mx-5">
        <div className="flex justify-evenly rounded-[12px_12px_0_0] bg-gradient-to-r from-purple-500 to-pink-500">
          {tabs.map((tab) => (
            <div
              key={tab.value}
              onClick={() => handleTabClick(tab.value)}
              className={`py-2 px-4 cursor-pointer ${selectedTab === tab.value
                ? "text-[black] hover:transform hover:scale-125 transition-transform duration-300"
                : "text-white"
                }`}
            >
              {tab.name}
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center h-[335px] rounded-[0_0_12px_12px] shadow-md bg-white">
          <div className="mt-5">
            <img
              width={150}
              src="https://cdn1.concung.com/themes/desktop4.1/image/v40/bg/order-empty.png"
              alt="Shopping Cart"
            />
          </div>
          <div className="space-x-2 mt-4">
            <Link to="/">
              <button className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600">
                Bắt đầu mua sắm
              </button>
            </Link>
            <Link to="/cart">
              <button className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600">
                Vào xem giỏ hàng
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderEmpty;
