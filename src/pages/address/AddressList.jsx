import React, { useContext } from 'react';
import { AddressContext } from '../../context/AddressContext';
import { Link, useNavigate } from 'react-router-dom';

const AddressList = () => {
  const { addresses, deleteAddress, updateSelectedAddress } = useContext(AddressContext);
  const navigate = useNavigate();

  const handleDelete = (index) => {
    deleteAddress(index);
  };
  const handleSelectAddress = (selectedAddress) => {
    updateSelectedAddress(selectedAddress);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-r from-[#fff4fc] to-[#fdeef3] mx-4 lg:mx-28 py-10">
      <div className="container mx-auto p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-[#906090]">Danh Sách Địa Chỉ Nhận Hàng</h2>
          <button
            className="mb-4 px-4 py-2 border-none bg-gradient-to-r from-[#ffabab] to-[#ffdaab] text-white rounded-lg transition-transform duration-300 hover:shadow-lg hover:scale-105"
            onClick={() => navigate('/address')}
          >
            Thêm Địa Chỉ
          </button>
          {addresses.length === 0 ? (
            <p className="mb-6 text-gray-600">Không có địa chỉ nào được lưu.</p>
          ) : (
            <ul className="space-y-4 list-none">
              {addresses.map((addr, index) => (
                <li key={index} className="p-4 bg-gradient-to-r from-[#fff4fc] to-[#fdeef3] rounded-lg shadow-md">
                  <div className="text-[#411f2d] font-medium">
                    <strong>Họ tên:</strong> {addr.fullName}
                  </div>
                  <div className="text-[#411f2d] font-medium">
                    <strong>Số điện thoại:</strong> {addr.phoneNumber}
                  </div>
                  <div className="text-[#411f2d] font-medium">
                    <strong>Địa chỉ:</strong> {addr.address}
                  </div>
                  <button
                    onClick={() => handleSelectAddress(addr)}
                    className="mt-2 px-3 py-1 border-none shadow-lg bg-gradient-to-r from-[#abe4ff] to-[#d9abff] text-white rounded-lg transition-transform duration-300  hover:scale-105"
                  >
                    Chọn địa chỉ này
                  </button>
                  <div className="flex mt-4 space-x-4">
                    <Link to={`/address/edit/${index}`} className="mt-2 px-3 py-1 text-white bg-gradient-to-r from-[#54787d] to-[#7b8f8a] rounded-lg transition-transform duration-300 hover:shadow-lg hover:scale-105">
                      Chỉnh sửa
                    </Link>
                    <button
                      onClick={() => handleDelete(index)}
                      className="mt-2 px-3 py-1 text-white bg-gradient-to-r from-[#ff6600] to-[#d31900] rounded-lg border-none transition-transform duration-300 hover:shadow-lg hover:scale-105"
                    >
                      Xóa
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressList;
