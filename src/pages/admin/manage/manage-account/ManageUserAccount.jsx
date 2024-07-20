/* eslint-disable no-unused-vars */
import { Button } from 'antd';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useForm } from 'antd/es/form/Form';
import { toast, ToastContainer } from 'react-toastify';
import UserAPI from '../../../../services/account/User';
import Layout from '../Layout';
import AccountModal from '../../../../components/admin/AccountModal';
import EditAccount from '../../../../components/admin/EditAccount';
import UserDetail from '../../../../components/admin/details/UserDetails';

const ManageCustomerAccount = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState([]);
  const [user, setUser] = useState({});
  const [selectedUserEdit, setSelectedUserEdit] = useState(null);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [editing, setEditing] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [form] = useForm();
  const [editForm] = useForm();

  const searchParameters = useMemo(
    () => ['fullName', 'mail', 'phoneNumber', 'userName'],
    [],
  );
  const role = useMemo(
    () => ({ 1: 'Admin', 2: 'Nhân Viên', 3: 'Khách Hàng' }),
    [],
  );

  const handleFetchingData = useCallback(async () => {
    try {
      const { $values } = await UserAPI.fetchAccounts();
      if ($values) {
        const customerAccounts = $values.filter((user) => user.roleId === 3);
        setCustomers(customerAccounts);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    handleFetchingData();
  }, [handleFetchingData, isUpdate]);

  const getRoleBadge = (roleId) => {
    const roleClasses = {
      1: 'badge bg-label-danger me-1',
      2: 'badge bg-label-info me-1',
      3: 'badge bg-label-success me-1',
    };
    return roleClasses[roleId] || '';
  };

  const columns = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'userId',
        key: 'userId',
        render: (userId) => <strong>{userId}</strong>,
      },
      { title: 'Tên người dùng', dataIndex: 'userName', key: 'userName' },
      { title: 'Email', dataIndex: 'email', key: 'email' },
      {
        title: 'Chi Tiết',
        dataIndex: 'userId',
        key: 'userId',
        render: (userId) => (
          <Button
            className='btn btn-outline-info flex items-center -ml-3'
            onClick={() => handleClickDetail(userId)}
          >
            Chi tiết
          </Button>
        ),
      },
      {
        title: 'Vai trò',
        dataIndex: 'roleId',
        key: 'roleId',
        render: (roleId) => (
          <div className='-ml-4'>
            <span className={getRoleBadge(roleId)}>{role[roleId]}</span>
          </div>
        ),
      },
      {
        title: 'Trạng Thái',
        dataIndex: 'isActive',
        key: 'isActive',
        render: (isActive) => (
          <div>
            <span
              className={
                isActive
                  ? 'badge bg-label-primary me-1'
                  : 'badge bg-label-secondary me-1'
              }
            >
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        ),
      },
    ],
    [role],
  );

  const handleOpenModal = () => setIsOpenModal(true);
  const handleOpenEdit = (user) => {
    setEditing(true);
    setSelectedUserEdit(user);
  };

  const handlePageChange = (page) => setCurrentPage(page);

  const handleSearch = (values) => {
    try {
      return values.filter((value) =>
        searchParameters.some((param) =>
          value[param]
            ?.toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
        ),
      );
    } catch (error) {
      console.error('Search error: ', error);
      return [];
    }
  };

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return customers.slice(start, start + pageSize);
  }, [currentPage, pageSize, customers]);

  const dataSearch = handleSearch(currentData);

  const handleDelete = async () => {
    if (!selectedUserIds.length) return;

    try {
      await Promise.all(selectedUserIds.map(UserAPI.deleteAccount));
      setIsUpdate((prev) => !prev);
    } catch (error) {
      console.error('Failed to delete items', error);
    }
  };

  const handleRefresh = () => setIsUpdate((prev) => !prev);

  const handleCancel = () => setIsOpenModal(false);

  const handleFinish = async (values) => {
    try {
      await UserAPI.createAccount(values);
      toast.success('Tạo tài khoản thành công');
      setIsUpdate((prev) => !prev);
      form.resetFields();
      setIsOpenModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOk = () => form.submit();
  const handleEditOk = () => {
    editForm.submit();
    setEditing(false);
    setIsUpdate((prev) => !prev);
  };

  const handleClickDetail = (userId) => {
    const userDetail = customers.find((user) => user.userId === userId);
    setOpenDetailModal(true);
    setUser(userDetail);
  };

  const handleCancelDetail = () => {
    setOpenDetailModal(false);
    setUser({});
  };

  const handleOkDetailModal = () => handleCancelDetail();

  return (
    <>
      <Layout
        name='Khách Hàng'
        data={customers}
        currentPage={currentPage}
        pageSize={pageSize}
        handleOpenModal={handleOpenModal}
        handlePageChange={handlePageChange}
        deleteMultiple={handleDelete}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleRefresh={handleRefresh}
        handleSearch={handleSearch}
        isBtn={false}
        recycleBin={false}
        columns={columns}
        dataSource={dataSearch}
        onRow={(record) => ({
          onClick: () => handleClickDetail(record.userId),
        })}
        rowKey={'userId'}
        rowSelection={{ selectedUserIds, setSelectedUserIds }}
      />
      {isOpenModal && (
        <AccountModal
          open={isOpenModal}
          form={form}
          onCancel={handleCancel}
          onFinish={handleFinish}
          onOk={handleOk}
          mode='user'
        />
      )}
      {editing && selectedUserEdit && (
        <EditAccount
          form={editForm}
          mode='user'
          account={selectedUserEdit}
          isOk={handleEditOk}
          isOpen={editing}
          isUpdate={handleRefresh}
          setIsOpen={setEditing}
          setSelectedAccount={setSelectedUserEdit}
        />
      )}
      <UserDetail
        handleCancelDetail={handleCancelDetail}
        handleOkDetailModal={handleOkDetailModal}
        openDetailModal={openDetailModal}
        role={role}
        user={user}
      />
      <ToastContainer />
    </>
  );
};

export default ManageCustomerAccount;
