import React, { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveUserInfo } from '../../redux/features/admin/auth/userSlice';
import ProfileSidebar from '../../components/siderbar/profilesidebar/';
import { AuthContext } from '../../context/AuthContextUser';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserAPI from '../../services/account/User';
import { AddressContext } from '../../context/AddressContext';
import ChatBot from '../../components/chatbox/ChatBot';

const UserInfo = () => {
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.user.userInfo) || { name: '', email: '', phone: '' };
    const { isAuthenticated } = useContext(AuthContext);
    const [name, setName] = useState(userInfo.name);
    const [email, setEmail] = useState(userInfo.email);
    const [phone, setPhone] = useState(userInfo.phone);
    const { address } = useContext(AddressContext);

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = {
            username: name,
            phoneNumber: phone,
            email: email,
            address: "",
            fullName: "",
            roleId: 3,
            image: ""
        };
        try {
            const userId = parseInt(localStorage.getItem("userId"));
            //Call API để cập nhật thông tin người dùng 
            await UserAPI.uploadUserData(userId, userData);
            dispatch(saveUserInfo({ name, email, phone }));
            toast.success('Đã cập nhật thông tin thành công');
        } catch (error) {
            toast.error('Cập nhật thông tin thất bại');
        }
    };
    const handleLoginRedirect = () => {
        navigate("/login");
    };
    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100 mx-28">
            <ProfileSidebar />
            <div className="container mx-auto p-4">
                <div className="bg-white p-6 rounded shadow-md">
                    <h2 className="text-xl font-bold mb-4">Thông Tin Tài Khoản</h2>
                    <p className="mb-6">Vui lòng xác nhận các nội dung bên dưới</p>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Họ tên
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full px-3  border border-gray-300 rounded-md py-3 h-[46px] focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3  border border-gray-300 rounded-md py-3 h-[46px] focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Số điện thoại
                            </label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="mt-1 block w-full px-3  border border-gray-300 rounded-md py-3 h-[46px] focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        {isAuthenticated ? (
                            <div>
                                <button type="submit" className="w-full bg-pink-500 border-none text-white py-2 rounded-md">
                                    Lưu thông tin
                                </button>
                                <ToastContainer
                                    position="top-right"
                                    autoClose={1000}
                                    hideProgressBar={false}
                                    newestOnTop={false}
                                    closeOnClick
                                    rtl={false}
                                    pauseOnFocusLoss
                                    draggable
                                    pauseOnHover
                                    theme="light"
                                />
                            </div>

                        ) : (
                            <button onClick={handleLoginRedirect} type="submit" className="w-full bg-pink-500 border-none text-white py-2 rounded-md">
                                Vui lòng đăng nhập để nhập thông tin
                            </button>
                        )}
                    </form>
                </div>
            </div>
            <ChatBot />
        </div>
    );
};

export default UserInfo;
