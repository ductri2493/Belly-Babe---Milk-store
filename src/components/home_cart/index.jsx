import ArrowForward from "../../assets/img/arrow_forward.png";
import "./index.css";
import { FaBabyCarriage } from "react-icons/fa";
import Voucher from "../voucher";
import SidebarData from "../siderbar";
import Banner from "../banner";
import { Link } from "react-router-dom";
import Product from "../product/Product";
import Services from "../services";
import CountdownTimer from "../countdowntimer";
import { useEffect, useState } from "react";
//import foryou
import HotSale from "../foryou/HotSale";
import MoreFeedBack from "../foryou/MoreFeedBack";
//import MUI
import BlogContent from "../BlogBanner/BlogContent.jsx";
import FlashSale from "../../pages/viewall/FlashSale.jsx";
import ChatBot from "../chatbox/ChatBot.jsx";
import { Button, Tabs } from "antd";

const HomeCart = () => {
  document.title = "Belly&Babe";
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 1);
  const [hotSaleProducts, setHotSaleProducts] = useState([]);
  const [productsPerView, setProductsPerView] = useState(10);
  const [activeTabKey, setActiveTabKey] = useState("1");
  const items = [
    {
      key: "1",
      label: "Dành cho bạn",
      children: <Product productsPerView={productsPerView} />,
    },
    {
      key: "2",
      label: "Hot Sale tháng 7",
      children: <HotSale productsPerView={productsPerView} />,
    },
    {
      key: "3",
      label: "Sản phẩm được mua nhiều",
      children: <MoreFeedBack productsPerView={productsPerView} />,
    },
  ];

  useEffect(() => {
    // Reset productsPerView when switching tabs
    if (activeTabKey !== "1") {
      setProductsPerView(10);
    }
  }, [activeTabKey]);

  const onChange = (key) => {
    setActiveTabKey(key); // Update active tab when it changes
  };

  return (
    <div className="relative flex z-10 min-h-[calc(100vh-490px)] bg-[#F5F7FD]">
      <div className="container flex">
        <SidebarData />
        {/* Sidebar content */}
        <div className="section">
          {/* Banner */}
          <div className="section-page">
            <Banner numberOfSLide={1} />
          </div>
          {/*amenities and services */}
          <div className="amenities-and-services">
            <Services />
          </div>
          {/* section content voucher*/}
          <Voucher />
          {/* Product content */}
          <div className="section-page bg-[#eee2f2] p-6 mt-4 rounded-2xl">
            <div className="header-title pb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold m-0">Mua Nhanh Giảm Ngay</h2>
              <Link
                to="/DiscountCategories"
                className="flex items-center text-[#db2777] font-bold no-underline"
              >
                Xem tất cả
                <img
                  className="ml-2 align-middle"
                  width={15}
                  src={ArrowForward}
                  alt="Arrow Forward"
                  loading="lazy"
                />
              </Link>
            </div>
            <Product productsPerView={5} category={"Mua Nhanh Giảm Ngay"} />
          </div>
          {/* Product content */}
          <div className="section-page bg-[#eee2f2] p-6 mt-4 rounded-2xl">
            <div className="header-title pb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold m-0">Ưu Đãi Từ Thương Hiệu</h2>
              <Link
                to="/BrandOffer"
                className="flex items-center text-[#db2777] font-bold no-underline"
              >
                Xem tất cả
                <img
                  className="ml-2 align-middle"
                  width={15}
                  src={ArrowForward}
                  alt="Arrow Forward"
                  loading="lazy"
                />
              </Link>
            </div>
            <Product productsPerView={5} category={"Ưu Đãi Từ Thương Hiệu"} />
          </div>

          {/*Flase sale */}
          <div className="section-page bg-[#eee2f2] p-6 mt-4 rounded-2xl">
            <div className="header-title pb-6 flex justify-between items-center">
              <div className="flex items-center">
                <h2 className="text-2xl font-bold m-0">Giá ⚡ Sốc</h2>
                <span className="px-2">
                  <CountdownTimer startHour={16} endHour={18} />
                </span>
              </div>
              <Link
                to="/FlashSale"
                className="flex items-center text-[#db2777] font-bold no-underline"
              >
                Xem tất cả
                <img
                  className="ml-2 align-middle"
                  width={15}
                  src={ArrowForward}
                  alt="Arrow Forward"
                  loading="lazy"
                />
              </Link>
            </div>
            {/* product */}
            {/* <Product productsPerView={5} category={"Giá Sốc"} /> */}
            <HotSale
              productsPerView={5}
              onHotSaleProducts={setHotSaleProducts}
            />
          </div>

          {/* Blog Banner */}
          <div className="section-page bg-[#F5F7FD]  mt-4 rounded-2xl">
            <div className="header-title pb-3 space flex justify-center items-center">
              <div className="flex">
                {/* <div className="text-4xl font-bold inline-block bg-gradient-to-r from-[#ec4891] to-[#f9a8cc] text-transparent bg-clip-text"> */}
                <FaBabyCarriage
                  size={30}
                  className="mt-1 ml-3 flip-horizontal"
                />
                <div className="text-4xl font-bold inline-block text-[#db2777] bg-clip-text ml-3">
                  Bài viết
                </div>
                <FaBabyCarriage size={30} className="mt-1 ml-3" />
                <span className="px-2"></span>
              </div>
            </div>
            <BlogContent />
          </div>
          {/* Blog Banner */}

          {/*For You */}
          <div className="section-page bg-[#eee2f2] p-6 mt-4 rounded-2xl">
            <div className="header-title pb-4 space flex justify-center items-center">
              <h2 className="text-2xl font-bold inline-block m-0">
                Sản Phẩm Dành Riêng Cho Bạn
              </h2>
            </div>
            {/*display product */}
            <div className="pb-2 space flex justify-center ">
              <Tabs
                className="custom-tabs items-center"
                defaultActiveKey="1"
                items={items}
                onChange={onChange}
                activeKey={activeTabKey} // Make sure the active tab is visually updated
              />
            </div>

            {/* View More button for tab 1 */}
            {(activeTabKey === "1" || activeTabKey === "2" || activeTabKey === "3") && (
              <div className="flex justify-center mt-1">
                <Button
                  className="bg-pink-500 hover:bg-pink-300 text-white font-semibold py-2 px-4 rounded shadow-md transform hover:scale-105 transition duration-200 ease-in-out" // Added ease-in-out
                  type="primary"
                  onClick={() => setProductsPerView(productsPerView + 10)}
                >
                  Xem Thêm
                </Button>
              </div>
            )}
          </div>
          <div>
            <ChatBot />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCart;
