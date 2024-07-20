import React, { useState } from "react";
// import { items } from './items'
import shop from "../../assets/img/sieu-thi.png";
import call from "../../assets/img/call.png";
import bigdeal from "../../assets/img/big-deal.png";
import gift from "../../assets/img/gift-active.png";
import order from "../../assets/img/order.png";
import { Link } from "react-router-dom";
import QRcode from "../../assets/img/QRcodeZalo.jpg";

const Services = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="section-page p-6 mt-4 rounded-2xl bg-white relative ">
      <div className="header-title pb-6  items-center">
        <h2 className="text-2xl font-bold inline-block">Tiện ích, dịch vụ</h2>

        <div className="grid grid-cols-5 px-10 mt-7 font-bold">
          {/* shop */}
          <Link to="/location">
            <div className="duration-300 hover:transform hover:scale-105 transition-transform ">
              <div className="text-center text-sm">
                <img src={shop} width={65} height={67} alt="shop" />
              </div>
              <div className="text-center text-black">Siêu Thị Belly&Babe</div>
            </div>
          </Link>
          {/* call */}
          <div
            className="duration-300 hover:transform hover:scale-105 transition-transform "
            onClick={handleOpenModal}
          >
            <div className="text-center text-sm">
              <img src={call} width={65} height={67} alt="shop" />
            </div>
            <div className="text-center text-black">CSKH Gọi Điện </div>
          </div>
          {/* big deal */}
          <Link to="/deal">
            <div className="duration-300 hover:transform hover:scale-105 transition-transform ">
              <div className="text-center text-sm">
                <img src={bigdeal} width={65} height={67} alt="shop" />
              </div>
              <div className="text-center text-black">Siêu Deal Mỗi Ngày</div>
            </div>
          </Link>
          {/* gift */}
          <Link to="/gift">
            <div className="duration-300 hover:transform hover:scale-105 transition-transform ">
              <div className="text-center text-sm">
                <img src={gift} width={65} height={67} alt="shop" />
              </div>
              <div className="text-center text-black">Ưu Đãi Hấp Dẫn</div>
            </div>
          </Link>
          {/* order */}
          <Link to="/order">
            <div className="duration-300 hover:transform hover:scale-105 transition-transform ">
              <div className="text-center text-sm">
                <img src={order} width={65} height={67} alt="shop" />
              </div>
              <div className="text-center text-black">Tra Cứu Đơn Hàng</div>
            </div>
          </Link>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-3xl font-bold mb-4">Chăm Sóc Khách Hàng</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2 mt-14">
                <p className="mb-4 text-gray-700">
                  Mọi thắc mắc quý khách hãy liên hệ qua Zalo của chúng tôi
                </p>
              </div>
              <div className="w-full md:w-1/2">
                <img
                  src={QRcode}
                  width={150}
                  alt="QR Code"
                  className="mx-auto mb-4"
                /><br />
                <a href="https://zalo.me/g/kvvdjf475" target="_blank">https://zalo.me/g/kvvdjf475</a>
              </div>
            </div>
            <button
              className="bg-blue-500 border-none text-white px-4 py-2 rounded font-medium hover:bg-blue-600 transition-colors"
              onClick={handleCloseModal}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
