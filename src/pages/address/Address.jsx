import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AddressContext } from "../../context/AddressContext";
import { AddressAPI } from "../../services/address/AddressService"; // Adjust the import path as needed
import ProfileSidebar from "../../components/siderbar/profilesidebar";
import { AuthContext } from "../../context/AuthContextUser";
import ChatBot from "../../components/chatbox/ChatBot";

const Address = () => {
  window.scrollTo(0, 0);

  const { addAddress, addresses, editAddress } = useContext(AddressContext);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const { isAuthenticated } = useContext(AuthContext);
  useEffect(() => {
    if (id && addresses[id]) {
      setFormData(addresses[id]);
    }
  }, [id, addresses]);
  const handleLoginRedirect = () => {
    navigate("/login");
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phoneNumber') {
      if (/^\d*$/.test(value) && value.length <= 10) {
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, phoneNumber: '' });
      } else {
        setErrors({ ...errors, phoneNumber: 'Số điện thoại chỉ được nhập số và không quá 10 ký tự.' });
      }
    } else if (name === 'fullName') {
      if (/^[a-zA-ZÀ-ỹ\s]*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, fullName: '' });
      } else {
        setErrors({ ...errors, fullName: 'Họ Tên chỉ được nhập chữ cái và khoảng trắng.' });
      }
    } else if (name === 'address') {
      if (/^[a-zA-ZÀ-ỹ1-9-/\s,\.]*$/.test(value)) {
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, address: '' });
      } else {
        setErrors({ ...errors, address: 'Địa chỉ chỉ được nhập chữ cái, số, khoảng trắng, dấu phẩy và dấu chấm.' });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ tên không được để trống';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Số điện thoại không được để trống';
    } else if (!/^\d{10}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Số điện thoại phải bao gồm đúng 10 chữ số';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Địa chỉ không được để trống';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        if (id) {
          editAddress(Number(id), formData);
        } else {
          addAddress(formData);
        }
        const userId = localStorage.getItem("userId");
        const response = await AddressAPI.contactInfo(userId, formData);
        // console.log('API response:', response);
        navigate('/addresslist');
      } catch (error) {
        console.error('Failed to save address:', error);
        if (error.response && error.response.status === 404) {
          console.error('Endpoint not found:', error.response);
        } else {
          console.error('An error occurred:', error);
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100 mx-28">
      <ProfileSidebar />
      <div className="container mx-auto p-4">
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-bold mb-4">{id ? 'Chỉnh Sửa Địa Chỉ' : 'Thêm Mới Địa Chỉ Nhận Hàng'}</h2>
          <p className="mb-6">Vui lòng xác nhận các nội dung bên dưới</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Họ tên người nhận
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.fullName ? "border-red-500" : "border-gray-300"} rounded-md py-3 h-[46px] focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Số điện thoại người nhận
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.phoneNumber ? "border-red-500" : "border-gray-300"} rounded-md py-3 h-[46px] focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.phoneNumber && <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Địa chỉ nhận hàng
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md py-3 h-[46px] focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
              {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Bản đồ</label>
              <div className="mt-2">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4270157594016!2d106.7653858147863!3d10.789621892315205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527b9d5b6fdb1%3A0x1e367e36716a85d2!2zVMOibiBQaMO6IE1hdCBNaMOibiBQaMaw4budbmcgTmd1eeG7hW4gVGhhbmggTeG7mSBOaWNoIFTEqW4!5e0!3m2!1svi!2s!4v1628086185156!5m2!1svi!2s"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Google Maps"
                ></iframe>
              </div>
            </div>
            {isAuthenticated ? (
              <button type="submit" className="w-full bg-pink-500 border-none text-white py-2 rounded-md">
                {id ? 'Lưu thay đổi' : 'Thêm mới'}
              </button>
            ) : (
              <button onClick={handleLoginRedirect} type="submit" className="w-full bg-pink-500 border-none text-white py-2 rounded-md">
                Đăng nhập để lưu địa chỉ
              </button>
            )}
          </form>
        </div>
      </div>
      <ChatBot />
    </div>
  );
};

export default Address;
