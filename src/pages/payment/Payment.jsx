import { useContext, useEffect, useState } from "react";
//import redux
import { useDispatch, useSelector } from "react-redux";
//import context,slice
import { addOrder } from "../../redux/features/cart/cartSlice";
import { CartContext } from "../../context/CartContext";
import { AddressContext } from "../../context/AddressContext";

//import react-router-dom
import { useNavigate, Link, useLocation } from "react-router-dom";
import CustomNumberFormat from "../../utils/CustomNumberFormat";
//import antd
import { Button, Input } from "antd";
//import image
import VNPAY from "../../assets/img/VNpay.png";
import ShipCod from "../../assets/img/ShipCod.png";
import FreeShip from "../../assets/img/free-shipping.png";
import Express from "../../assets/img/express.png";
//API
import {
  callPaymentAPI,
  generateMerchantAndDestinationId,
} from "../../services/payment/paymentService";
import { VoucherAPI } from "../../services/voucher";
import { updatePoints } from "../../redux/features/points/pointsSlice";
import OrderAPI from "../../services/order/order";
import { Loading } from "../../components/loader/Loading";
// import { Loading } from "../../components/loader/Loading";

const Payment = () => {
  document.title = "Thanh Toán";
  const navigate = useNavigate();
  const { address } = useContext(AddressContext);
  const { handleRemovePaidItemsFromCart } = useContext(CartContext);
  const dispatch = useDispatch();
  const userPoints = useSelector((state) => state.points.points);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDisCount] = useState(parseFloat(localStorage.getItem("discount")) || 0);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const expressShippingCost = 50000;
  const [paymentMethod, setPaymentMethod] = useState("ShipCod");
  const [error, setError] = useState("");
  const [usePoints, setUsePoints] = useState(false);
  const location = useLocation();
  const selectedCartItems = location.state?.selectedCartItems || [];
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [isVoucherApplied, setIsVoucherApplied] = useState(false);
  const [appliedVoucherCode, setAppliedVoucherCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const totalPrice = selectedCartItems.reduce(
    (acc, item) =>
      acc + item?.product.oldPrice * ((100 - item?.product.discount) / 100) * item.quantity,
    0
  );
  const totalPriceWithVoucher = totalPrice - discount;
  const pointsDiscount = usePoints ? userPoints * 1000 : 0;
  const finalPrice =
    totalPriceWithVoucher +
    (shippingMethod === "express" ? expressShippingCost : 0) - (pointsDiscount / 100);

  useEffect(() => {
    const storedVoucherCode = localStorage.getItem("appliedVoucherCode");
    if (storedVoucherCode) {
      setAppliedVoucherCode(storedVoucherCode);
      setIsVoucherApplied(true);
    }

    const storedDiscount = parseFloat(localStorage.getItem("discount"));
    if (!isNaN(storedDiscount)) {
      setDisCount(storedDiscount);
    }
  }, []);

  const calculatePoints = (finalPrice) => {
    return Math.floor(finalPrice / 1000);
  };

  const handlePayment = async () => {
    if (!address || !address.fullName || !address.phoneNumber || !address.address) {
      setError("Vui lòng nhập địa chỉ nhận hàng.");
      return;
    }
    setIsLoading(true);
    const generateUniqueId = () => {
      return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    };

    const customerInfo = { id: address.id };
    const { merchantId, paymentDestinationId } = generateMerchantAndDestinationId(customerInfo);

    const paymentData = {
      id: generateUniqueId(),
      paymentContent: `Thanh toán đơn hàng ${generateUniqueId()}`,
      paymentCurrency: 'VND',
      paymentRefId: 'ORDER_1234567',
      requiredAmount: finalPrice,
      paymentDate: new Date().toISOString(),
      expireDate: new Date(new Date().getTime() + 30 * 60 * 1000).toISOString(),
      paymentLanguage: 'vn',
      merchantId: merchantId,
      paymentDestinationId: paymentDestinationId,
      paymentStatus: 'Pending',
      paidAmount: finalPrice,
    };

    const DELIVERY_IDS = {
      standard: 1,
      express: 2,
    };

    // Lấy userId từ localStorage và chuyển đổi thành số nguyên
    const userId = parseInt(localStorage.getItem('userId'));
    if (!userId) {
      setError('Vui lòng đăng nhập để tiếp tục.');
      setIsLoading(false); // Stop loading
      return;
    }

    // Initialize orderNote as an empty string
    const orderNote = 'a';
    const selectedProducts = selectedCartItems.filter(product => product.productId);
    console.log("sản phẩm đã chọn:", selectedProducts);
    const orderData = {
      userId: userId,
      recipientName: address.fullName,
      recipientPhone: address.phoneNumber,
      recipientAddress: address.address,
      deliveryId: DELIVERY_IDS[shippingMethod], // Sử dụng giá trị từ trạng thái shippingMethod
      note: orderNote, // Order note is now defined
      userPoints
    };

    const pointsEarned = calculatePoints(finalPrice);

    try {
      // Gọi API để đặt hàng
      const orderRes = await OrderAPI.placeOrder(orderData);
      console.log('Đặt hàng thành công:', orderRes);

      // Xử lý sau khi đặt hàng thành công
      const paidItemIds = selectedProducts.map((item) => item.productId);
      console.log('Paid item IDs:', paidItemIds);
      handleRemovePaidItemsFromCart(paidItemIds);
      localStorage.removeItem('selectedItems');
      dispatch(updatePoints(usePoints ? -userPoints : pointsEarned));

      // Xử lý thanh toán dựa trên phương thức thanh toán
      if (paymentMethod === 'VNPAY') {
        console.log('Dữ liệu thanh toán:', paymentData);
        const paymentResponse = await callPaymentAPI(paymentData);
        window.location.href = paymentResponse.paymentUrl;
      } else if (paymentMethod === 'ShipCod') {
        setTimeout(async () => {
          try {
            // Cập nhật số lượng voucher khi thanh toán thành công
            const selectedVoucher = JSON.parse(localStorage.getItem('sentVoucher'));
            if (selectedVoucher) {
              const updateData = {
                voucherCode: selectedVoucher.voucherCode,
                voucherName: selectedVoucher.voucherName,
                quantity: selectedVoucher.quantity - 1,
                expiredDate: selectedVoucher.expiredDate,
                price: selectedVoucher.price,
                minimumBillAmount: selectedVoucher.minimumBillAmount,
              };

              console.log(`Updating voucher with ID: ${selectedVoucher.voucherId} with data:`, updateData);

              const updateResponse = await VoucherAPI.updateVoucher(selectedVoucher.voucherId, updateData);
              console.log("Update response:", updateResponse);

              // Xóa voucher và các thông tin liên quan khỏi localStorage sau khi cập nhật
              localStorage.removeItem('sentVoucher');
              localStorage.removeItem('isVoucherApplied');
              localStorage.removeItem('appliedVoucherCode');
              localStorage.removeItem('discount');
            }
            navigate('/payment-success');
          } catch (error) {
            console.error("Failed to update voucher quantity after payment:", error);
          }
        }, 3000);
      }

    } catch (error) {
      console.error('Lỗi đặt hàng:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request data:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    } finally {
      setIsLoading(false); // Stop loading
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
        (voucher) => totalPrice >= voucher.minimumBillAmount && voucher.quantity > 0
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
          // console.log("Voucher sent successfully");
          localStorage.setItem('sentVoucher', JSON.stringify(selectedVoucher));

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
        setDisCount(discountValue);
        setIsPopupOpen(false);
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


  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="container mx-auto  p-8 flex bg-[#f5f7fd] ">
        {/* Cart Section */}
        <div className="w-2/3 px-4">
          <div className="cart-container bg-white p-8 rounded-lg shadow-md ">
            {/* Shipping Method */}
            <h3 className="text-lg font-semibold">Hình Thức Giao Hàng</h3>
            <div className="mb-6 flex justify-around">
              <div
                className={`p-4 rounded-lg flex justify-between items-center cursor-pointer ${shippingMethod === "express"
                  ? "border-2 border-solid border-[#ff379b] bg-pink-200"
                  : "bg-pink-100"
                  }`}
                onClick={() => setShippingMethod("express")}
              >
                <img src={Express} width={80} alt="" />
                <div className="flex items-center mx-3">
                  <div>
                    <p className="font-semibold text-[#1f4ea5]">Giao Hỏa Tốc</p>
                    <p className="font-bold">Nhận hàng trong ngày</p>
                  </div>
                </div>
                <p className="font-semibold text-[#ff7637]">50,000₫</p>
              </div>
              <div
                className={`p-4 rounded-lg flex justify-between items-center cursor-pointer ${shippingMethod === "standard"
                  ? "border-2 border-solid border-[#ff379b] bg-pink-200"
                  : "bg-pink-100"
                  }`}
                onClick={() => setShippingMethod("standard")}
              >
                <img src={FreeShip} width={80} alt="" />
                <div className="flex items-center mx-3">
                  <div>
                    <p className="font-semibold text-[#1f4ea5]">Giao Thường</p>
                    <p className="font-bold">Nhận hàng trong 1,2 Ngày</p>
                  </div>
                </div>
                <p className="font-semibold text-[#ff7637]">FreeShip</p>
              </div>
            </div>
            {/*Display product */}
            <div className="flex justify-between items-center leading-4">
              <div className="mb-4 text-[20px] font-bold">Sản Phẩm</div>
            </div>
            {selectedCartItems.map((item) => {
              const priceAfterDiscount =
                item?.product.oldPrice * ((100 - item?.product.discount) / 100);
              const itemTotal = priceAfterDiscount * item.quantity;
              return (
                <div
                  key={item.productId}
                  className="cart-item flex justify-between items-center mb-4"
                >
                  <div className="flex justify-between items-center mb-4">
                    <img
                      src={item?.product?.imageLinks?.split(",")[0]}
                      alt="Sản phẩm"
                      className="cart-item-image w-24 h-24 object-cover"
                    />
                    <div className="cart-item-info flex flex-col grow ml-4">
                      <div className="font-semibold no-underline" to="#">
                        {item?.product.productName}
                      </div>
                    </div>
                  </div>
                  <div className="cart-item-quantity flex items-center space-x-7">
                    <div className="flex items-center justify-center">
                      <div className="w-[30px] text-center border-0 overflow-visible mt-3 mx-2">
                        <p>x{item.quantity}</p>
                      </div>
                    </div>
                    <div className="cart-item-total font-semibold w-20 text-center">
                      <CustomNumberFormat numStr={itemTotal} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Checkout Section */}
        <div className="w-1/3">
          <div className="checkout bg-white p-6 rounded-lg shadow-md space-y-4">
            {/* Address Delivery */}
            <div>
              {address.fullName ? (
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
              )}
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {/* Voucher */}
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
                    onClick={() => setIsPopupOpen(true)}
                  >
                    Bấm vào để chọn hoặc nhập mã ưu đãi
                  </button>
                )}
              </div>
            </div>
            {/* Payment Method */}
            <div className="bg-white p-2 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">
                Phương Thức Thanh Toán
              </h3>
              <div className="flex flex-col space-y-4">
                {/* VNPAY */}
                <div
                  className={`p-2 rounded-lg flex items-center cursor-pointer ${paymentMethod === "VNPAY"
                    ? "border-2 border-solid border-[#ff379b] bg-[#fdebf2]"
                    : "bg-[#f2f2f2]"
                    }`}
                  onClick={() => setPaymentMethod("VNPAY")}
                >
                  <img
                    src={VNPAY}
                    className="h-8 mr-2.5"
                    alt="Thanh toán VNPAY"
                  />
                  <span className="min-w-[181px] leading-[13px] text-gray-700 ml-2.5 py-2.5 font-medium text-sm">
                    Thanh toán VNPAY
                  </span>
                </div>
                {/* ShipCod */}
                <div
                  className={`p-2 rounded-lg flex items-center cursor-pointer ${paymentMethod === "ShipCod"
                    ? "border-2 border-solid border-[#ff379b] bg-[#fdebf2]"
                    : "bg-[#f2f2f2]"
                    }`}
                  onClick={() => setPaymentMethod("ShipCod")}
                >
                  <img
                    src={ShipCod}
                    className="h-8 mr-2.5"
                    alt="Thanh toán khi nhận hàng"
                  />
                  <span className="min-w-[181px] leading-[13px] text-gray-700 ml-2.5 py-2.5 font-medium text-sm">
                    Thanh toán khi nhận hàng
                  </span>
                </div>
              </div>
            </div>
            {/* Checkout */}
            <div className="summary bg-white p-4 rounded-lg">
              <p className="my-2 text-inherit">
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
              <p className="my-2 text-inherit">
                Phí vận chuyển:{" "}
                <span className="font-bold">
                  <CustomNumberFormat
                    numStr={
                      shippingMethod === "express" ? expressShippingCost : 0
                    }
                  />
                </span>
              </p>
              {userPoints > 0 && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={usePoints}
                    onChange={() => setUsePoints(!usePoints)}
                    className="mr-2"
                  />
                  <span>Sử dụng {userPoints} điểm để giảm giá</span>
                </div>
              )}
              <p className="my-2 text-inherit">
                Tổng tiền:{" "}
                <span className="font-bold">
                  <CustomNumberFormat numStr={finalPrice} />
                </span>
              </p>
              <p className="my-2 text-inherit">
                Điểm tích lũy:{" "}
                <span className="font-bold">
                  {calculatePoints(finalPrice)} điểm
                </span>
              </p>
              {isLoading && <Loading />}
              <button
                className="w-full border-none bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 px-4 rounded-full mt-4 font-semibold hover:from-pink-600 hover:to-red-600 transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                onClick={handlePayment}
              >
                Đặt Hàng
              </button>
              {error && <p>{error}</p>}
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
                <Button onClick={() => setIsPopupOpen(false)} className="mt-4">
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
                <Button onClick={() => setIsPopupOpen(false)} className="mt-4">
                  Đóng
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
