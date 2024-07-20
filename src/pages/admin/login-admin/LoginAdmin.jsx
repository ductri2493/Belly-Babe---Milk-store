/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { Form, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import backgroundImage from '../../../assets/img/backgroundAdmin.jpg';
import { adminLogin } from '../../../redux/features/admin/auth/auth.thunk';
import { clearMessage } from '../../../redux/features/messagesSlice';
import { toast, ToastContainer } from 'react-toastify';

const LoginAdmin = () => {
  const { loading, error, userInfo, success } = useSelector(
    (state) => state.auth,
  );
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const initialValues = {
    email: '',
    password: '',
  };

  const handleLogin = (formValues) => {
    if (!loading) {
      dispatch(adminLogin(formValues));
    }
    if (userInfo && success) {
      toast.success('Đăng nhập thành công!');
    }
  };

  useEffect(() => {
    dispatch(clearMessage());

    if (userInfo && (userInfo.roleId === 1 || userInfo.roleId === 2)) {
      navigate('/admin/dashboard');
    }
    if (error) {
      toast.error('Vui lòng kiểm tra lại thông tin đăng nhập!');
      return;
    }
  }, [userInfo, navigate, dispatch, error]);

  return (
    <div className='flex flex-col h-screen bg-gray-100'>
      {/* Header */}
      <div className='header relative top-0 inset-x-0 z-[1030] flex items-center bg-white shadow-md py-2'>
        <div className='container mx-auto flex items-center justify-between my-auto'>
          {/* Logo */}
          <Link
            to='/'
            className='flex items-center text-inherit no-underline justify-center mt-3'
          >
            <h1 className='text-[#b885d2] text-4xl font-bold'>Belly&</h1>
            <h1 className='text-3xl font-bold text-gray-800'>Babe</h1>
          </Link>
          <span className='border-l h-6 border-gray-300 mx-4'></span>
          {/* <span className='text-2xl text-gray-700 font-semibold'>
            Administrator
          </span> */}
        </div>
      </div>
      {/* Main Content */}
      <div
        className='flex flex-1 items-center justify-center py-12 px-4 sm:px-6 lg:px-8 h-screen'
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className='bg-white bg-opacity-90 p-8 rounded-lg shadow-md w-full max-w-md mb-9'>
          {/* Logo */}
          <div className='text-2xl font-bold text-center text-[#A765C9] flex justify-center items-center'>
            <span className='flex items-end justify-center'>
              <h1 className='text-[#9c67ac] text-2xl font-bold'>Belly&</h1>
              <h1 className='text-xl font-bold text-gray-80078'>Babe</h1>
            </span>
          </div>
          {/* Form Login */}
          <Form
            className='mb-3'
            method='POST'
            form={form}
            onFinish={handleLogin}
            initialValues={initialValues}
          >
            <Form.Item className='mb-3'>
              <label htmlFor='email' className='form-label'>
                Email
              </label>
              <Form.Item
                name='email'
                rules={[{ required: true, message: 'Vui lòng nhập E-mail!' }]}
              >
                <Input type='email' className='form-control h-10' />
              </Form.Item>
            </Form.Item>
            <Form.Item className='mb-3 form-password-toggle'>
              <label className='form-label' htmlFor='password'>
                Mật khẩu
              </label>
              <Form.Item
                name='password'
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
              >
                <Input.Password
                  className='form-control h-10 flex'
                  autoComplete='true'
                />
              </Form.Item>
            </Form.Item>

            <Form.Item className='!text-center !justify-center flex items-center form-group'>
              <Button
                className='btn btn-primary btn-block'
                type='submit'
                disabled={loading}
              >
                {loading && (
                  <span className='spinner-border spinner-border-sm'></span>
                )}
                <span>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</span>
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginAdmin;
