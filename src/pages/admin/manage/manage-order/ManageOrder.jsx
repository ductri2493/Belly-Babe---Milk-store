/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from 'react';
import Layout from '../Layout';
import { Button, Typography } from 'antd';
import OrderAPI from '../../../../services/order/order';
import { toast, ToastContainer } from 'react-toastify';
import UserAPI from '../../../../services/account/User';
import CustomNumberFormat from '../../../../utils/CustomNumberFormat';
import OrderStatusAPI from '../../../../services/order/order.status';
import OrderDetails from '../../../../components/admin/details/OrderDetails';
import ConfirmationButton from '../../../../components/admin/buttons/ConfirmationButton';
import { formatDate } from '../../../../utils/utils';

const statusOrderFrame = [
  'Tất cả',
  'Chờ xác nhận',
  'Đã xác nhận',
  'Đang giao hàng',
  'Đã giao hàng',
  'Đã hủy',
];

export default function ManageOrder() {
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orderIdSelected, setOrderIdSelected] = useState(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [status, setStatus] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [statusFrame, setStatusFrame] = useState('Tất cả');

  const fetchInitialData = async () => {
    try {
      const [ordersResponse, customersResponse, statusResponse] =
        await Promise.all([
          OrderAPI.getAllOrders(),
          UserAPI.fetchAccounts(),
          OrderStatusAPI.getAllOrderStatuses(),
        ]);

      if (ordersResponse) setOrders(ordersResponse.$values);
      if (customersResponse) {
        setCustomers(
          customersResponse.$values.filter((customer) => customer.roleId === 3),
        );
      }
      if (statusResponse) setStatus(statusResponse.$values);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchInitialData();
  }, [isUpdate]);

  useEffect(() => {
    const customerIds = customers.map((customer) => customer.userId);
    setFilteredData(
      orders.filter((order) => customerIds.includes(order.userId)),
    );
  }, [customers, orders]);

  const handleSearch = (values) =>
    values.filter((value) =>
      ['orderId', 'statusName', 'totalPrice', 'userName'].some((key) =>
        value[key]
          ?.toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      ),
    );

  const handleDelete = async () => {
    if (!selectedOrderIds.length) return;

    try {
      await Promise.all(
        selectedOrderIds.map((orderId) => OrderAPI.deleteAPI(orderId)),
      );
      toast.success('Deleted successfully');
      setIsUpdate((prev) => !prev);
      setOrders((prev) =>
        prev.filter((item) => !selectedOrderIds.includes(item.orderId)),
      );
    } catch (error) {
      console.error('Failed to delete items', error);
    }
  };

  const handleOnClickDetailModal = (orderId) => {
    setDetailModal(true);
    setOrderIdSelected(orderId);
  };

  const handleOnCancelDetail = () => {
    setDetailModal(false);
    setOrderIdSelected(null);
  };

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [currentPage, pageSize, filteredData]);

  const dataSearch = handleSearch(currentData);

  const getOrderStatusBadge = (statusName) => {
    switch (statusName) {
      case 'Chờ xác nhận':
        return 'badge bg-label-warning';
      case 'Đã xác nhận':
        return 'badge bg-label-info';
      case 'Đang giao hàng':
        return 'badge bg-label-primary';
      case 'Đã giao hàng':
        return 'badge bg-label-success';
      case 'Đã hủy':
        return 'badge bg-label-danger';
      default:
        return '';
    }
  };

  const handleFilterStatusChange = async (statusName) => {
    setStatusFrame(statusName);
    try {
      const ordersResponse = await OrderAPI.getAllOrders();
      if (ordersResponse) {
        const fetchedOrders = ordersResponse.$values;
        const customerIds = customers.map((customer) => customer.userId);
        if (statusName === 'Tất cả') {
          setFilteredData(
            fetchedOrders.filter((order) => customerIds.includes(order.userId)),
          );
        } else {
          const _statusName = status.find(
            (item) => item.statusName === statusName,
          )?.statusName;

          const filteredOrders = await Promise.all(
            fetchedOrders.map(async (order) => {
              if (customerIds.includes(order.userId)) {
                const statusNameLatest = await OrderAPI.getLatestOrderStatus(
                  order.orderId,
                );
                return _statusName === statusNameLatest?.statusName
                  ? order
                  : null;
              }
              return null;
            }),
          );

          setFilteredData(filteredOrders.filter((order) => order !== null));
        }
      }
    } catch (error) {
      console.error('Failed to fetch orders', error);
    }
  };

  const filterStatus = useMemo(() => {
    return statusOrderFrame.map((statusName) => (
      <Button
        key={statusName}
        className={`flex btn-outline-primary ${
          statusFrame === statusName ? 'active' : ''
        }`}
        onClick={() => handleFilterStatusChange(statusName)}
      >
        {statusName}
      </Button>
    ));
  }, [statusFrame, customers, status]);

  const ConfirmStatusOrder = ({ orderId }) => {
    const [statusName, setStatusName] = useState('');
    useEffect(() => {
      const fetchStatusName = async () => {
        const statusNameLatest = await OrderAPI.getLatestOrderStatus(orderId);
        setStatusName(statusNameLatest?.statusName || '');
      };
      fetchStatusName();
    }, [orderId]);
    if (statusName === 'Chờ xác nhận') {
      return <ConfirmationButton orderId={orderId} setIsUpdate={setIsUpdate} />;
    }
  };

  const columns = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'orderId',
        key: 'orderId',
        render: (text) => <strong>{text}</strong>,
      },
      {
        title: 'Tên khách hàng',
        dataIndex: 'userId',
        key: 'userId',
        render: (userId) => {
          const customerData = customers.find(
            (customer) => customer.userId === userId,
          );
          return customerData ? customerData.userName : '';
        },
      },
      {
        title: 'Trạng thái',
        dataIndex: 'orderId',
        render: (orderId) => <OrderStatusBadge orderId={orderId} />,
      },
      {
        title: 'Tổng thanh toán',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
        render: (totalPrice) => <CustomNumberFormat numStr={totalPrice} />,
      },
      {
        title: 'Ngày đặt hàng',
        dataIndex: 'orderDate',
        key: 'orderDate',
        render: (orderDate) => <span>{formatDate(orderDate)}</span>,
      },
      {
        title: 'Chi tiết',
        dataIndex: 'orderId',
        render: (orderId) => (
          <Button
            className='btn btn-outline-info flex items-center -ml-3'
            onClick={() => handleOnClickDetailModal(orderId)}
          >
            Xem chi tiết
          </Button>
        ),
      },
      {
        title: 'Thao tác',
        dataIndex: 'orderId',
        render: (orderId) => {
          return <ConfirmStatusOrder orderId={orderId} />;
        },
      },
    ],
    [customers],
  );

  const OrderStatusBadge = ({ orderId }) => {
    const [statusName, setStatusName] = useState('');

    useEffect(() => {
      const fetchStatusName = async () => {
        const statusNameLatest = await OrderAPI.getLatestOrderStatus(orderId);
        setStatusName(statusNameLatest?.statusName || '');
      };

      fetchStatusName();
    }, [orderId]);

    return (
      <Typography className={getOrderStatusBadge(statusName)}>
        {statusName}
      </Typography>
    );
  };

  return (
    <>
      <Layout
        name='Đơn hàng'
        currentPage={currentPage}
        data={filteredData}
        deleteMultiple={handleDelete}
        handleOpenModal={() => setIsOpenModal(true)}
        handlePageChange={setCurrentPage}
        handleRefresh={() => setIsUpdate((prev) => !prev)}
        pageSize={pageSize}
        handleSearch={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isBtn={false}
        recycleBin={false}
        columns={columns}
        dataSource={dataSearch}
        onRow={null}
        rowKey='orderId'
        rowSelection={{
          selectedRowKeys: selectedOrderIds,
          onChange: setSelectedOrderIds,
        }}
        newBtnHeader={filterStatus}
      />
      <OrderDetails
        detailModal={detailModal}
        orderId={orderIdSelected}
        handleOnCancelDetail={handleOnCancelDetail}
        handleOnOkDetail={handleOnCancelDetail}
      />
      <ToastContainer />
    </>
  );
}
