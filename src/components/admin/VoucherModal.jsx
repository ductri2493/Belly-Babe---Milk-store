/* eslint-disable no-unused-vars */
import { DatePicker, Form, InputNumber, Modal, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useCallback, useEffect, useState } from 'react';
import { VoucherAPI } from '../../services/voucher';
import { toast } from 'react-toastify';
import UserAPI from '../../services/account/User';
import dayjs from 'dayjs';
import localeValues from 'antd/locale/vi_VN';

import 'dayjs/locale/vi';
dayjs.locale('vi');

export default function VoucherModal({
  form,
  onOk,
  onCancel,
  open,
  setIsUpdate,
}) {
  const [userList, setUserList] = useState([]);
  const [update, setUpdate] = useState(false);

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

  const handleOnFinish = async (values) => {
    try {
      // const finalValues = [...values.userList];
      console.log(values);
      await VoucherAPI.createVoucher(values).then(() => {
        toast.success('Tạo mã giảm giá thành công!');
        form.resetFields();
        if (onCancel) {
          onCancel();
        }
        if (setIsUpdate) {
          setIsUpdate(true);
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateVoucher = async () => {
    try {
      const voucher = await VoucherAPI.generateVoucher();
      // console.log(`voucher, ${voucher}`);
      if (voucher) {
        form.setFieldsValue({ voucherCode: voucher });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGetUserList = async () => {
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

  useEffect(() => {
    handleGetUserList();
    handleGenerateVoucher();
  }, [update]);

  // console.log(voucherGenerate);
  return (
    <Modal
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      title={'Mã giảm giá'}
    >
      <Form onFinish={handleOnFinish} form={form}>
        <Form.Item
          label={'Tên mã giảm giá'}
          name={'voucherName'}
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập vào tên mã giảm giá',
            },
          ]}
        >
          <TextArea autoSize />
        </Form.Item>
        <Form.Item label={'Mã giảm giá'} name={'voucherCode'}>
          <TextArea disabled autoSize />
        </Form.Item>
        <Form.Item
          label={'Số lượng'}
          name={'quantity'}
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập vào số lượng mã giảm giá',
            },
            () => ({
              validator(_, value) {
                if (value < 0) {
                  return Promise.reject(
                    new Error('Số lượng mã giảm giá không được bé hơn 0!'),
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
          validateFirst
        >
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item
          label={'Ngày hết hạn'}
          name={'expiredDate'}
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập vào ngày hết hạn!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || value.toISOString() > new Date().toISOString()) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Ngày hết hạn phải lớn hơn ngày hiện tại!'),
                );
              },
            }),
          ]}
          validateFirst
        >
          {/* <ConfigProvider locale={localeValues}> */}
          <DatePicker
            // defaultValue={dayjs('YYYY-MM-DD HH:mm:ss')}
            showTime
            // format={'YYYY-MM-DD HH:mm:ss'}
          />
          {/* </ConfigProvider> */}
        </Form.Item>
        <Form.Item label={'Danh sách người dùng'} name={'userList'}>
          <Select
            mode='multiple'
            allowClear
            style={{ width: '100%' }}
            placeholder='Chọn ...'
            options={userList}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
