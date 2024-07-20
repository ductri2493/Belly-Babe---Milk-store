import { Form, Input, Modal, Select, Space } from 'antd';
import { useEffect, useMemo, useCallback } from 'react';

const initialAccount = {
  userName: '',
  phoneNumber: '',
  password: '',
  email: '',
  address: '',
  fullName: '',
  roleId: 0,
};

const roles = [
  { label: 'Quản trị viên', value: 1 },
  { label: 'Nhân viên', value: 2 },
];

export default function AccountModal({
  mode,
  form,
  open,
  onOk,
  onCancel,
  onFinish,
  initialValue,
}) {
  useEffect(() => {
    if (!onOk) {
      form.resetFields();
    }
  }, [form, onOk]);

  const handleOk = useCallback(() => {
    if (onOk) {
      onOk();
    }
  }, [onOk]);

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  const handleOnFinish = useCallback(
    (values) => {
      if (onFinish) {
        onFinish(values);
      }
    },
    [onFinish],
  );

  const modalTitle = useMemo(
    () => (mode === 'user' ? 'Tạo mới tài khoản' : 'Chỉnh sửa tài khoản'),
    [mode],
  );

  return (
    <Modal
      onOk={handleOk}
      onCancel={handleCancel}
      centered
      title={modalTitle}
      open={open}
    >
      <Form
        form={form}
        onFinish={handleOnFinish}
        layout='vertical'
        initialValues={mode === 'user' ? initialAccount : initialValue}
      >
        {mode === 'user' ? (
          <>
            <Form.Item
              name={'fullName'}
              label={'Họ và tên'}
              rules={[{ required: true, message: 'Please enter a full name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={'email'}
              label={'Mail'}
              rules={[
                { required: true, message: 'Hãy điền vào địa chỉ E-mail!' },
                { type: 'email', message: 'The input is not valid E-mail!' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label={'Vai Trò'} name={'roleId'}>
              <Select defaultValue={'Người Dùng'} />
            </Form.Item>
          </>
        ) : (
          <>
            <Form.Item
              name={'userName'}
              label={'Tên người dùng'}
              rules={[{ required: true, message: 'Please enter a full name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={'password'}
              label={'Mật Khẩu'}
              initialValue={'123@123a'}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={'Họ và tên'}
              name={'fullName'}
              initialValue={''}
              rules={[
                {
                  required: true,
                  message: 'Please enter a full name',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={'email'}
              label={'Mail'}
              initialValue={''}
              rules={[
                { required: true, message: 'Hãy điền vào địa chỉ E-mail!' },
                { type: 'email', message: 'The input is not valid E-mail!' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={'phoneNumber'}
              label={'Số điện thoại'}
              initialValue={''}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập vào số điện thoại!',
                },
                {
                  whitespace: true,
                  message: 'Vui lòng không để trống số điện thoại!',
                },
                {
                  max: 13,
                  message: 'Vui lòng không nhập quá 10 số!',
                },
                {
                  pattern: new RegExp(
                    /((^(\+84|84|0|0084){1})(3|5|7|8|9))+([0-9]{8})$/,
                  ),
                  message: 'Vui lòng nhập vào ô là Số Điện Thoại!',
                },
              ]}
              validateFirst
            >
              <Space.Compact>
                <Input
                  style={{
                    width: '20%',
                  }}
                  defaultValue='+84'
                />
                <Input
                  style={{
                    width: '80%',
                  }}
                />
              </Space.Compact>
            </Form.Item>
            <Form.Item
              label={'Địa chỉ'}
              name={'address'}
              initialValue={''}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập vào địa chỉ!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item label={'Vai trò'} name={'roleId'}>
              <Select options={roles} defaultValue={"Nhân viên"} allowClear disabled/>
            </Form.Item>
            {/* <Form.Item label={'Avatar'}>
              <Upload />
            </Form.Item> */}
          </>
        )}
      </Form>
    </Modal>
  );
}
