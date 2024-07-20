import "./index.scss";
import Loveimage from "../../assets/img/hinh-trai-tim.png";
import Clock1h from "../../assets/img/clock-1h.png";
import Legit from "../../assets/img/legit.png";
import Freeze from "../../assets/img/freeze.png";
import Repair from "../../assets/img/repair.png";
import ShipCod from "../../assets/img/ShipCod.png";
import VNPay from "../../assets/img/VNpay.png";
import MomoPay from "../../assets/img/momo-pay.png";
import Grap from "../../assets/img/Grap.png";
import Ahamove from "../../assets/img/Ahamove.png";
import LogoNoti from "../../assets/img/logoSaleNoti.png";
import Facebookicon from "../../assets/img/icon-facebook.png";
import Zaloicon from "../../assets/img/icon-zalo.png";
import { Image } from "antd";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="clear-both block text-[#555] leading-normal text-xs p-3 text-left bg-[#fff] mt-2">
      <div className="container px-0 flex justify-between pt-2 leading-[18px] relative items-center text-[13px]">
        <div className="block text-center w-1/5">
          <Image
            className="block mx-auto mb-[15px] align-middle border-none"
            width={54}
            src={Loveimage}
            preview={false}
          />
          <p className="">
            Cùng Ba mẹ
            <br /> Nuôi Con
          </p>
        </div>
        <div className="block text-center w-1/5">
          <img
            className="block mx-auto mb-[15px] align-middle border-none"
            width={54}
            src={Clock1h}
          />
          <p className="">
            Giao Hàng
            <br /> Siêu Tốc 1h
          </p>
        </div>

        <div className="block text-center w-[20%]">
          <img
            className="block mx-auto mb-[15px] align-middle border-none"
            width={54}
            src={Legit}
          />
          <p className="">
            100% <br /> Chính Hãng
          </p>
        </div>

        <div className="block text-center w-[20%]">
          <img
            className="block mx-auto mb-[15px] align-middle border-none"
            width={54}
            src={Freeze}
          />
          <p className="">
            Bảo Quản <br /> Mát
          </p>
        </div>

        <div className="block text-center w-[20%]">
          <img
            className="block mx-auto mb-[15px] align-middle border-none"
            width={54}
            src={Repair}
          />
          <p className="">
            Đổi Trả <br /> Dễ Dàng
          </p>
        </div>
      </div>
      <div className="pt-[5px] mb-0 flex flex-wrap list-none">
        {/* tolal of footer */}
        <div className="block w-full">
          {/*div create border*/}
          <div
            className="container flex justify-center pt-4 z-[1] border-t border-[#EAEAEA] text-[13px] px-0 relative leading-4"
            style={{ borderTopStyle: "solid" }}
          >
            {/* column 1 of footer*/}
            <div className="mb-[10px] float-left w-[250px]">
              <h5 className="text-[15px] text-[#545454] font-normal mb-0">
                <span className="text-[15px] text-[#545454] font-bold">
                  Công Ty Cổ Phần Belly&Babe
                </span>
                <br />
                <span className="mt-1 font-normal block">
                  Thành viên của Tập đoàn
                  <span className="font-medium"> BBI group</span>
                </span>
              </h5>
              <div className="list-none p-0 mt-[10px] block">
                <li className="">
                  <span className="font-medium">Email:</span>
                  <Link
                    href=""
                    className="no-underline bg-transparent text-[#333]"
                  >
                    {" "}
                    cskh@Belly&Babe.com
                  </Link>
                </li>
                <li className="">
                  <span className="font-medium">Điện thoại:</span>{" "}
                  {"028 7300 6609"}
                </li>
                <li className="">
                  <span className="font-medium">ĐKKD:</span>{" "}
                  {"Đại học FPT"}
                </li>
                <li className="">
                  <span className="font-medium">Văn phòng: </span>{" "}
                  {
                    "345 nguyễn sơn P.Phú Thạnh Q.Tân Phú"
                  }
                </li>
              </div>
            </div>
            {/* End column 1 of footer*/}
            {/* column 2 of footer */}
            <div className="float-left w-[200px] ml-[100px] mb-[10px]">
              <h5 className="mb-[5px] text-[15px] text-[#545454] font-bold">
                Về Belly&Babe
              </h5>
              <div className="list-none p-0">
                <li className="">
                  <Link className="no-underline text-[#333]" href="">
                    Giới thiệu về Belly&Babe
                  </Link>{" "}
                  {/*The page hasn't been created yet so the href is blank*/}
                </li>
                <li className="">
                  <Link className="no-underline text-black" href="">
                    Chính sách bảo mật
                  </Link>{" "}
                  {/*The page hasn't been created yet so the href is blank*/}
                </li>
                <li className=" ">
                  <Link to='/termsandcondition' className="no-underline text-black" href="">
                    Điều khoản chung
                  </Link>
                </li>
              </div>

              <h5 className="mt-[30px] text-[15px] text-[#545454] mb-[5px] font-bold ">
                Hỗ Trợ Khách Hàng
              </h5>
              <div className="list-none p-0">
                <li className="">
                  <Link className="no-underline text-black" href="">
                    Tra cứu hoá đơn
                  </Link>{" "}
                  {/*The page hasn't been created yet so the href is blank*/}
                </li>
                <li>
                  <Link className="no-underline text-[black]" href="">
                    Mua &amp; giao nhận Online
                  </Link>{" "}
                  {/*The page hasn't been created yet so the href is blank*/}
                </li>
                <li className="">
                  <Link className="no-underline text-black" href="">
                    Qui định &amp; hình thức thanh toán
                  </Link>{" "}
                  {/*The page hasn't been created yet so the href is blank*/}
                </li>
                <li className="">
                  <Link className="no-underline text-black" href="">
                    Bảo hành &amp; Bảo trì
                  </Link>{" "}
                  {/*The page hasn't been created yet so the href is blank*/}
                </li>
                <li className="">
                  <Link className="no-underline text-black" href="">
                    Đổi trả &amp; Hoàn tiền
                  </Link>{" "}
                  {/*The page hasn't been created yet so the href is blank*/}
                </li>
              </div>
            </div>
            {/* End column 2 of footer */}
            {/* column 3 of footer*/}
            <div className="float-left w-[225px] ml-24">
              <h5 className="font-bold mb-2">Chấp Nhận Thanh Toán</h5>
              <div className="flex">
                {" "}
                {/* div of image*/}
                <img
                  src={ShipCod}
                  alt="ShipCod"
                  width={48}
                  height={48}
                  className="object-contain"
                />
                <img
                  src={VNPay}
                  alt="VNPay"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
            </div>
            {/* End column 3 of footer*/}
            {/* {column 4 of footer  } */}
            <div className="w-[220px] ml-[90px] mb-[15px]">
              <h5 className="font-bold text-[15px] text-[#545454] mb-[5px]">
                Kết Nối Với Chúng Tôi
              </h5>
              <div className="list-none mb-0 mt-2 p-0 flex items-center justify-start ">
                <a
                  target="_blank"
                  className="text-center no-underline bg-transparent text-[#333]"
                  style={{ width: 58 }}
                  href="https://facebook.com/"
                >
                  <img
                    className="inline-block"
                    src={Facebookicon}
                    alt="Facebook"
                    width={36}
                    height={36}
                  />
                  Facebook
                </a>
                <a
                  target="_blank"
                  className="text-center no-underline bg-transparent text-[#333]"
                  style={{ width: 58 }}
                  href="https://zaloweb.me/"
                >
                  <img
                    className="inline-block"
                    src={Zaloicon}
                    alt="Zalo"
                    width={36}
                    height={36}
                  />
                  Zalo
                </a>
              </div>
            </div>
            {/* {end of column 4 of footer} */}
          </div>
          <div
            className="container flex text-lg pt-2 z-[1] border-t border-[#EAEAEA] justify-center"
            style={{ borderTopStyle: "solid" }}
          >
            © 2024 Belly&Babe. Tất cả các quyền được bảo lưu.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
