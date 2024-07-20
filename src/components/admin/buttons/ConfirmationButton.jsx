import { Button } from 'antd';
import OrderAPI from '../../../services/order/order';
import { toast } from 'react-toastify';

function ConfirmationButton({ orderId, setIsUpdate }) {
  const handleOrderStatusUpdateChange = async () => {
    try {
      const response = await OrderAPI.updateOrderStatus(orderId, {
        statusName: 'Đã xác nhận',
      });
      if (response) {
        toast.success('Cập nhật trạng thái đơn hàng thành công');
        setIsUpdate((prevState) => !prevState);
      }
    } catch (error) {
      toast.error('Cập nhật trạng thái đơn hàng thất bại');
    }
  };
  return (
    <div>
      <Button
        className='-ml-4 btn-outline-primary'
        onClick={handleOrderStatusUpdateChange}
      >
        Xác nhận
      </Button>
    </div>
  );
}

export default ConfirmationButton;
