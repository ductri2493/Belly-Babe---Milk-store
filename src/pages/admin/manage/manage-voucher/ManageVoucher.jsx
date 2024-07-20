import { useEffect, useMemo, useState, useCallback } from 'react';
import Layout from '../Layout';
import { Button, Dropdown } from 'antd';
import VoucherModal from '../../../../components/admin/VoucherModal';
import { useForm } from 'antd/es/form/Form';
import EditVoucher from '../../../../components/admin/EditVoucher';
import { VoucherAPI } from '../../../../services/voucher';
import { toast, ToastContainer } from 'react-toastify';
import { DownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import VoucherDetails from '../../../../components/admin/details/VoucherDetails';

dayjs.locale('vi-VN');

export default function ManageVoucher() {
  const [vouchers, setVouchers] = useState([]);
  const [voucherId, setVoucherId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedBlogs, setSelectedBlogs] = useState([]);
  const [selectedBlogEdit, setSelectedBlogEdit] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [form] = useForm();
  const [editForm] = useForm();
  const [date, setDate] = useState(new Date());

  const status = {
    pending: 'Not activated',
    active: 'Active',
    expired: 'Expired',
  };

  const fetchVouchers = useCallback(async () => {
    try {
      const response = await VoucherAPI.fetchVouchers();
      setVouchers(response.$values);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchVouchers();
  }, [isUpdate, fetchVouchers]);

  const getStatusVoucherBadge = (status) => {
    const statusClasses = {
      'Not activated': 'badge bg-label-warning me-1',
      Active: 'badge bg-label-success me-1',
      Expired: 'badge bg-label-danger me-1',
    };
    return statusClasses[status] || '';
  };

  const columns = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'voucherId',
        key: 'voucherId',
        width: 100,
      },
      {
        title: 'Voucher Name',
        dataIndex: 'voucherName',
        key: 'voucherName',
        width: 200,
      },
      {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
        width: 100,
      },
      {
        title: 'Expiration Date',
        dataIndex: 'expiredDate',
        key: 'expiredDate',
        width: 150,
        render: (expiredDate) => dayjs(expiredDate).format('DD/MM/YYYY'),
      },
      {
        title: 'Status',
        dataIndex: 'expiredDate',
        width: 150,
        render: (expiredDate) => {
          const isExpired = dayjs(expiredDate).isBefore(date);
          return (
            <div className='-ml-4'>
              <span
                className={getStatusVoucherBadge(
                  isExpired ? status.expired : status.active,
                )}
              >
                {isExpired ? status.expired : status.active}
              </span>
            </div>
          );
        },
      },
      {
        title: 'Actions',
        dataIndex: 'voucherId',
        key: 'voucherId',
        width: 150,
        render: (voucherId) => (
          <Dropdown
            menu={{
              items: [
                {
                  title: 'Edit',
                  label: 'Edit',
                  icon: <i className='bx bx-edit me-2' />,
                  onClick: () => {
                    const voucher = vouchers.find(
                      (v) => v.voucherId === voucherId,
                    );
                    handleOpenEdit(voucher);
                  },
                },
                {
                  title: 'Delete',
                  label: 'Delete',
                  icon: <i className='bx bx-trash me-2' />,
                  onClick: () => handleDeleteVoucher(voucherId),
                },
              ],
            }}
          >
            <Button className='dropdown-toggle hide-arrow btn-outline-secondary'>
              <DownOutlined />
            </Button>
          </Dropdown>
        ),
      },
    ],
    [date, status, vouchers],
  );

  const handleDeleteVoucher = async (voucherId) => {
    try {
      const response = await VoucherAPI.deleteVoucher(voucherId);
      if (response.status === 200) {
        toast.success('Deleted successfully!');
        setVouchers(vouchers.filter((item) => item.voucherId !== voucherId));
        setIsUpdate((prev) => !prev);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = (values) => {
    return values.filter((value) =>
      ['voucherId', 'voucherName', 'quantity', 'expiredDate', 'status'].some(
        (param) =>
          value[param]
            ?.toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      ),
    );
  };

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return vouchers.slice(start, start + pageSize);
  }, [currentPage, pageSize, vouchers]);

  const filteredData = handleSearch(currentData);

  const handleDelete = async () => {
    if (!selectedBlogs.length) return;
    try {
      const itemIds = selectedBlogs.map(
        (id) => vouchers.find((voucher) => voucher?.id === id)?.id,
      );
      await Promise.all(itemIds.map(VoucherAPI.deleteVoucher));
      toast.success('Deleted successfully!');
      setVouchers(vouchers.filter((item) => !itemIds.includes(item.id)));
      setIsUpdate((prev) => !prev);
    } catch (error) {
      console.error('Failed to delete items', error);
    }
  };

  const handleOpenModal = () => setIsOpen(true);
  const handleCancelModal = () => setIsOpen(false);
  const handleCancelEditModal = () => setIsEditOpen(false);
  const handlePageChange = (page) => setCurrentPage(page);
  const handleChangeChecked = (event) => {
    const checkedProductId = event.target.value;
    setSelectedBlogs((prev) =>
      event.target.checked
        ? [...prev, checkedProductId]
        : prev.filter((id) => id !== checkedProductId),
    );
  };

  const handleOpenEdit = (voucher) => {
    setIsEditOpen(true);
    setSelectedBlogEdit(voucher);
  };

  const handleOk = () => {
    form.submit();
    handleCancelModal();
  };

  const handleEditOk = () => {
    editForm.submit();
    handleCancelEditModal();
  };

  const handleVoucherDetailsCancel = () => {
    setIsDetailOpen(false);
    setVoucherId(null);
  };

  return (
    <>
      <Layout
        name='Vouchers'
        data={vouchers}
        currentPage={currentPage}
        deleteMultiple={handleDelete}
        handleOpenModal={handleOpenModal}
        handlePageChange={handlePageChange}
        handleSearch={handleSearch}
        handleRefresh={() => setIsUpdate((prev) => !prev)}
        pageSize={pageSize}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        columns={columns}
        dataSource={filteredData}
        rowKey='voucherId'
        rowSelection={{
          selectedBlogs,
          setSelectedBlogs,
          handleChangeChecked,
        }}
      />

      {isOpen && (
        <VoucherModal
          open={isOpen}
          form={form}
          onCancel={handleCancelModal}
          onOk={handleOk}
          setIsUpdate={() => setIsUpdate((prev) => !prev)}
        />
      )}
      {isEditOpen && selectedBlogEdit && (
        <EditVoucher
          open={isEditOpen}
          form={editForm}
          onCancel={handleCancelEditModal}
          onOk={handleEditOk}
          voucher={selectedBlogEdit}
          setIsUpdate={setIsUpdate}
        />
      )}
      <VoucherDetails
        handleVoucherDetailsCancel={handleVoucherDetailsCancel}
        handleVoucherDetailsOk={handleVoucherDetailsCancel}
        isDetailOpen={isDetailOpen}
        voucherId={voucherId}
      />
      <ToastContainer />
    </>
  );
}
