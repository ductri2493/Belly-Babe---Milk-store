import "../../components/home_cart/index.css";
import SidebarData from "../../components/siderbar";
import Banner from "../../components/banner";
import Product from "../../components/product/Product";

const DiscountCategories = () => {
  return (
    <div className="relative flex z-[1] min-h-[calc(100vh-490px)] bg-[#F5F7FD]">
      <div className="container flex">
        <SidebarData />
        {/* Sidebar content */}
        <div className="section">
          {/* Banner */}
          <div className="section-page">
            <Banner numberOfSLide={1} />
          </div>
          {/* Product content */}
          <div className="section-page bg-[#E1CDE9] p-6 mt-4 rounded-2xl">
            <div className="header-title pb-6 space flex justify-between">
              <h2 className="text-2xl font-bold inline-block">
                Mua Nhanh Giảm Ngay
              </h2>
            </div>
            {/* product */}
            <Product productsPerView={20} category={"Mua Nhanh Giảm Ngay"} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default DiscountCategories;
