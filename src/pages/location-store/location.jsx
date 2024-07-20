import React from "react";
import BellybabeMap from "./bellybabeMap"; // Assuming this is the path to your bellybabeMap component
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaShoppingCart } from "react-icons/fa";
import ChatBot from "../../components/chatbox/ChatBot";

const Location = () => {
  window.scrollTo(0, 0);
  return (
    <div className="py-8 mx-auto bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-4 rounded-xl bg-white shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-6">Tìm siêu thị</h1>
        <div className="flex flex-col lg:flex-row">
          {/* Adjust height as needed */}
          <div className="w-full lg:w-1/2 h-[400px] mb-6 lg:mb-0 lg:mr-4 rounded-xl overflow-hidden">
            <BellybabeMap />
          </div>
          {/* Detail Address */}
          <div className="w-full lg:w-1/2 px-4">
            <h2 className="text-3xl font-bold text-black bg-[#fee5f0] rounded-xl p-4 mb-6">
              Siêu thị
            </h2>
            {/* Address 1 */}
            <div className="flex items-start mb-6 bg-[#fee5f0] rounded-xl p-4 shadow-md">
              <span className="text-3xl text-[#f83c86] mr-4">
                <FaMapMarkerAlt />
              </span>
              <div className="w-full">
                <h3 className="text-xl font-bold mb-1">
                  Nhà Văn hóa Sinh viên TP.HCM
                </h3>
                <p className="text-gray-600 mb-2">
                  Lưu Hữu Phước, Đông Hoà, Dĩ An, Bình Dương, Vietnam
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaShoppingCart className="text-[#f83c86] mr-2" />
                    <Link to="https://zalo.me/g/zuxrqd590" className="text-[#f83c86] hover:underline">
                      Mua sắm & Hỗ Trợ qua Zalo, Bấm vào
                    </Link>
                  </div>
                  <div className="text-[#8F3A72] text-sm">
                    07:30 - 21:30
                  </div>
                </div>
              </div>
            </div>
            {/* Address 2 */}
            <div className="flex items-start bg-[#fee5f0] rounded-xl p-4 shadow-md">
              <span className="text-3xl text-[#f83c86] mr-4">
                <FaMapMarkerAlt />
              </span>
              <div className="w-full">
                <h3 className="text-xl font-bold mb-1">
                  Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ
                </h3>
                <p className="text-gray-600 mb-2">
                  Thành Phố Thủ Đức, Hồ Chí Minh 700000
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaShoppingCart className="text-[#f83c86] mr-2" />
                    <Link to="https://zalo.me/g/zuxrqd590" className="text-[#f83c86] hover:underline">
                      Mua sắm & Hỗ Trợ qua Zalo, Bấm vào
                    </Link>
                  </div>
                  <div className="text-[#8F3A72] text-sm">
                    07:30 - 21:30
                  </div>
                  <ChatBot />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Location;
