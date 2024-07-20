import { useState, useEffect, useContext } from 'react';
import './LoginContent.scss';
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from '../../../services/auth/auth.service';
import { AuthContext } from '../../../context/AuthContextUser';

function VerifyOtp() {
  const [otp, setOtp] = useState(Array(4).fill(''));
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  useEffect(() => {
    if (location.state && location.state.phoneNumber) {
      setPhoneNumber(location.state.phoneNumber);
    }
  }, [location.state]);

  const handleChange = (e, index) => {
    const newOtp = [...otp];

    if (e.nativeEvent.inputType === 'deleteContentBackward') {
      newOtp[index] = '';
      setOtp(newOtp);
      if (index > 0) {
        const prevInput = document.getElementById(`otp-input-${index - 1}`);
        if (prevInput) {
          prevInput.focus();
        }
      }
    } else {
      if (isNaN(e.target.value)) return;
      newOtp[index] = e.target.value;
      setOtp(newOtp);
      setError('');
      if (e.target.value && index < otp.length - 1) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length < 4) {
      setError('Vui lòng điền đủ mã xác thực.');
      return;
    }
    try {
      const response = await verifyOtp(phoneNumber, otpCode);
      if (!response) {
        throw new Error("Failed to verify OTP");
      }
      console.log("OTP verified, response:", response);
      const { token, userID } = response;
      console.log("Token:", token);
      console.log("UserID:", userID);
      register(phoneNumber, token, userID);

      const redirectTo = location.state?.from || '/';
      const stateToPass = { id: location.state?.id, brandId: location.state?.brandId };
      navigate(redirectTo, { state: stateToPass });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError('Xác thực OTP không thành công. Vui lòng thử lại.');
      setOtp(Array(4).fill(''));
    }
  };
  return (
    <div className="total items-center w-full h-[600px] bg-[#cb9eef]">
      <div className="background items-center">
        <div className="flex text-left justify-between w-[1300px]">
          <span></span>
          <div className="login-from text-left color-11 box-block pt-[40px] mr-0 h-[480px] w-[360px]">
            <div>
              <div className="box-input">
                <div className="text-left mb-2 color-40">
                  <span className="text-xl block font-bold mb-2 text-center">
                    Nhập Mã Xác Thực
                  </span>
                  <span className="text-sm leading-6">
                    Nhập xác thực (4 chữ số) đang gửi đến số điện thoại
                  </span>
                </div>
                <span className="italic text-xl mt-5 block text-center font-extrabold tracking-wide">
                  {phoneNumber}
                </span>
                <div className="otp-area flex mt-10 w-fit mx-auto">
                  {otp.map((data, i) => (
                    <div className="item-otp" key={i}>
                      <input
                        type="text"
                        maxLength={1}
                        value={data}
                        className="w-12 min-w-12 text-3xl border-none text-center overflow-auto text-black block focus:outline-none"
                        onChange={(e) => handleChange(e, i)}
                        id={`otp-input-${i}`}
                      />
                      <div className="line-otp mx-[12px] my-[9px] rounded-full border-solid "></div>
                    </div>
                  ))}
                </div>
                {error && (
                  <div className="error-message text-red-500 text-center mt-4">
                    {error}
                  </div>
                )}
                <div className="flex mt-4">
                  <button
                    className="bg-[#c062d3] hover:bg-[#ab47bc] text-white px-4 py-2 rounded w-full transition duration-300"
                    onClick={handleVerifyOtp}
                  >
                    Verify OTP
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;