import { useContext, useState } from "react";
import { AddressContext } from "../../context/AddressContext";
import { Link, useNavigate } from "react-router-dom";
import CustomNumberFormat from "../../utils/CustomNumberFormat";
import { AuthContext } from "../../context/AuthContextUser";



const CartEmpty = () => {
  const { address } = useContext(AddressContext);
  const navigate = useNavigate();
  const handleLoginRedirect = () => {
    navigate("/login");
  };
  const handleCheckout = () => {
    alert("Bạn Chưa Có Sản Phẩm Nào Trong Giỏ Hàng !");
  };
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <div className="bg-[#f5f7fd] min-h-screen flex flex-col justify-between">
      <div className="container mx-auto p-8 flex bg-[#f5f7fd] space-x-8">
        {/* Cart Section */}
        <div className="w-2/3">
          <div className="cart text-center bg-white p-8 rounded-lg shadow-md">
            <img
              src="https://cdn1.concung.com/themes/desktop4.1/image/v40/bg/cart-empty.png"
              alt="Empty Cart"
              className="w-48 mx-auto mb-4"
            />
            <p>Hiện chưa có sản phẩm nào trong giỏ hàng</p>
          </div>
        </div>
        {/* Checkout Section */}
        <div className="w-1/3">
          <div className="checkout bg-white p-6 rounded-lg shadow-md space-y-4">
            {/* Address Delivery */}
            <div>
              {isAuthenticated ? (
                address.fullName ? (
                  <>
                    <Link to="/addresslist" className="float-right">
                      <button className="h-12 border-solid rounded-xl border-white bg-white text-pink-500 text-lg ">
                        Thay Đổi
                      </button>
                      <img
                        width="6"
                        height="12"
                        className="icon-up-right"
                        viewBox="0 0 6 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      />
                    </Link>
                    <h3 className="font-bold text-[20px] leading-4 text-inherit">
                      Địa Chỉ Nhận Hàng
                    </h3>
                    <p className="leading-6 mt-2">
                      {address.fullName} | {address.phoneNumber}
                      <br />
                      {address.address}
                    </p>
                  </>
                ) : (
                  <Link to="/addresslist">
                    <button className="w-full h-12 border-dashed border-2 border-pink-500 text-pink-500 text-lg py-2 px-4 rounded-lg transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                      Xác định địa chỉ nhận hàng
                    </button>
                  </Link>
                )
              ) : (
                <button
                  onClick={handleLoginRedirect}
                  className="w-full h-12 border-dashed border-2 border-pink-500 text-pink-500 text-lg py-2 px-4 rounded-lg transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Đăng Nhập Để Nhập Địa Chỉ
                </button>
              )}
            </div>
            {/* Promotion */}
            <div className="coupon bg-white p-1 rounded-lg">
              <h3 className="font-semibold text-lg">Ưu đãi & mã giảm giá</h3>
              <div className="mt-2">
                <button
                  className="w-full font-semibold border-pink-500 border-2 text-pink-500 bg-white py-2 px-4 rounded-lg  transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  onClick={() => setIsPopUpOpen(true)}
                >
                  Bấm vào để Chọn hoặc Nhập Mã ưu đãi
                </button>
              </div>
            </div>
            {/* Checkout */}
            <div className="summary bg-white p-4 rounded-lg">
              <p className="my-2">
                Tạm tính:{" "}
                <span className="font-bold">
                  0đ
                </span>
              </p>
              <p className="my-2">
                Giảm giá:{" "}
                <span className="font-bold">
                  0đ
                </span>
              </p>
              <p className="my-2">
                Tổng tiền:{" "}
                <span className="font-bold">
                  0đ
                </span>
              </p>
              <button
                onClick={handleCheckout}
                className="w-full border-none bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 px-4 rounded-full mt-4 font-semibold hover:from-pink-600 hover:to-red-600 transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Tiếp Tục
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartEmpty;
