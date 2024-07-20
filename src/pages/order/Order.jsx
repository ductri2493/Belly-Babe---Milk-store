import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import CustomNumberFormat from "../../utils/CustomNumberFormat";
// import { FaShop } from "react-icons/fa";
import OrderAPI from "../../services/order/order";
import ProfileSidebar from "../../components/siderbar/profilesidebar";
import { FaUser } from "react-icons/fa";
import { Modal, notification, Rate } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import FeedbackAPI from "../../services/feedback/feedback";
import TextArea from "antd/es/input/TextArea";
import ChatBot from "../../components/chatbox/ChatBot";

const Order = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Đơn Hàng";
    getOrderFromUserId();
  }, []);

  const [selectedTab, setSelectedTab] = useState("all");

  const tabs = [
    { label: "Tất cả đơn", value: "all" },
    { label: "Chờ xác nhận", value: "Chờ xác nhận" }, // Added "Chờ xác nhận" tab
    { label: "Đã xác nhận", value: "Đã xác nhận" }, // Added "Chờ xác nhận" tab
    { label: "Đang giao", value: "Đang giao hàng" }, // Updated status names to match API
    { label: "Đã giao", value: "Đã giao hàng" }, // Updated status names to match API
    { label: "Đã hủy", value: "Đã hủy" }, // Updated status names to match API
  ];

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrderFromUserId();
  }, []);

  const getOrderFromUserId = async () => {
    try {
      const userId = parseInt(localStorage.getItem("userId"));
      const response = await OrderAPI.getOrderFromUser(userId);
      const _response = response.$values;
      if (_response.length > 0) {
        const mappedOrders = _response.map((order) => {
          let tabValue = "all";
          const latestStatusName = getLatestStatusName(order.orderStatuses);
          if (latestStatusName) {
            // Check if there's a valid latestStatusName
            if (latestStatusName === "Đang giao hàng") {
              tabValue = "delivering";
            } else if (latestStatusName === "Đã giao hàng") {
              tabValue = "delivered";
            } else if (latestStatusName === "Đã hủy") {
              tabValue = "cancelled";
            }
          }
          return {
            ...order,
            status: tabValue,
            latestStatusName, // Add this property to track the latest status name
          };
        });
        // Sort orders by orderDate in descending order
        const sortedOrders = mappedOrders.sort(
          (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
        );
        setOrders(sortedOrders);
      } else {
        console.log("No orders found for userId:", userId);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    const day = dateObject.getDate();
    const month = dateObject.getMonth() + 1;
    const year = dateObject.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getStatusBadgeClass = (statusName) => {
    switch (statusName) {
      case "Chờ xác nhận":
        return "bg-yellow-100 text-yellow-800";
      case "Đã xác nhận":
        return "bg-yellow-100 text-yellow-800";
      case "Đang giao hàng":
        return "bg-blue-100 text-blue-800";
      case "Đã giao hàng":
        return "bg-green-100 text-green-800";
      case "Đã hủy":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  ///////////// LatestStatusName ////////////////////
  const getLatestStatusName = (orderStatuses) => {
    if (orderStatuses && orderStatuses.$values.length > 0) {
      // Sort by statusUpdateDate in descending order
      const sortedStatuses = orderStatuses.$values.sort((a, b) => {
        return new Date(b.statusUpdateDate) - new Date(a.statusUpdateDate);
      });
      // Get the statusName of the first (latest) element
      return sortedStatuses[0].statusName;
    }
    return null; // Or any default value you want to display if there are no statuses
  };
  ///////////////////////////////////////////////////

  ///////////// CANCEL ORDER //////////////////////
  // State and functions for handling cancel order
  const [showModalCancel, setShowModalCancel] = useState(false);
  const [orderIdToCancel, setOrderIdToCancel] = useState(null);

  const handleCancelOrder = (orderId) => {
    setOrderIdToCancel(orderId);
    setShowModalCancel(true); // Set showModal to true to trigger the modal
  };

  // Additional state to trigger order refresh
  const [shouldRefreshOrders, setShouldRefreshOrders] = useState(false);
  useEffect(() => {
    // Fetch orders initially and whenever shouldRefreshOrders changes
    getOrderFromUserId();
  }, [shouldRefreshOrders]);

  const confirmCancelOrder = async () => {
    try {
      console.log("Cancelling order with ID:", orderIdToCancel);
      const cancelResponse = await OrderAPI.cancelOrder(orderIdToCancel);
      console.log("API response for cancellation:", cancelResponse);
      if (
        cancelResponse.message &&
        cancelResponse.message.includes("thành công")
      ) {
        console.log("Order cancellation successful!");
        setOrders(
          orders.map((order) => {
            if (order.orderId === orderIdToCancel) {
              return {
                ...order,
                status: "cancelled",
                orderStatuses: {
                  $values: [
                    ...order.orderStatuses.$values,
                    { statusName: "Đã hủy" },
                  ],
                },
              };
            }
            return order;
          })
        );
        setShouldRefreshOrders((prev) => !prev);
      } else {
        const errorMessage = cancelResponse.message || "Unknown error";
        console.error("Order cancellation failed. Reason:", errorMessage);
        // Show error message to the user if needed
      }

      setShowModal(false);
    } catch (error) {
      console.error("Error cancelling order:", error);
      // Handle errors, e.g., show a user-friendly message
    }
  };
  ////////////////////////////////////

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const filteredOrders = useMemo(() => {
    return selectedTab === "all"
      ? orders
      : orders.filter(
          (order) => getLatestStatusName(order.orderStatuses) === selectedTab
        );
  }, [selectedTab, orders]);

  const [feedbackData, setFeedbackData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reviewedOrders, setReviewedOrders] = useState([]);

  const handleReviewOrder = (order) => {
    setSelectedOrder(order);
    setFeedbackData(
      order.orderDetails.$values.map((orderDetail) => ({
        productId: orderDetail.productId,
        content: "",
        rating: 0,
      }))
    );
    setShowModal(true);
  };

  const handleFeedbackChange = (index, field, value) => {
    setFeedbackData((prevData) =>
      prevData.map((data, i) =>
        i === index ? { ...data, [field]: value } : data
      )
    );
  };

  const submitFeedback = async () => {
    try {
      const userId = parseInt(localStorage.getItem("userId"));

      for (const feedback of feedbackData) {
        if (!feedback.rating) {
          notification.error({
            message: "Vui lòng đánh giá tất cả sản phẩm",
            description:
              "Hãy chắc chắn bạn đã đánh giá tất cả các sản phẩm trước khi gửi.",
          });
          return; // Stop submission if any rating is missing
        }

        const feedbackResponse = await FeedbackAPI.addFeedback({
          userId,
          orderId: selectedOrder.orderId,
          productId: feedback.productId,
          content: feedback.content,
          rating: feedback.rating,
        });

        if (
          feedbackResponse.message &&
          feedbackResponse.message.includes("already provided feedback")
        ) {
          notification.warning({
            message: "Bạn đã đánh giá sản phẩm này rồi",
            description: "Bạn chỉ có thể đánh giá sản phẩm một lần.",
          });
          return; // Skip to the next product
        }

        // Log the feedback response (optional)
        console.log(
          `Feedback for product ${feedback.productId}:`,
          feedbackResponse
        );
      }

      // Update reviewedOrders after all successful submissions
      setReviewedOrders((prevReviewedOrders) => [
        ...prevReviewedOrders,
        ...feedbackData.map((f) => f.productId),
      ]);

      // Show success notification
      notification.success({
        message: "Cảm ơn bạn đã đánh giá!",
      });

      setShowModal(false);
      getOrderFromUserId(); // Refresh orders
    } catch (error) {
      console.error("Error submitting feedback:", error);
      notification.error({
        message: "Thông báo",
        description: "Đơn hàng này bạn đã đánh giá.", // Customize if needed
      });
    }
  };

  return (
    <div className="min-h-fit flex flex-col lg:flex-row bg-gray-100 mx-28">
      <ProfileSidebar />
      <div className="flex-1 p-4 mx-5">
        <div className="flex justify-evenly rounded-[12px_12px_0_0] bg-gradient-to-r from-purple-500 to-pink-500">
          {tabs.map((tab) => (
            <div
              key={tab.value}
              onClick={() => handleTabClick(tab.value)}
              className={`py-2 px-4 cursor-pointer ${
                selectedTab === tab.value
                  ? "text-[black] hover:transform hover:scale-125 transition-transform duration-300 font-bold"
                  : "text-white"
              }`}
            >
              {tab.label}
            </div>
          ))}
        </div>
        <div className="flex flex-col rounded-[0_0_12px_12px] bg-white px-4 pb-3 min-h-[335px] shadow-md">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center h-[335px] rounded-[0_0_12px_12px]  bg-white">
              <div className="mt-5">
                <img
                  width={150}
                  src="https://cdn1.concung.com/themes/desktop4.1/image/v40/bg/order-empty.png"
                  alt="Shopping Cart"
                />
              </div>
              <div className="space-x-2 mt-4">
                <Link to="/">
                  <button className="shadow-xl bg-gradient-to-r from-orange-500 to-orange-300 border-none text-white py-2 px-4 rounded hover:bg-orange-600">
                    Bắt đầu mua sắm
                  </button>
                </Link>
                <Link to="/cart">
                  <button className="shadow-xl bg-gradient-to-r  from-pink-500 to-pink-300 border-none text-white py-2 px-4 rounded hover:bg-pink-600">
                    Vào xem giỏ hàng
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white rounded-lg shadow-lg p-6 my-4 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Header Section */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <FaUser className="mr-2 text-blue-500" />
                    <span className="font-semibold text-gray-800">
                      {order.recipientName}
                    </span>
                    <span className="text-gray-600 ml-2">
                      | {formatDate(order.orderDate)}
                    </span>
                  </div>
                  {/* Use getLatestStatusName for display */}
                  <div
                    className={`py-1 px-2 rounded-full text-sm ${getStatusBadgeClass(
                      getLatestStatusName(order.orderStatuses)
                    )}`}
                  >
                    {getLatestStatusName(order.orderStatuses)}
                  </div>
                </div>

                {/* Order Details Section */}
                <div className="space-y-4">
                  {order.orderDetails?.$values.map((orderDetail) => (
                    <div
                      key={orderDetail.productId}
                      className="flex items-start"
                    >
                      <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={orderDetail.product.imageLinks.split(",")[0]}
                          alt="Product"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <h2 className="font-semibold text-base text-gray-900">
                          {orderDetail.product.productName}
                        </h2>
                        <p className="text-gray-600">x{orderDetail.quantity}</p>
                        <p className="mt-2 font-semibold text-gray-800">
                          <CustomNumberFormat
                            numStr={
                              orderDetail.product.newPrice *
                              orderDetail.quantity
                            }
                          />
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Total Price Section */}
                <div className="mt-4 flex justify-between items-center">
                  {/* Cancel Order Button (Left) */}
                  {order.orderStatuses.$values[0]?.statusName ===
                    "Chờ xác nhận" && (
                    <button
                      onClick={() => handleCancelOrder(order.orderId)}
                      className="border-none bg-red-100 rounded-full px-2 flex items-center text-red-500 hover:text-red-600 transition duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Hủy đơn hàng
                    </button>
                  )}
                  {/* Review Order Button (Left) */}
                  {/* Review Order Button (Left) */}
                  {getLatestStatusName(order.orderStatuses) ===
                    "Đã giao hàng" && (
                    <div className="flex justify-end mt-4">
                      {reviewedOrders.includes(order.orderId) ? ( // Check if any product in the order is reviewed
                        <button className="px-4 py-2 text-white rounded-lg bg-green-500 cursor-default">
                          Đã đánh giá đơn hàng
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReviewOrder(order)}
                          className="px-4 py-2 text-white rounded-lg bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-75"
                        >
                          Đánh giá sản phẩm
                        </button>
                      )}
                    </div>
                  )}
                  {/* Total Price (Right) */}
                  <div className="text-lg font-bold text-gray-800">
                    Tổng cộng: <CustomNumberFormat numStr={order.totalPrice} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <ChatBot />
      {/* Confirmation Modal */}
      <Modal
        title="Đánh giá sản phẩm"
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={() => {
          const hasMissingRatings = feedbackData.some(
            (feedback) => !feedback.rating
          );

          if (hasMissingRatings) {
            notification.error({
              message: "Vui lòng đánh giá tất cả sản phẩm",
              description:
                "Hãy chắc chắn bạn đã đánh giá tất cả các sản phẩm trước khi gửi.",
            });
          } else {
            submitFeedback(); // Proceed with submission
          }
        }}
        okText="Submit"
        cancelText="Cancel"
      >
        {selectedOrder &&
          feedbackData.map((feedback, index) => (
            <div key={index} className="mb-4">
              <div className="mb-2 font-semibold">
                Sản phẩm:
                {
                  selectedOrder.orderDetails.$values.find(
                    (detail) => detail.productId === feedback.productId
                  ).product.productName
                }
              </div>
              <div>
                <img
                  src={
                    selectedOrder.orderDetails.$values
                      .find((detail) => detail.productId === feedback.productId)
                      .product.imageLinks.split(",")[0]
                  }
                  className="w-20 h-20 object-cover"
                />
              </div>
              <Rate
                value={feedback.rating}
                onChange={(value) =>
                  handleFeedbackChange(index, "rating", value)
                }
              />
              <TextArea
                rows={4}
                value={feedback.content}
                onChange={(e) =>
                  handleFeedbackChange(index, "content", e.target.value)
                }
                placeholder="Viết đánh giá của bạn"
              />
            </div>
          ))}
      </Modal>
      <Modal
        title="Xác nhận hủy đơn hàng"
        open={showModalCancel}
        onOk={confirmCancelOrder}
        onCancel={() => setShowModalCancel(false)}
        okText="Có"
        cancelText="Không"
        className="rounded-lg shadow-lg"
      >
        <div className="p-4">
          <p className="text-base leading-relaxed">
            <ExclamationCircleOutlined className="text-red-500 mr-2" />
            Bạn có chắc chắn muốn hủy đơn hàng này không?
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Order;
