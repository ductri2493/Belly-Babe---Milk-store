/* eslint-disable no-unused-vars */
import { Form, Input, Modal, Select, Upload } from 'antd';
import { useEffect, useState } from 'react';
import UserAPI from '../../services/account/User';
import { toast } from 'react-toastify';

export default function EditAccount({
  account,
  form,
  isOpen,
  setIsOpen,
  isOk,
  isUpdate,
  setSelectedAccount,
  mode,
}) {
  const [currentAccount, setCurrentAccount] = useState({
    userName: account.userName,
    phoneNumber: account.phoneNumber,
    password: account.password,
    email: account.email,
    address: account.address,
    fullName: account.fullName,
    roleId: account.roleId,
    image: account.image,
  });

  const [updateAccount, setUpdateAccount] = useState({
    userName: '',
    phoneNumber: '',
    password: '',
    email: '',
    address: '',
    fullName: '',
    roleId: 0,
    image: '',
  });

  const handleChange = (value, field) => {
    setUpdateAccount((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleIsCancel = () => {
    if (setIsOpen) {
      setIsOpen(false);
    }
    if (setSelectedAccount) {
      setSelectedAccount(null);
    }
  };

  const handleIsOk = () => {
    if (isOk) {
      isOk();
    }
    if (setIsOpen) {
      setIsOpen(false);
    }
    if (setSelectedAccount) {
      setSelectedAccount(null);
    }
  };

  const handleSubmitAndRedirect = async (values) => {
    try {
      // console.log(values);
      if (mode === 'user') {
        console.log(values);
        const finalValues = { ...values, values };
        await UserAPI.updateAccount(account.userId, finalValues).then(() => {
          toast.success('Cập nhật tài khoản thành công!');
          if (setIsOpen) {
            setIsOpen(false);
          }
        });
      } else if (mode === 'staff') {
        await UserAPI.updateAccount(account.userId, values).then(() => {
          toast.success('Cập nhật tài khoản thành công!');
          if (setIsOpen) {
            setIsOpen(false);
          }
        });
      }

      if (isUpdate) {
        isUpdate();
      }
    } catch (error) {
      console.error(error.response.data);
    }
  };

  useEffect(() => {
    if (form && account) {
      form.setFieldsValue(account);
    }
  }, [form, account]);

  // console.log(account);

  return (
    <>
      <Modal
        onOk={handleIsOk}
        onCancel={handleIsCancel}
        centered
        title={'Chỉnh sửa tài khoản'}
        open={isOpen}
      >
        {mode === 'user' ? (
          <Form
            form={form}
            onFinish={handleSubmitAndRedirect}
            layout='vertical'
            initialValues={currentAccount}
          >
            <Form.Item name={'userName'} label={'Tên đăng nhập'}>
              <Input onChange={(value) => handleChange(value, 'userName')} />
            </Form.Item>
            <Form.Item name={'password'} label={'Mật khẩu'}>
              <Input onChange={(value) => handleChange(value, 'password')} />
            </Form.Item>
            <Form.Item name={'fullName'} label={'Họ và tên'}>
              <Input onChange={(value) => handleChange(value, 'fullName')} />
            </Form.Item>
            <Form.Item
              name={'email'}
              label={'Mail'}
              rules={[
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
              ]}
            >
              <Input onChange={(value) => handleChange(value, 'email')} />
            </Form.Item>
            <Form.Item
              label={'Vai Trò'}
              name={'roleId'}
              initialValue={account.roleId}
            >
              <Select
                disabled
                onChange={(value) => handleChange(value, 'roleId')}
              />
            </Form.Item>
            <Form.Item
              label={'Địa chỉ'}
              name={'address'}
              initialValue={account.address}
            >
              <Input onChange={(value) => handleChange(value, 'address')} />
            </Form.Item>
            <Form.Item
              label={'Số điện thoại'}
              name={'phoneNumber'}
              initialValue={account.phoneNumber}
            >
              <Input onChange={(value) => handleChange(value, 'phoneNumber')} />
            </Form.Item>
          </Form>
        ) : (
          <Form
            form={form}
            onFinish={handleSubmitAndRedirect}
            layout='vertical'
            initialValues={{ account }}
          >
            <Form.Item name={'userName'} label={'Tên đăng nhập'}>
              <Input onChange={(value) => handleChange(value, 'userName')} />
            </Form.Item>
            <Form.Item name={'password'} label={'Mật khẩu'}>
              <Input onChange={(value) => handleChange(value, 'password')} />
            </Form.Item>
            <Form.Item name={'fullName'} label={'Họ và tên'}>
              <Input onChange={(value) => handleChange(value, 'fullName')} />
            </Form.Item>
            <Form.Item
              name={'email'}
              label={'Mail'}
              rules={[
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
              ]}
            >
              <Input onChange={(value) => handleChange(value, 'email')} />
            </Form.Item>
            <Form.Item
              label={'Vai Trò'}
              name={'roleId'}
              initialValue={account.roleId}
            >
              <Select
                disabled
                onChange={(value) => handleChange(value, 'roleId')}
              />
            </Form.Item>
            <Form.Item
              label={'Địa chỉ'}
              name={'address'}
              initialValue={account.address}
            >
              <Input onChange={(value) => handleChange(value, 'address')} />
            </Form.Item>
            <Form.Item
              label={'Số điện thoại'}
              name={'phoneNumber'}
              initialValue={account.phoneNumber}
            >
              <Input onChange={(value) => handleChange(value, 'phoneNumber')} />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
}
