import { Button } from 'antd';
import React, { useState } from 'react';
import LoadingOverlay from '../loader/LoadingOverlay';

const PopupPreorder = ({ isOpen, onClose, handlePreOrder }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const formatPhoneNumber = (number) => {
        if (number.startsWith('0')) {
            return '84' + number.slice(1);
        }
        return number;
    };
    const validatePhoneNumber = (number) => {
        const formattedNumber = formatPhoneNumber(number);
        const phoneRegex = /^84\d{9}$/;
        return phoneRegex.test(formattedNumber);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedNumber = formatPhoneNumber(phoneNumber);
        if (!validatePhoneNumber(formattedNumber)) {
            setError('Số điện thoại phải là số và phải có 10 chữ số.');
            return;
        }
        if (!validateEmail(email)) {
            setError('Email không hợp lệ.');
            return;
        }
        setError('');
        setIsLoading(true);
        await handlePreOrder(formattedNumber, email);
        setIsLoading(false);
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity- z-50">
            {isLoading && <LoadingOverlay />}
            <div className="bg-gradient-to-br from-green-200 to-blue-300 p-6 rounded-lg shadow-lg w-[500px] border-[3px] border-gray-300">
                <h2 className="text-2xl mb-4 text-neutral-950">Đăt trước sản phẩm</h2>
                <p className='text-neutral-950'>Sản phẩm hiện tại đã hết hàng nếu bạn muốn mua hãy để lại thông tin cho chúng tôi</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm text-neutral-950  font-medium mb-2 text-left">
                            Số điện thoại:
                            <input
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                                className="mt-1 p-3 w-full border rounded-lg "
                            />
                        </label>
                        {error && error.includes('Số điện thoại') && <p className="text-red-500 text-sm">{error}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm text-neutral-950 font-medium mb-2 text-left">
                            Email:
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 p-3 w-full border rounded-lg"
                            />
                        </label>
                        {error && error.includes('Email') && <p className="text-red-500 text-sm">{error}</p>}
                    </div>
                    <div className="flex justify-end">
                        <Button
                            type="button"
                            onClick={onClose}
                            className="mr-2 px-4 py-2 border-none bg-gray-500 text-white rounded-lg"
                        >
                            Hủy
                        </Button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-gradient-to-br from-[#6253E1] to-[#04BEFE] border-none bg-blue-500 text-white rounded-lg"
                        >
                            Đặt trước
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PopupPreorder;
