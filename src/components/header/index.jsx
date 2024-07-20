import { useContext, useEffect, useState } from "react";
import IconShopping from "../../assets/icons/shopping_cart_24dp_FILL0_wght400_GRAD0_opsz24.svg";
import IconNotification from "../../assets/icons/notifications_24dp_FILL0_wght400_GRAD0_opsz24.svg";
import { Image } from "antd";
import Search from "../search/Search";
import { NavLink } from "react-router-dom";

// scss
import "./index.scss";
import { CartContext } from "../../context/CartContext";
import { useSelector } from "react-redux";
import { VoucherAPI } from "../../services/voucher";

const Header = ({ }) => {
  const { itemInCart } = useContext(CartContext);
  const userCartItems = useSelector((state) => state.cart.cartItems);
  const userId = localStorage.getItem("userId");
  const totalItems = userId ? userCartItems.length : itemInCart;

  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isButtonClick, setIsButtonClick] = useState(false);
  const [scrollbar, setScrollbar] = useState("");
  const [notiVoucher, setNotificationVoucher] = useState(0);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const products = await VoucherAPI.fetchVouchers();
        if (products && products.$values) {
          setNotificationVoucher(products.$values.length);
        } else {
          console.error(
            "Fetched data is not in the expected format:",
            products
          );
        }
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };

    fetchVouchers();
  }, []);

  const handleClickButtonSearch = (value) => {
    console.log(value);
    console.timeEnd(value);
    setIsButtonClick(true);
  };

  // const handleChangeSearchBox = (value) => {
  //   setSearchQuery(value.target.value);
  // };
  // const searchParameters = Object.keys(Object.assign({}, ...data));
  // const onSearch = (value, _e, info) => console.log(info?.source, value);
  // const handleOnChange = async () => {
  //   const response = await fetch()
  //     .then((items) => setItemInCart([...itemInCart, items]))
  //     .catch((error) => console.log(error));
  // };

  // Scroll header
  useEffect(() => {
    window.addEventListener("scroll", isScrolling);
    return () => {
      window.removeEventListener("scroll", isScrolling);
    };
  }, []);

  const isScrolling = () => {
    const scrollTop = window.scrollY;
    const stickyClass = scrollTop >= 60 ? "header__sticky" : "";
    setScrollbar(stickyClass);
  };

  return (
    // header
    <div className={`shadow-inner ${scrollbar} bg-[#fff]`}>
      <div className={`container`}>
        <div className="justify-between container flex items-center mx-auto px-0 py-3 gap-20">
          <div className="items-center flex gap-14">
            {/* header__left */}
            <NavLink
              to="/"
              className="text-center w-[205px] cursor-pointer flex items-end text-inherit no-underline"
            >
              <h1 className="text-[#A765C9] text-4xl font-bold mb-0">Belly&</h1>
              <h1 className="text-3xl font-bold text-gray-800 mb-0">Babe</h1>
            </NavLink>
            {/* header__middle__search */}
            <div className="flex">
              <Search
                placeholder="Ba mẹ muốn tìm mua gì hôm nay ?"
                onClickButton={handleClickButtonSearch}
              />
            </div>
          </div>
          {/* header__right */}
          <div className=" min-w-44 container flex relative text-center ml-[65px]">
            {/* right__cart */}
            <NavLink
              to="cart"
              className="mr-10 no-underline active:text-[#a062d2] border-none bg-none items-center outline-none text-center text-xs justify-center cursor-pointer relative bg-transparent shadow-none"
            >
              <span className="text-center w-auto min-w-4 py-0 px-[3px] rounded-xl absolute leading-4 bg-[#f90] text-xs -top-[4px] -right-[9px] text-white tracking-normal">
                {totalItems}
              </span>
              <Image
                src={IconShopping}
                preview={false}
                width={30}
                height={30}
                className="bg-contain mx-auto block "
              />
              <span className="mt-[6px] leading-[14px] block text-sm text-center cursor-pointer text-black">
                Giỏ Hàng
              </span>
            </NavLink>
            {/* right__notification */}
            <NavLink
              to={"promotion"}
              className="mr-7 no-underline active:text-[#a062d2] border-none bg-none items-center outline-none text-center text-xs justify-center cursor-pointer relative bg-transparent shadow-none"
            >
              <span className="text-center w-auto min-w-4 py-0 px-[3px] rounded-xl absolute leading-4 bg-[#f90] text-xs -top-[4px] -right-[4px] text-white">
                {notiVoucher}
              </span>
              <Image src={IconNotification} preview={false} width={35} />
              <span className="mt-[6px] leading-[14px] block text-sm text-center cursor-pointer text-black">
                Ưu Đãi
              </span>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
