/* eslint-disable no-unused-vars */
import { Avatar, Button, Form, Image, Input, Upload } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { UploadOutlined } from '@ant-design/icons';
import { toast, ToastContainer } from 'react-toastify';
import UserAPI from '../../../services/account/User';

const initialValue = {
  userName: '',
  phoneNumber: '',
  password: '',
  email: '',
  address: '',
  fullName: '',
  roleId: 0,
  image: '',
};

export default function Profile() {
  const { userInfo: currentUser } = useSelector((state) => state.auth);
  const [currentInfo, setCurrentInfo] = useState(initialValue);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  const handleFetchUser = async (id) => {
    try {
      const user = await UserAPI.fetchAccount(id);
      setCurrentInfo(user);
      form.setFieldsValue(user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (currentUser.userID) {
      handleFetchUser(currentUser.userID);
    }
  }, [currentUser.userID, form]);

  const cleanup = () => {
    setFileList([]);
    form.setFieldsValue({ image: '' });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      // console.log('values', values);
      // console.log('fileList', fileList);
      const imageUrl =
        fileList.length > 0 ? fileList[0].thumbUrl : currentInfo.image;
      const _values = { ...values, image: imageUrl };
      // console.log('_values', _values);
      await UserAPI.uploadAccount(currentInfo.userId, _values);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleChangeImage = useCallback(
    ({ fileList: newFileList }) => {
      setFileList(newFileList);
      // console.log('fileList', fileList);
      if (newFileList.length > 0) {
        form.setFieldsValue({ image: newFileList[0].thumbUrl });
      }
    },
    [fileList, form],
  );

  return (
    <div className='container-xxl flex-grow-1 container-p-y'>
      <h4 className='fw-bold py-3 mb-4'>
        <span className='text-muted fw-light'>Cài đặt /</span> Tài khoản
      </h4>
      <div className='row'>
        <div className='col-md-12'>
          <ul className='nav nav-pills flex-column flex-md-row mb-3'>
            <li className='nav-item'>
              <a className='nav-link active'>
                <i className='bx bx-user me-1' /> Tài khoản
              </a>
            </li>
          </ul>
          <div className='card mb-4'>
            <h5 className='card-header'>Chi tiết hồ sơ</h5>
            <Form
              form={form}
              layout='vertical'
              onFinish={handleSubmit}
              initialValues={currentInfo}
            >
              <div className='card-body'>
                <div className='flex items-center justify-start'>
                  <Avatar
                    size={{
                      xs: 24,
                      sm: 32,
                      md: 40,
                      lg: 64,
                      xl: 80,
                      xxl: 100,
                    }}
                    src={
                      fileList.length ? fileList[0].thumbUrl : currentInfo.image
                    }
                    alt='user-avatar'
                  />
                  <div className='button-wrapper ml-4'>
                    <div className='flex gap-4 items-center ml-3 mb-2'>
                      <Form.Item name='image' className='-mb-[20px]'>
                        <Upload
                          name='file'
                          listType='picture'
                          fileList={fileList}
                          maxCount={1}
                          className='mr-2'
                          onChange={handleChangeImage}
                        >
                          <Button
                            icon={<UploadOutlined />}
                            className='btn-primary'
                          >
                            Tải hình ảnh
                          </Button>
                        </Upload>
                      </Form.Item>
                    </div>
                    <Button
                      type='button'
                      danger
                      className='btn-outline-secondary account-image-reset ml-3 mb-2 transition-all'
                      onClick={cleanup}
                    >
                      <i className='bx bx-reset d-block d-sm-none' />
                      <span className='d-none d-sm-block'>Reset</span>
                    </Button>
                    <p className='text-muted mb-0 ml-3'>
                      Được phép JPG, GIF hoặc PNG. Kích thước tối đa 800KB
                    </p>
                  </div>
                </div>
              </div>
              <div className='card-body'>
                <div className='row'>
                  <div className='mb-3 col-md-6'>
                    <Form.Item name='userName' label='Username'>
                      <Input className='form-control h-[46px]' autoFocus />
                    </Form.Item>
                  </div>
                  <div className='mb-3 col-md-6'>
                    <Form.Item name='fullName' label='Full Name'>
                      <Input className='form-control h-[46px]' />
                    </Form.Item>
                  </div>
                  <div className='mb-3 col-md-6'>
                    <Form.Item name='email' label='E-mail'>
                      <Input className='form-control h-[46px]' />
                    </Form.Item>
                  </div>
                  <div className='mb-3 col-md-6'>
                    <label className='form-label' htmlFor='phoneNumber'>
                      Phone Number
                    </label>
                    <div className='input-group input-group-merge'>
                      <span className='input-group-text h-[46px] border-r border-solid'>
                        (+84)
                      </span>
                      <Form.Item
                        name='phoneNumber'
                        noStyle
                        validateFirst
                        rules={[
                          {
                            pattern: new RegExp(
                              /((^(\+84|84|0|0084){1})(3|5|7|8|9))+([0-9]{8})$/,
                            ),
                            message: 'Vui lòng nhập vào ô là Số Điện Thoại!',
                          },
                        ]}
                      >
                        <Input className='form-control h-[46px]' type='text' />
                      </Form.Item>
                    </div>
                  </div>
                  <div className='mb-3 col-md-6'>
                    <Form.Item name='address' label='Address'>
                      <Input className='form-control h-[46px]' />
                    </Form.Item>
                  </div>
                </div>
                <div className='mt-2'>
                  <Button type='primary' htmlType='submit' className='me-2'>
                    Save Changes
                  </Button>
                  <Button type='default' onClick={() => form.resetFields()}>
                    Reset
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
