import { toast } from 'react-toastify';
import preOrderAPI from '../../../services/order/preOrder';
import { Button } from 'antd';

function SendNotificationPreOrderButton({ setIsUpdate, preOrder, customer }) {
  const sendNotificationPreOrder = async () => {
    try {
      const values = {
        preOrderId: preOrder?.preOrderId,
        email: customer?.email,
        productName: preOrder?.productName,
      };
      const response = await preOrderAPI.notifyCustomer(values);
      if (response) {
        toast.success('Notification sent successfully');
        setIsUpdate((prev) => !prev);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred');
    }
  };

  return (
    <Button
      className='btn-outline-secondary'
      onClick={sendNotificationPreOrder}
    >
      Gửi thông báo
    </Button>
  );
}

export default SendNotificationPreOrderButton;
