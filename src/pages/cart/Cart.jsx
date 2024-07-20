import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FcFullTrash } from "react-icons/fc";
import CartEmpty from "./CartEmpty";
import CustomNumberFormat from "../../utils/CustomNumberFormat";
// import antd
import { Button, ConfigProvider, Input } from "antd";
import { AddressContext } from "../../context/AddressContext";
import { CartContext } from "../../context/CartContext";
import {
  decreaseQuantity,
  fetchCartItems,
  increaseQuantity,
} from "../../redux/features/cart/cartSlice";
import ConfirmationModal from "./ConfirmationModal";
import { AuthContext } from "../../context/AuthContextUser";
//api
import { VoucherAPI } from "../../services/voucher";
import CartAPI from "../../services/order/cart";
import { toast, ToastContainer } from "react-toastify";

const Cart = () => {
  const navigate = useNavigate();
  document.title = "Giỏ Hàng";
  const location = useLocation();
  const { state } = location;
  const initialSelectedItems =
    state && state.productId ? { [state.productId]: true } : {};
  const [error, setError] = useState("");
  // Address context
  const { address } = useContext(AddressContext);

  // Redux
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  // Remove from cart
  const { handleRemoveFromCart } = useContext(CartContext);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Voucher state
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(
    parseFloat(localStorage.getItem("discount")) || 0
  );
  const [isPopupOpen, setIsPopUpOpen] = useState(false);

  // Selected items state
  const [selectedItems, setSelectedItems] = useState(() => {
    const savedSelectedItems = localStorage.getItem("selectedItems");
    return savedSelectedItems
      ? JSON.parse(savedSelectedItems)
      : initialSelectedItems;
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const userId = localStorage.getItem("userId");
  //voucher apply succesfully
  const [isVoucherApplied, setIsVoucherApplied] = useState(false);
  const [appliedVoucherCode, setAppliedVoucherCode] = useState("");

  // Auth context
  const { isAuthenticated } = useContext(AuthContext); // Use AuthContext to get authentication status

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      dispatch(fetchCartItems(userId));
    }

    const newTotalPrice = cartItems.reduce((acc, item) => {
      const priceAfterDiscount = userId
        ? item?.product?.oldPrice * ((100 - item?.product?.discount) / 100) || 0
        : item?.oldPrice * ((100 - item?.discount) / 100) || 0;
      const itemTotal = priceAfterDiscount * item.quantity || 0;
      return selectedItems[item.productId] ? acc + itemTotal : acc;
    }, 0);

    setTotalPrice(newTotalPrice);

    const storedVoucherCode = localStorage.getItem("appliedVoucherCode");
    if (storedVoucherCode) {
      setAppliedVoucherCode(storedVoucherCode);
      setIsVoucherApplied(true);
    }
  }, [dispatch, selectedItems, cartItems]);

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setProductToDelete(null);
    localStorage.removeItem("selectedItems");
  };

  const handleConfirmDelete = async () => {
    try {
      if (productToDelete) {
        await handleRemoveFromCart(productToDelete);
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error in handleConfirmDelete:", error);
    }
  };

  const handleChangeQuantity = async (productId, changeType) => {
    try {
      const userId = parseInt(localStorage.getItem("userId"));
      if (changeType === "increase") {
        const response = await CartAPI.increaseQuantity({
          userId,
          productId,
          quantityToAdd: 1,
        });
        dispatch(increaseQuantity(productId));
        // console.log("Số lượng sản phẩm đã tăng:", response);
      } else if (changeType === "decrease") {
        const response = await CartAPI.decreaseQuantity({
          userId,
          productId,
          quantityToSubtract: 1,
        });
        dispatch(decreaseQuantity(productId));
        // console.log("Số lượng sản phẩm đã giảm", response)
      }
    } catch (error) {
      console.error("Lỗi khi thay đổi số lượng:", error);
    }
  };

  const handleEmailSubmit = async () => {
    try {
      const response = await VoucherAPI.fetchVouchers();
      // console.log("Full API response:", response);

      // Lấy dữ liệu voucher từ $values
      const vouchers = response.$values || [];
      console.log("Vouchers data:", vouchers);

      if (!Array.isArray(vouchers)) {
        throw new Error("API response is not an array");
      }

      // Sử dụng một mảng để lưu trữ voucher phù hợp
      const validVouchers = vouchers.filter(
        (voucher) =>
          totalPrice >= voucher.minimumBillAmount && voucher.quantity > 0
      );

      if (validVouchers.length === 0) {
        alert(
          "Tổng giá trị đơn hàng không đủ điều kiện để nhận voucher hoặc không còn voucher."
        );
        return;
      }

      // Sắp xếp các voucher hợp lệ theo minimumBillAmount giảm dần
      validVouchers.sort((a, b) => b.minimumBillAmount - a.minimumBillAmount);

      // Lấy voucher có giá trị cao nhất
      const selectedVoucher = validVouchers[0];

      // console.log("Selected voucher:", selectedVoucher);

      if (selectedVoucher) {
        try {
          await VoucherAPI.sendVoucher(email, selectedVoucher.voucherCode);
          console.log("Voucher sent successfully");
          localStorage.setItem("sentVoucher", JSON.stringify(selectedVoucher));
          // console.log("Voucher sent and quantity updated successfully");
          setEmailSent(true);
        } catch (error) {
          console.error("Failed to send voucher or update quantity:", error);
        }
      } else {
        alert(
          "Tổng giá trị đơn hàng không đủ điều kiện để nhận voucher hoặc không còn voucher."
        );
      }
    } catch (error) {
      console.error("Failed to retrieve vouchers:", error);
    }
  };

  const handleApplyVoucher = async () => {
    try {
      const response = await VoucherAPI.validateVoucher(voucherCode);
      const sentVoucher = JSON.parse(localStorage.getItem("sentVoucher"));
      const discountValue = sentVoucher ? sentVoucher.price : 0;

      if (discountValue > 0) {
        setDiscount(discountValue);
        setIsPopUpOpen(false);
        setIsVoucherApplied(true);
        setAppliedVoucherCode(voucherCode);

        localStorage.setItem("discount", discountValue.toString());
        localStorage.setItem("isVoucherApplied", "true");
        localStorage.setItem("appliedVoucherCode", voucherCode);
      } else {
        alert("Mã Giảm Giá Không Hợp Lệ hoặc không đủ điều kiện áp dụng!");
      }
    } catch (error) {
      console.error("Failed to apply voucher:", error);
      alert("Có lỗi xảy ra khi áp dụng mã giảm giá. Vui lòng thử lại sau.");
    }
  };

  const handleCheckboxChange = (productId) => {
    setSelectedItems((prevSelectedItems) => {
      const newSelectedItems = {
        ...prevSelectedItems,
        [productId]: !prevSelectedItems[productId],
      };
      localStorage.setItem("selectedItems", JSON.stringify(newSelectedItems));
      // console.log("Sản phẩm đã chọn:", cartItems.find(item => item.productId === productId));
      return newSelectedItems;
    });
  };

  const handleSelectAll = () => {
    const allSelected = Object.keys(selectedItems).length === cartItems.length;
    const newSelectedItems = {};
    if (!allSelected) {
      cartItems.forEach((item) => {
        newSelectedItems[item.productId] = true;
      });
    }
    setSelectedItems(newSelectedItems);
    console.log("Selected Items:", newSelectedItems); // Đoạn này để kiểm tra sản phẩm đã được tích chọn
  };

  const totalPriceWithVoucher = totalPrice - discount;

  const handlePurchase = () => {
    if (
      !address ||
      !address.fullName ||
      !address.phoneNumber ||
      !address.address
    ) {
      setError("Vui lòng nhập địa chỉ nhận hàng.");
      return;
    }

    const selectedCartItems = cartItems.filter(
      (item) => selectedItems[item.productId]
    );
    if (selectedCartItems.length === 0) {
      toast.error("Xin hãy chọn sản phẩm nếu muốn thanh toán.");
      return;
    }
    navigate("/payment", { state: { selectedCartItems } });
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };
  if (!cartItems || cartItems.length === 0) {
    return <CartEmpty />;
  }

  return (
    <>
      <div className="bg-[#f5f7fd]">
        <div className="container mx-auto p-8 flex bg-[#f5f7fd]">
          {/* Cart Section */}
          <div className="w-2/3 px-4">
            <div className="cart-container bg-white p-8 rounded-lg shadow-md">
              <div className="flex justify-between items-center leading-4">
                <div className="mb-4 text-[20px] font-bold">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      Object.keys(selectedItems).length === cartItems.length
                    }
                  />
                  <span className="mx-3">Giỏ Hàng</span>
                </div>
                <div className="flex text-sm space-x-14">
                  <div>Đơn Giá</div>
                  <div>Số Lượng</div>
                  <div>Thành Tiền</div>
                  <div></div>
                </div>
              </div>
              {cartItems.map((item) => {
                const priceAfterDiscount = userId
                  ? item?.product?.oldPrice * ((100 - item?.product?.discount) / 100)
                  : item?.oldPrice * ((100 - item?.discount) / 100);

                const itemTotal = priceAfterDiscount * item.quantity;
                return (
                  <div
                    key={item.productId}
                    className="cart-item flex justify-between items-center mb-4"
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems[item.productId] || false}
                      onChange={() => handleCheckboxChange(item.productId)}
                      className="mr-2"
                    />
                    <div className="flex justify-between items-center mb-4">
                      <img
                        src={
                          userId
                            ? item?.product?.imageLinks?.split(",")[0]
                            : item?.imageLinks?.split(",")[0]
                        }
                        className="cart-item-image w-24 h-24 object-cover"
                      />
                      <div className="cart-item-info flex flex-col grow mx-4">
                        <Link
                          className="font-semibold no-underline"
                          to={`/${item.parentCategoryName}/${item.productName}`}
                          state={{
                            id: `${item.productId}`,
                            category: `${item.parentCategoryName}`,
                            brandId: `${item.brandId}`,
                          }}
                        >
                          {userId
                            ? item?.product?.productName
                            : item?.productName}
                        </Link>
                      </div>
                    </div>

                    <div className="cart-item-quantity flex items-center space-x-7 ">
                      <div className="w-14 text-center">
                        <span className="font-semibold">
                          <CustomNumberFormat numStr={priceAfterDiscount} />
                        </span>
                      </div>
                      <div className="">
                        <div className="flex items-center">
                          {/* Decrease quantity button */}
                          <ConfigProvider
                            theme={{
                              components: {
                                Button: {
                                  defaultActiveBorderColor: "#CE93D8",
                                },
                              },
                            }}
                          >
                            <Button
                              onClick={() =>
                                handleChangeQuantity(item.productId, "decrease")
                              }
                              type="button"
                              className="m-0 p-0 w-[30px] h-[30px] align-[initial] text-center"
                              disabled={item.quantity === 1}
                            >
                              <svg
                                width={30}
                                height={30}
                                viewBox="0 0 30 30"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="__web-inspector-hide-shortcut__"
                              >
                                <rect
                                  width={30}
                                  height={30}
                                  rx={5}
                                  fill="#EEEEEE"
                                />
                                <line
                                  x1={11}
                                  y1={15}
                                  x2={19}
                                  y2={15}
                                  stroke="#555555"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                />
                              </svg>
                            </Button>
                          </ConfigProvider>
                          {/* Quantity input */}
                          <input
                            type="number"
                            maxLength={3}
                            className="w-[35px] text-center border-0 overflow-visible ml-4"
                            readOnly={true}
                            value={item.quantity}
                          />
                          {/* Increase quantity button */}
                          <ConfigProvider
                            theme={{
                              components: {
                                Button: {
                                  defaultActiveBorderColor: "#CE93D8",
                                },
                              },
                            }}
                          >
                            <Button
                              onClick={() =>
                                handleChangeQuantity(item.productId, "increase")
                              }
                              type="button"
                              className="m-0 p-0 w-[30px] h-[30px] align-[initial] text-center"
                            >
                              <svg
                                width={30}
                                height={30}
                                style={{ verticalAlign: "initial" }}
                                viewBox="0 0 30 30"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  width={30}
                                  height={30}
                                  rx={5}
                                  fill="#EEEEEE"
                                />
                                <line
                                  x1={11}
                                  y1={15}
                                  x2={19}
                                  y2={15}
                                  stroke="#555555"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                />
                                <line
                                  x1={15}
                                  y1={19}
                                  x2={15}
                                  y2={11}
                                  stroke="#555555"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                />
                              </svg>
                            </Button>
                          </ConfigProvider>
                        </div>
                      </div>
                      <div className="cart-item-total font-semibold w-20 text-center">
                        <CustomNumberFormat numStr={itemTotal} />
                      </div>
                      <div>
                        <button
                          className="border-none bg-white hover:transform hover:scale-125 transition-transform duration-300 "
                          onClick={() => handleDeleteClick(item.productId)}
                        >
                          <FcFullTrash className="w-8 h-8" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <ConfirmationModal
                show={showModal}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
              />
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
              {error && <p style={{ color: "red" }}>{error}</p>}
              {/* Promotion */}
              <div className="coupon bg-white p-1 rounded-lg">
                <h3 className="font-semibold text-lg">Ưu đãi & mã giảm giá</h3>
                <div className="mt-2">
                  {isVoucherApplied ? (
                    <p className="w-full font-semibold bg-white border-pink-500 border-solid border-2 text-pink-500 py-2 px-4 rounded-lg transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                      Đã áp dụng mã giảm giá: <span>{appliedVoucherCode}</span>
                    </p>
                  ) : (
                    <button
                      className="w-full font-semibold bg-white border-pink-500 border-2 text-pink-500 py-2 px-4 rounded-lg transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                      onClick={() => setIsPopUpOpen(true)}
                    >
                      Bấm vào để chọn hoặc nhập mã ưu đãi
                    </button>
                  )}
                </div>
              </div>
              {/* Checkout */}
              <div className="summary bg-white p-4 rounded-lg">
                <p className="my-2">
                  Tạm tính:{" "}
                  <span className="font-bold">
                    <CustomNumberFormat numStr={totalPrice} />
                  </span>
                </p>
                {discount > 0 && (
                  <p className="text-sm text-green-500 my-2">
                    Đã áp dụng mã giảm giá. Bạn được giảm{" "}
                    <CustomNumberFormat numStr={discount} />
                  </p>
                )}
                <p className="my-2">
                  Tổng tiền:{" "}
                  <span className="font-bold">
                    <CustomNumberFormat numStr={totalPriceWithVoucher} />
                  </span>
                </p>
                {isAuthenticated ? (
                  <div>
                    <button
                      onClick={handlePurchase}
                      className="w-full border-none bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 px-4 rounded-full mt-4 font-semibold hover:from-pink-600 hover:to-red-600 transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Tiếp Tục
                    </button>
                    <ToastContainer
                      position="top-right"
                      autoClose={2000}
                      hideProgressBar={false}
                      newestOnTop={false}
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                      theme="light"
                    />
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={handleLoginRedirect}
                      className="w-full border-none bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 px-4 rounded-full mt-4 font-semibold hover:from-pink-600 hover:to-red-600 transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Đăng Nhập Để Tiếp Tục
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {isPopupOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-slate-200 bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Nhập Mã Giảm Giá</h2>
              {!emailSent ? (
                <>
                  <div className="flex">
                    <Input
                      placeholder="Nhập Email Để Nhận Mã Giảm Giá"
                      className="mb-4 mr-2 w-72"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="flex justify-end space-x-4">
                      <button
                        className="w-20 h-8 border-none bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-red-600 transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        type="primary"
                        onClick={handleEmailSubmit}
                      >
                        Gửi
                      </button>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsPopUpOpen(false)}
                    className="mt-4"
                  >
                    Đóng
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex">
                    <Input
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      placeholder="Nhập mã ưu đãi"
                      className="mb-4 mr-2"
                    />
                    <div className="flex justify-end space-x-4">
                      <button
                        className="w-20 h-8 border-none bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-red-600 transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        type="primary"
                        onClick={handleApplyVoucher}
                      >
                        Áp dụng
                      </button>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsPopUpOpen(false)}
                    className="mt-4"
                  >
                    Đóng
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
