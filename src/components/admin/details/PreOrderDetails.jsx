import { Modal, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { productAPI } from '../../../services/product';
import UserAPI from '../../../services/account/User';
import { formatDate } from '../../../utils/utils';

function PreOrderDetails({
  preOrder,
  handleOnCancelDetail,
  handleOnOkDetail,
  detailModal,
}) {
  const [customer, setCustomer] = useState({});
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (preOrder?.userId) {
      const fetchCustomer = async () => {
        try {
          const customerData = await UserAPI.fetchAccount(preOrder.userId);
          setCustomer(customerData);
        } catch (error) {
          console.error('Failed to fetch customer data:', error);
        }
      };
      fetchCustomer();
    }
  }, [preOrder?.userId]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (preOrder?.productId) {
        try {
          const productData = await productAPI.fetchProduct(preOrder.productId);
          setProducts(productData);
        } catch (error) {
          console.error('Failed to fetch product data:', error);
        }
      }
    };
    fetchProducts();
  }, [preOrder?.productId]);

  return (
    <Modal
      onCancel={handleOnCancelDetail}
      onOk={handleOnOkDetail}
      open={detailModal}
    >
      <div className='modal-header'>
        <h5 className='modal-title'>Chi tiết đơn hàng</h5>
      </div>
      <div className='modal-body'>
        <div className='form-group'>
          <label className='form-label'>Mã đơn hàng</label>
          <Typography>{preOrder?.preOrderId}</Typography>
        </div>
        <div className='form-group mt-3'>
          <label className='form-label'>Sản phẩm</label>
          <div>
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product?.productId}>
                  <Typography>Tên sản phẩm: {product?.productName}</Typography>
                  <Typography>Số lượng: {product?.quantity}</Typography>
                </div>
              ))
            ) : (
              <Typography>Loading...</Typography>
            )}
          </div>
        </div>
        <div className='form-group mt-3'>
          <label className='form-label'>Order Date</label>
          <Typography>{formatDate(preOrder?.preOrderDate)}</Typography>
        </div>
        <div className='form-group mt-3'>
          <label className='form-label'>Thông tin khách hàng</label>
          <Typography>Tên: {customer.userName}</Typography>
          <Typography>Số điện thoại: {customer.phone}</Typography>
          <Typography>Email: {customer.email}</Typography>
          <Typography>Địa chỉ: {customer.address}</Typography>
        </div>
        <div className='form-group mt-3'>
          <label className='form-label'>Gửi thông báo</label>
          <Typography>
            {preOrder?.notificationSent
              ? 'Đã gửi thông báo'
              : 'Chưa gửi thông báo'}
          </Typography>
        </div>
      </div>
    </Modal>
  );
}

export default PreOrderDetails;
