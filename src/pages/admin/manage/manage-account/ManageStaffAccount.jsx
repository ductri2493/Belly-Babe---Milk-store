/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useForm } from 'antd/es/form/Form';
import { toast, ToastContainer } from 'react-toastify';
import AccountModal from '../../../../components/admin/AccountModal';
import EditAccount from '../../../../components/admin/EditAccount';
import UserAPI from '../../../../services/account/User';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout';
import StaffDetails from '../../../../components/admin/details/StaffDetails';
import { Button, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const ManageStaffAccount = () => {
  const { userInfo: currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      if (currentUser.roleId === 2) {
        toast.error('Bạn không có quyền truy cập vào trang này');
        navigate('/admin/dashboard');
      } else if (currentUser.roleId === 3) {
        navigate('/login-admin');
      }
    } else {
      navigate('/login-admin');
    }
  }, [currentUser, navigate]);

  const [dropdownItemIndex, setDropdownItemIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [staffs, setStaffs] = useState([]);
  const [staff, setStaff] = useState(null);
  const [selectedStaffId, setSelectedStaffId] = useState([]);
  const [selectedStaffEdit, setSelectedStaffEdit] = useState(null);
  const [editing, setEditing] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [form] = useForm();
  const [editForm] = useForm();
  const [openDetailModal, setOpenDetailModal] = useState(false);

  const searchParameters = useMemo(
    () => ['fullName', 'email', 'phoneNumber', 'userName'],
    [],
  );
  const role = useMemo(
    () => ({ 1: 'Admin', 2: 'Nhân Viên', 3: 'Khách Hàng' }),
    [],
  );
  const getRoleBadge = (roleId) => {
    const roleClasses = {
      1: 'badge bg-label-danger me-1',
      2: 'badge bg-label-info me-1',
      3: 'badge bg-label-success me-1',
    };
    return roleClasses[roleId] || '';
  };
  const columns = useMemo(() => {
    return [
      { title: 'Id', dataIndex: 'userId', key: 'userId' },
      { title: 'Tên người dùng', dataIndex: 'userName', key: 'userName' },
      { title: 'Email', dataIndex: 'email', key: 'email' },
      {
        title: 'Chi tiết',
        dataIndex: 'userId',
        key: 'userId',
        render: (userId) => {
          return (
            <Button
              className='btn-outline-info'
              onClick={() =>
                handleOpenDetail(
                  staffs.find((staff) => staff.userId === userId),
                )
              }
            >
              Chi tiết
            </Button>
          );
        },
      },
      {
        title: 'Vai trò',
        dataIndex: 'roleId',
        key: 'roleId',
        render: (roleId) => {
          return <span className={getRoleBadge(roleId)}>{role[roleId]}</span>;
        },
      },
      {
        title: 'Thao tác',
        dataIndex: 'userId',
        key: 'userId',
        render: (userId) => {
          return (
            <Dropdown
              menu={{
                items: [
                  {
                    title: 'Sửa',
                    label: 'Chỉnh Sửa',
                    icon: <i className='bx bx-edit me-2' />,
                    onClick: () =>
                      handleOpenEdit(staffs.find((s) => s.userId === userId)),
                  },
                  {
                    title: 'Xóa',
                    label: 'Xóa',
                    icon: <i className='bx bx-trash me-2' />,
                    onClick: async () => {
                      await UserAPI.deleteAccount(userId).then((response) => {
                        if (response.status === 200) {
                          toast.success(response.message);
                          setIsUpdate((prev) => !prev);
                        } else if (response.status === 400) {
                          toast.error(response.message);
                        }
                      });
                    },
                  },
                ],
              }}
            >
              <Button className='dropdown-toggle hide-arrow btn-outline-secondary'>
                <DownOutlined />
              </Button>
            </Dropdown>
          );
        },
      },
    ];
  }, [role, staffs]);

  const handleFetchingData = useCallback(async () => {
    try {
      const response = await UserAPI.fetchAccounts();
      if (response.$values) {
        const filteredStaffs = response.$values
          .filter((user) => user.roleId !== 3)
          .sort((u1, u2) => u1.roleId - u2.roleId);
        setStaffs(filteredStaffs);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    handleFetchingData();
  }, [handleFetchingData, isUpdate]);

  const handleSearch = (values) => {
    try {
      // console.log(values);
      return values.filter((value) => {
        // console.log(value);
        return searchParameters.some((parameters) => {
          // console.log(parameter);
          return value[parameters]
            ? value[parameters]
                ?.toString()
                ?.toLowerCase()
                ?.includes(searchQuery.toLowerCase())
            : false;
        });
      });
    } catch (error) {
      console.error('Search error: ', error);
      return [];
    }
  };

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return staffs.slice(start, end);
  }, [currentPage, pageSize, staffs]);

  const dataSearch = handleSearch(currentData);

  const handleOpenEdit = (user) => {
    setSelectedStaffEdit(user);
    setEditing(true);
  };

  const handleDelete = async () => {
    if (!selectedStaffId.length) return;
    try {
      const staffIds = selectedStaffId.map((id) => id);
      await Promise.all(
        staffIds.map((id) =>
          UserAPI.deleteAccount(id).then((response) => {
            if (response.status === 200) {
              toast.success(response.message);
            } else if (response.status === 400) {
              toast.error(response.message);
            }
          }),
        ),
      );
      setIsUpdate(!isUpdate);
    } catch (error) {
      console.error('Failed to delete items', error);
    }
  };

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleRefetching = () => {
    setIsUpdate((prev) => !prev);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleChangeChecked = (event) => {
    const checkedProductId = event.target.value;
    setSelectedStaffId((prev) =>
      event.target.checked
        ? [...prev, checkedProductId]
        : prev.filter((id) => id !== checkedProductId),
    );
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    form.resetFields();
    setIsOpen(false);
  };

  const handleFinish = async (values) => {
    try {
      await UserAPI.createAccount(values);
      toast.success('Tạo tài khoản thành công');
      setIsUpdate((prev) => !prev);
      handleCancel();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditOk = () => {
    editForm.submit();
    setEditing(false);
    setIsUpdate((prev) => !prev);
  };

  const handleOpenDetail = (staff) => {
    setOpenDetailModal(true);
    setStaff(staff);
  };

  const handleCancelDetail = () => {
    setOpenDetailModal(false);
    setStaff(null);
  };

  const handleOkDetail = () => {
    setOpenDetailModal(false);
    setStaff(null);
  };

  return (
    <>
      <Layout
        name={'Nhân viên'}
        columns={columns}
        currentPage={currentPage}
        dataSource={dataSearch}
        data={staffs}
        deleteMultiple={handleDelete}
        handleOpenModal={handleOpenModal}
        handleOpenEdit={handleOpenEdit}
        handlePageChange={handlePageChange}
        handleRefresh={null}
        handleSearch={handleSearch}
        pageSize={pageSize}
        searchQuery={searchQuery}
        rowKey={'userId'}
        setSearchQuery={setSearchQuery}
        rowSelection={{
          selectedStaffId,
          setSelectedStaffId,
        }}
        onRow={null}
      />
      {isOpen && (
        <AccountModal
          open={isOpen}
          form={form}
          mode={'staff'}
          onCancel={handleCancel}
          onFinish={handleFinish}
          onOk={handleOk}
        />
      )}
      {editing && selectedStaffEdit && (
        <EditAccount
          mode={'staff'}
          account={selectedStaffEdit}
          setSelectedAccount={setSelectedStaffEdit}
          form={editForm}
          isOk={handleEditOk}
          isOpen={editing}
          isUpdate={handleRefetching}
          setIsOpen={setEditing}
        />
      )}
      <StaffDetails
        handleCancelDetail={handleCancelDetail}
        handleOkDetail={handleOkDetail}
        openDetailModal={openDetailModal}
        staff={staff}
      />

      <ToastContainer />
    </>
  );
};

export default ManageStaffAccount;
