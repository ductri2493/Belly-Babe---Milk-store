import React from "react";
import { Link } from "react-router-dom";

const PaymentSuccess = () => {
  window.scrollTo(0, 0);
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-semibold mb-4">
          Đã đặt hàng thành công
        </h1>
        <p className="mb-6">
          Cảm ơn ba mẹ đã tin tưởng và mua sản phẩm của Belly&Babe.
        </p>
        <Link to="/" className="text-white">
          <button className="w-full border-none bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 px-4 rounded-full mt-4 font-semibold hover:from-pink-600 hover:to-red-600 transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
            Quay lại trang chủ
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
