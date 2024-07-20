import { useContext, useState } from "react";
import "./LoginContent.scss";
import { useForm } from "antd/es/form/Form";
import { Button } from "@mui/material";
import { Form, Input, message } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { sendOtp } from "../../../services/auth/auth.service";
import { AuthContext } from "../../../context/AuthContextUser";

function LoginContent() {
  document.title = "Đăng Nhập";
  const [isHovered, setIsHovered] = useState(false);
  const [form] = useForm();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const userName = ""; // Default white string for userName
  const navigate = useNavigate();
  const location = useLocation();

  const handleFinish = (values) => { };

  const handleSendOtp = async () => {
    // Kiểm tra xem số điện thoại có hợp lệ không
    form.validateFields().then(async () => {
      const formattedPhoneNumber = phoneNumber.startsWith("0")
        ? "84" + phoneNumber.slice(1)
        : phoneNumber;

      try {
        if (isChecked && phoneNumber) {
          const response = await sendOtp(formattedPhoneNumber, userName);
          navigate("/login/verify-otp", {
            state: { phoneNumber: formattedPhoneNumber, from: location.state?.from, id: location.state?.id, brandId: location.state?.brandId },
          });
        } else {
          if (!isChecked) {
            message.warning("Ba mẹ vui lòng xác nhận đồng ý với Điều Khoản Chung & Chính Sách Bảo Mật Thông Tin của Belly&Babe để tiếp tục");
          }
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
      }
    }).catch(() => {
      // Bắt lỗi khi validate không thành công
      console.error("Số điện thoại không hợp lệ.");
    });
  };

  return (
    <div className="total items-center w-[100%] h-[600px] ">
      <div className="background items-center">
        <div className="flex text-left justify-between w-[1300px]">
          <span></span>
          <div className="login-form text-left color-11 box-block pt-[60px] mr-0 h-[480px] w-[360px]">
            <div>
              {/* div input */}
              <div className="box-input">
                <div className="text-left mb-2 color-40">
                  <span className="text-xl block font-bold mb-2">
                    Vui chào đón ba mẹ,
                  </span>
                  <span className="text-sm leading-6">
                    Đăng nhập hoặc Đăng ký ngay tài khoản
                  </span>
                </div>
                <Form
                  method="post"
                  form={form}
                  onFinish={handleFinish}
                  layout="vertical"
                  autoComplete="off"
                  style={{
                    maxWidth: 600,
                  }}
                >
                  <Form.Item
                    hasFeedback
                    className="relative"
                    name="Số điện thoại"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập vào số điện thoại của Bố Mẹ!",
                      },
                      {
                        whitespace: true,
                        message: "Bố Mẹ vui lòng không để trống số điện thoại!",
                      },
                      {
                        max: 13,
                        message: "Bố Mẹ vui lòng không nhập quá 13 số!",
                      },
                      {
                        pattern: new RegExp(
                          /((^(\+84|84|0|0084){1})(3|5|7|8|9))+([0-9]{8})$/
                        ),
                        message: "Bố Mẹ vui lòng nhập vào ô là Số Điện Thoại!",
                      },
                    ]}
                    validateFirst
                  >
                    <Input
                      type="text"
                      className="pl-4 flex bg-[#f3e5f5] input-phone-au border-0 form-control form-control-lg text-left font-medium font-16 !hover:bg-[#f3e5f5] checked:bg-[#f3e5f5]"
                      placeholder="Ba mẹ nhập vào số điện thoại"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item className="relative rounded-lg">
                    <div className="au btn-next mt-4 rounded-lg flex justify-center items-center">
                      <Button
                        block
                        onClick={handleSendOtp}
                        style={{
                          backgroundColor: "#ab47bc",
                          border: "none",
                        }}
                        size="small"
                        className={`au text-next cursor-pointer font-medium outline-none border-none w-full animated-button ${isHovered ? "hovered" : ""
                          }`}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                      >
                        <p className="flex justify-center items-center m-1">
                          Tiếp Tục
                        </p>
                      </Button>
                    </div>
                  </Form.Item>
                </Form>
              </div>
            </div>
            <div className="leading-4 mt-10  text-[#67686c] text-xs text-center">
              <input
                className="leading-4 mt-10"
                type="checkbox"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
              />
              <span className="text-sm"> Ba mẹ đã đọc và đồng ý với </span>
              <Link to="/termsandcondition" className="text-sm text-[#a062d2]">
                Điều Khoản Chung
              </Link>
              &
              <Link className="text-sm text-[#a062d2]" href="#">
                Chính Sách Bảo Mật
              </Link>
              <span className="text-sm"> của Belly&Babe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginContent;
