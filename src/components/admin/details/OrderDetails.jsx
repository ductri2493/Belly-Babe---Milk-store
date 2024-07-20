/* eslint-disable no-unused-vars */
import { Modal, Typography } from 'antd';
import CustomNumberFormat from '../../../utils/CustomNumberFormat';
import { useEffect, useState } from 'react';
import BrandAPI from '../../../services/brand';
import ProductCategory from '../../../services/product/product.category';
import { VoucherAPI } from '../../../services/voucher';
import OrderAPI from '../../../services/order/order';
import UserAPI from '../../../services/account/User';
import { productAPI } from '../../../services/product';
import { formatDate } from '../../../utils/utils';

function OrderDetails({
  orderId,
  handleOnCancelDetail,
  handleOnOkDetail,
  detailModal,
}) {
  const [order, setOrder] = useState({});
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState({});

  useEffect(() => {
    if (orderId) {
      fetchData();
    }
  }, [orderId]);

  const fetchData = async () => {
    try {
      const [
        brandsResponse,
        categoriesResponse,
        vouchersResponse,
        ordersResponse,
        customersResponse,
      ] = await Promise.all([
        BrandAPI.fetchBrands(),
        ProductCategory.fetchCategories(),
        VoucherAPI.fetchVouchers(),
        OrderAPI.getAllOrders(),
        UserAPI.fetchAccounts(),
      ]);

      setBrands(brandsResponse.$values);
      setCategories(categoriesResponse.$values);
      setVouchers(vouchersResponse.$values);
      setCustomers(customersResponse.$values);

      const foundOrder = ordersResponse.$values.find(
        (order) => order.orderId === orderId,
      );
      const customerOrder = customersResponse.$values.find(
        (customer) => customer.userId === foundOrder.userId,
      );
      setCustomer(customerOrder || {});
      setOrder(foundOrder || {});
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  const getOrderStatusBadge = (statusName) => {
    switch (statusName) {
      case 'Chờ xác nhận':
        return 'badge bg-label-warning';
      case 'Đã xác nhận':
        return 'badge bg-label-info';
      case 'Đang giao hàng':
        return 'badge bg-label-primary';
      case 'Đã giao hàng':
        return 'badge bg-label-success text-bold';
      case 'Đã hủy':
        return 'badge bg-label-danger';
      default:
        return '';
    }
  };

  const OrderStatusBadge = ({ orderId }) => {
    const [statusName, setStatusName] = useState('');
    // console.log(orderId);
    const fetchStatusName = async () => {
      const statusNameLatest = await OrderAPI.getLatestOrderStatus(orderId);
      setStatusName(statusNameLatest?.statusName || '');
    };
    useEffect(() => {
      fetchStatusName();
    }, [orderId]);

    return (
      <Typography className={getOrderStatusBadge(statusName)}>
        {statusName}
      </Typography>
    );
  };

  const ProductDetail = ({ productId }) => {
    const [product, setProduct] = useState(null);

    useEffect(() => {
      const fetchProduct = async () => {
        const productData = await productAPI.fetchProduct(productId);
        setProduct(productData);
      };

      fetchProduct();
    }, [productId]);

    return (
      <Typography key={productId}>
        {product ? `Tên Sản phẩm: ${product.productName}` : 'Loading...'}
      </Typography>
    );
  };

  const orderDetails = order.orderDetails?.$values;

  const ProductDetailsOfOrder = ({ orderDetails }) => {
    return (
      <div>
        {orderDetails ? (
          orderDetails.map((detail) => (
            <div key={detail.productId}>
              <ProductDetail productId={detail.productId} />
              <Typography>Số lượng: {detail.quantity}</Typography>
            </div>
          ))
        ) : (
          <Typography>N/A</Typography>
        )}
      </div>
    );
  };

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
          <Typography>{order.orderId}</Typography>
        </div>
        <div className='form-group mt-3'>
          <label className='form-label'>Sản phẩm</label>
          <ProductDetailsOfOrder orderDetails={orderDetails} />
        </div>
        <div className='form-group mt-3'>
          <label className='form-label'>Tổng thành tiền</label>
          <Typography>
            <CustomNumberFormat numStr={order.totalPrice} />
          </Typography>
        </div>
        <div className='form-group mt-3'>
          <label className='form-label'>Ngày đặt hàng</label>
          <Typography>{formatDate(order.orderDate)}</Typography>
        </div>
        <div className='form-group mt-3'>
          <label className='form-label'>Thông tin người mua</label>
          <Typography>Tên: {customer.userName}</Typography>
          <Typography>Số điện thoại: {customer.phone}</Typography>
          <Typography>Địa chỉ: {customer.address}</Typography>
        </div>
        <div className='form-group mt-3'>
          <label className='form-label'>Thông tin người nhận</label>
          <Typography>Tên: {order.recipientName}</Typography>
          <Typography>Số điện thoại: {order.recipientPhone}</Typography>
          <Typography>Địa chỉ: {order.recipientAddress}</Typography>
        </div>
        <div className='form-group mt-3'>
          <label className='form-label items-center'>Trạng thái: </label>
          <OrderStatusBadge orderId={order.orderId} />
        </div>
      </div>
    </Modal>
  );
}

export default OrderDetails;
