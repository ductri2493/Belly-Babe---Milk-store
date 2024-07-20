import React, { useEffect, useState } from "react";
import Bell from "../../../assets/img/uu-dai.png";
import Gift from "../../../assets/img/gift-empty.png";
import "./PromotionContent.scss";
import { Tabs } from "antd";
import { VoucherAPI } from "../../../services/voucher";
import { productAPI } from "../../../services/product";
import ProductCategory from "../../../services/product/product.category";
import { Link } from "react-router-dom";
import CustomNumberFormat from "../../../utils/CustomNumberFormat";
import ChatBot from "../../../components/chatbox/ChatBot";
// import "antd/dist/antd.css";

const { TabPane } = Tabs;

const PromotionContent = ({ setNotificationVoucher }) => {
  const [activeTabKey, setActiveTabKey] = useState("1");
  const [voucherData, setVoucherData] = useState([]);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [categories, setCategories] = useState([]);


  const handleTabChange = (key) => {
    setActiveTabKey(key);
  };

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const products = await VoucherAPI.fetchVouchers();
        if (products && products.$values) {
          setVoucherData(products.$values);
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

    const fetchDiscountedProducts = async () => {
      try {
        const response = await productAPI.fetchProducts(); // Adjust the API call accordingly
        if (response && response.$values) {
          const discounted = response.$values.filter(product => product.discount > 15);
          setDiscountedProducts(discounted);
        } else {
          console.error(
            "Fetched data is not in the expected format:",
            response
          );
        }
      } catch (error) {
        console.error("Error fetching discounted products:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const _categories = await ProductCategory.fetchCategories();
        setCategories(_categories.$values);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
    fetchVouchers();
    fetchDiscountedProducts();
  }, []);

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.categoryId === categoryId);
    if (category) {
      if (category.parentCategoryId !== null) {
        const parentCategory = categories.find(
          (cat) => cat.categoryId === category.parentCategoryId,
        );
        return `${parentCategory.categoryName}`;
      } else {
        return category.categoryName;
      }
    }
    return 'Unknown';
  };

  return (
    <div className="w-full mt-4 px-0 pt-5 rounded-xl h-fit bg-white">
      <Tabs
        defaultActiveKey="1"
        activeKey={activeTabKey}
        onChange={handleTabChange}
        centered
        tabBarStyle={{ color: "#A765C9" }}
        tabBarGutter={200}
      >
        {/* Tab 1: Ưu Đãi */}
        <TabPane tab={<span style={{ fontSize: "16px" }}>Ưu Đãi</span>} key="1">
          <div className="tab-pane container bg-[#FFF2F8] active show">
            {discountedProducts.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Loading...</p>
              </div>
            ) : (
              discountedProducts.map((product) => {
                const categoryName = getCategoryName(product.categoryId); // Assuming getCategoryName function retrieves category name
                return (
                  <div
                    key={product.productId}
                    className="pt-5 pb-4 pl-5 mb-0 flex bg-[#FFF2F8]"
                  >
                    <a href="#">
                      <img className="w-10" src={Bell} alt="" />
                    </a>
                    <div className="pl-5">
                      <Link
                        to={`/${encodeURIComponent(categoryName)}/${encodeURIComponent(product.productName)}`}
                        state={{
                          id: product.productId,
                          category: categoryName,
                          brandId: product.brandId,
                        }}
                      >
                        <span className="font-medium">{product.productName}</span>
                      </Link>
                      <div className="text-[#202020] text-sm">
                        ⬇️ Giảm {product.discount}% cho sản phẩm này <br />
                        ✨ Giảm giá đặc biệt và nhiều ưu đãi khác
                        <br />
                        {/* Add more details if needed */}
                        <i className="text-[67686c] italic text-xs">
                          {/* Ngày hết hạn: {product.expiryDate} */}
                        </i>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </TabPane>
        {/* Tab 1: Ưu Đãi */}

        {/* Tab 3: Mã giảm giá */}
        <TabPane tab={<span style={{ fontSize: "16px" }}>Mã giảm Giá</span>} key="3">
          <div className="tab-pane container">
            {voucherData.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Loading...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {voucherData.map((voucher) => (
                  <div
                    key={voucher.voucherId}
                    className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md group hover:scale-105 transition-transform duration-200"
                  >
                    <Link
                      to="/" // Adjust the path as needed
                      className="w-full h-full flex flex-col items-center justify-center"
                    >
                      <img
                        className="w-48 h-48 object-cover mb-4 hover:scale-95 transition-transform duration-200"
                        src={Gift}
                        alt="Gift"
                      />
                      <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-4 shadow-md">
                        <h3 className="text-lg font-medium text-blue-600 mb-2">{voucher.voucherName}</h3>
                        <p className="text-sm font-medium text-gray-600 mb-2">Mã giảm giá: {voucher.voucherCode}</p>
                        <p className="text-sm font-medium text-gray-600 mb-2">Số lượng: {voucher.quantity}</p>
                        <p className="text-sm font-medium text-gray-600 mb-2">Ngày hết hạn: {new Date(voucher.expiredDate).toLocaleDateString()}</p>
                        <p className="text-sm font-medium text-gray-600 mb-2">Số tiền hóa đơn tối thiểu: <CustomNumberFormat numStr={voucher.minimumBillAmount} /></p>
                        {/* Add more details as needed */}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabPane>
        {/* Tab 3: Mã giảm giá */}
      </Tabs>
      <ChatBot />
    </div>
  );
};

export default PromotionContent;
