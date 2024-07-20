import { useEffect, useMemo, useState, useCallback } from 'react';
import Layout from '../Layout';
import { Button } from 'antd';
import { ToastContainer } from 'react-toastify';
import UserAPI from '../../../../services/account/User';
import preOrderAPI from '../../../../services/order/preOrder';
import { formatDate } from '../../../../utils/utils';
import PreOrderDetails from '../../../../components/admin/details/PreOrderDetails';
import SendNotificationPreOrderButton from '../../../../components/admin/buttons/SendNotificationPreOrderButton';

const preOrderFrames = ['Tất cả', 'Chưa gửi thông báo', 'Đã gửi thông báo'];

export default function ManagePreOrder() {
  const [searchQuery, setSearchQuery] = useState('');
  const [preOrders, setPreOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [preOrder, setPreOrder] = useState({});
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [detailModal, setDetailModal] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [preOrderFrame, setPreOrderFrame] = useState('Tất cả');

  const fetchPreOrders = useCallback(async () => {
    try {
      const _orders = await preOrderAPI.fetchPreOrders();
      if (_orders) setPreOrders(_orders.$values);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchCustomers = useCallback(async () => {
    try {
      const customers = await UserAPI.fetchAccounts();
      if (customers) {
        const _customers = customers.$values.filter(
          (customer) => customer.roleId === 3,
        );
        setCustomers(_customers);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchPreOrders();
    fetchCustomers();
  }, [isUpdate, fetchPreOrders, fetchCustomers]);

  useEffect(() => {
    const customerIds = customers.map((customer) => customer.userId);
    setFilteredData(
      preOrders.filter((preOrder) => customerIds.includes(preOrder.userId)),
    );
  }, [customers, preOrders]);

  const NotificationSent = ({ notificationSent, customer, preOrder }) => {
    if (!notificationSent) {
      return (
        <SendNotificationPreOrderButton
          customer={customer}
          preOrder={preOrder}
          setIsUpdate={setIsUpdate}
        />
      );
    }
    return null;
  };

  const columns = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'preOrderId',
        key: 'preOrderId',
      },
      {
        title: 'Khách hàng',
        dataIndex: 'userId',
        key: 'userId',
        render: (userId) => {
          const customer = customers.find(
            (customer) => customer.userId === userId,
          );
          return <span>{customer?.fullName}</span>;
        },
      },
      {
        title: 'Ngày đặt hàng',
        dataIndex: 'preOrderDate',
        key: 'preOrderDate',
        render: (preOrderDate) => <span>{formatDate(preOrderDate)}</span>,
      },
      {
        title: 'Thông báo',
        dataIndex: 'notificationSent',
        key: 'notificationSent',
        render: (notificationSent) =>
          notificationSent ? (
            <span className='text-success'>Đã gửi thông báo</span>
          ) : (
            <span className='text-danger'>Chưa gửi thông báo</span>
          ),
      },
      {
        title: 'Chi Tiết',
        dataIndex: 'preOrderId',
        key: 'preOrderId',
        render: (preOrderId) => (
          <Button
            className='btn btn-outline-info flex items-center -ml-3'
            onClick={() =>
              handleOnClickDetailModal(
                preOrders.find((order) => order.preOrderId === preOrderId),
              )
            }
          >
            Chi Tiết
          </Button>
        ),
      },
      {
        title: 'Thao tác',
        dataIndex: 'preOrderId',
        key: 'preOrderId',
        render: (preOrderId) => {
          const preOrder = preOrders.find(
            (order) => order.preOrderId === preOrderId,
          );
          const customer = customers.find(
            (customer) => customer.userId === preOrder.userId,
          );
          return (
            <NotificationSent
              notificationSent={preOrder.notificationSent}
              customer={customer}
              preOrder={preOrder}
            />
          );
        },
      },
    ],
    [customers, preOrders],
  );

  const handleFilterPreOrdersChange = useCallback(
    (frame) => {
      setPreOrderFrame(frame);
      const customerIds = customers.map((customer) => customer.userId);
      const filtered = preOrders.filter((preOrder) => {
        const matchFrame =
          frame === 'Tất cả' ||
          (frame === 'Đã gửi thông báo' && preOrder.notificationSent) ||
          (frame === 'Chưa gửi thông báo' && !preOrder.notificationSent);
        return matchFrame && customerIds.includes(preOrder.userId);
      });
      setFilteredData(filtered);
    },
    [preOrders, customers],
  );

  const filterPreOrderButtons = useMemo(
    () =>
      preOrderFrames.map((frame) => (
        <Button
          key={frame}
          className={`flex btn-outline-primary ${
            preOrderFrame === frame ? 'active' : ''
          }`}
          onClick={() => handleFilterPreOrdersChange(frame)}
        >
          {frame}
        </Button>
      )),
    [preOrderFrame, handleFilterPreOrdersChange],
  );

  const handleSearch = useCallback(
    (values) => {
      return values.filter((value) =>
        ['preOrderId', 'productName', 'phoneNumber', 'email'].some((key) =>
          value[key]
            ? value[key]
                .toString()
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            : false,
        ),
      );
    },
    [searchQuery],
  );

  const handlePageChange = useCallback((page) => setCurrentPage(page), []);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [currentPage, pageSize, filteredData]);

  const dataSearch = handleSearch(currentData);

  const handleRefresh = useCallback(() => setIsUpdate((prev) => !prev), []);

  const handleOnClickDetailModal = useCallback((order) => {
    setDetailModal(true);
    setPreOrder(order);
  }, []);

  const handleOnCancelDetail = useCallback(() => {
    setDetailModal(false);
    setPreOrder({});
  }, []);

  const handleOnOkDetail = useCallback(() => {
    setDetailModal(false);
    setPreOrder({});
  }, []);

  return (
    <>
      <Layout
        name={'Đơn đặt hàng'}
        currentPage={currentPage}
        data={preOrders}
        handleOpenModal={null}
        handlePageChange={handlePageChange}
        handleRefresh={handleRefresh}
        pageSize={pageSize}
        handleSearch={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isBtn={false}
        columns={columns}
        dataSource={dataSearch}
        recycleBin={false}
        onRow={null}
        rowKey={'preOrderId'}
        rowSelection={{ selectedOrderIds, setSelectedOrderIds }}
        newBtnHeader={filterPreOrderButtons}
      />
      <PreOrderDetails
        detailModal={detailModal}
        handleOnCancelDetail={handleOnCancelDetail}
        handleOnOkDetail={handleOnOkDetail}
      />
      <ToastContainer />
    </>
  );
}
