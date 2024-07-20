import React, { useState } from 'react';

const ConfirmationModal = ({ show, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg w-96">
        <div className="modal-header p-0 border-0 flex justify-center">
          <span className="block text-lg font-bold py-6 text-center">Xác Nhận</span>
        </div>
        <div className="modal-body w-full p-0 text-sm pt-0">
          <span className="block text-center font-medium text-base mb-5">
            Bạn có chắc muốn xóa sản phẩm?
          </span>
          <div className=" flex w-full mt-5">
            <button
              className="w-1/2 leading-10 text-center text-blue-500 border-none cursor-pointer hover:bg-gray-100 mx-2 rounded-lg"
              onClick={onClose}
            >
              Xem lại
            </button>
            <button
              className="w-1/2 text-pink-500 font-medium leading-10 text-center border-none cursor-pointer hover:bg-gray-100 rounded-lg"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : 'Đồng ý'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
