import { Button } from 'antd';
import { useEffect, useState } from 'react';
import OrderAPI from '../../services/order/order';

function OrderStatus({ orderId, handleOrderStatusChange }) {
  const [selectedOrderStatus, setSelectedOrderStatus] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);

  const handleGetOrder = async () => {
    try {
      const response = OrderAPI.getAllOrders();
      if (response) {
        console.log(response);
        setOrderStatus(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetOrder();
  }, []);

  const toggleOrderStatusSelection = async (orderId) => {
    const newSelectedOrderStatus = selectedOrderStatus.includes(orderId)
      ? selectedOrderStatus.filter((id) => id !== orderId)
      : [...selectedOrderStatus, orderId];
    setSelectedOrderStatus(newSelectedOrderStatus);
    handleOrderStatusChange(newSelectedOrderStatus);
  };
  return (
    <div className=''>
      <Button
        type='dashed'
        key='reset-order-status'
        className='p-2 text-center'
        onClick={() => {
          setSelectedOrderStatus([]);
          handleOrderStatusChange([]);
        }}
      >
        Tất cả đơn hàng
      </Button>
      {orderStatus.map((order) => (
        <Button
          type='dashed'
          key={order.orderId}
          className={`p-3 text-center ${
            selectedOrderStatus.includes(order.orderId)
              ? 'bg-blue-500 text-white'
              : ''
          }`}
          onClick={() => toggleOrderStatusSelection(order.orderId)}
        >
          {order.orderStatus}
        </Button>
      ))}
    </div>
  );
}

export default OrderStatus;
