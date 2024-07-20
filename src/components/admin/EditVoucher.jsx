import { DatePicker, Form, Input, InputNumber, Modal, Select } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { VoucherAPI } from '../../services/voucher';
import { toast } from 'react-toastify';
import UserAPI from '../../services/account/User';
import dayjs from 'dayjs';

export default function EditVoucher({
  open,
  voucher,
  onCancel,
  onOk,
  form,
  setIsUpdate,
}) {
  const [currentVoucher, setCurrentVoucher] = useState({});
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    setCurrentVoucher({ ...voucher, expiredDate: dayjs(voucher.expiredDate) });
  }, [voucher]);

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

  const fetchUserList = async () => {
    try {
      const userList = await UserAPI.fetchAccounts();
      if (userList) {
        setUserList(
          userList.$values.map((user) => ({
            label: user.fullName,
            value: user.userId,
          })),
        );
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error fetching user list');
    }
  };

  const handleFinish = async (values) => {
    try {
      await VoucherAPI.updateVoucher(voucher.voucherId, values).then(() => {
        form.resetFields();
        onCancel();
        setIsUpdate((prevState) => !prevState);
        toast.success('Voucher updated successfully!');
      });
    } catch (error) {
      toast.error('An error occurred while updating the voucher!');
      console.error(error);
    }
  };

  const handleChange = (value, field) => {
    setCurrentVoucher((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  useEffect(() => {
    fetchUserList();
    if (form && currentVoucher) {
      form.setFieldsValue(currentVoucher);
    }
  }, [currentVoucher, form, voucher]);

  return (
    <Modal
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      title='Edit Voucher'
    >
      <Form onFinish={handleFinish} form={form} initialValues={currentVoucher}>
        <Form.Item
          label='Voucher Code'
          name='voucherCode'
          rules={[
            {
              required: true,
              message: 'Please enter the voucher code',
            },
          ]}
        >
          <Input
            onChange={(e) => handleChange(e.target.value, 'voucherCode')}
          />
        </Form.Item>
        <Form.Item
          label='Voucher Name'
          name='voucherName'
          rules={[
            {
              required: true,
              message: 'Please enter the voucher name',
            },
          ]}
        >
          <Input
            onChange={(e) => handleChange(e.target.value, 'voucherName')}
          />
        </Form.Item>
        <Form.Item
          label='Quantity'
          name='quantity'
          rules={[
            {
              required: true,
              message: 'Please enter the quantity',
            },
            () => ({
              validator(_, value) {
                if (value < 0) {
                  return Promise.reject(
                    new Error('Quantity cannot be less than 0!'),
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <InputNumber
            min={0}
            onChange={(value) => handleChange(value, 'quantity')}
          />
        </Form.Item>
        <Form.Item
          label='Expiration Date'
          name='expiredDate'
          rules={[
            { required: true, message: 'Please enter the expiration date!' },
            () => ({
              validator(_, value) {
                if (!value || dayjs(value).isAfter(dayjs())) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Expiration date must be in the future!'),
                );
              },
            }),
          ]}
        >
          <DatePicker
            showTime
            onChange={(value) => handleChange(dayjs(value), 'expiredDate')}
          />
        </Form.Item>
        <Form.Item label='User List' name='userList'>
          <Select
            mode='multiple'
            allowClear
            style={{ width: '100%' }}
            placeholder='Select users'
            options={userList}
            onChange={(value) => handleChange(value, 'userList')}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
