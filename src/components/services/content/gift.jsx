import React, { useEffect, useState } from "react";
import Breadcrumb from "../../breadcrumb/Breadcrumb";
import Banner from "../../banner";
import star from "../../../assets/images/star.png";
import { productAPI } from "../../../services/product";
import ProductCategory from "../../../services/product/product.category";
import ProductCart from "../../cart/ProductCart";
import { Link } from "react-router-dom";
import banner1 from "../../../assets/img/Banner_1.png";
import banner2 from "../../../assets/img/Banner_2.png";
import banner3 from "../../../assets/img/Banner_3.png";
import banner4 from "../../../assets/img/Banner_4.png";
import ChatBot from "../../chatbox/ChatBot";
const Gift = ({ productsPerView }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchProducts = async () => {
    try {
      const _products = await productAPI.fetchProducts();
      return _products.$values;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
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

  useEffect(() => {
    const getDiscountedProducts = async () => {
      const allProducts = await fetchProducts();
      const discountedProducts = allProducts.filter(
        (product) => parseFloat(product.discount) > 0,
      );
      setProducts(discountedProducts);
    };

    getDiscountedProducts();
    fetchCategories(); // Fetch categories when the component mounts
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
    <div className='main-content bg-[#f5f7fd]'>
      {/* Container */}
      <div className="mx-[5px]">
        <img className="my-1" src={banner1} width={1500} alt="" />
        <img className="my-1" src={banner2} width={1500} alt="" />
        <img className="my-1" src={banner3} width={1500} alt="" />
        <img className="my-1" src={banner4} width={1500} alt="" />
      </div>
      <div className="relative min-h-[calc(100vh-100px)] container">
        <div className="pb-4 mx-[calc(100vw-1400px)]">
          {/* Homepage Content */}
          <div>
            {/* Product content */}
            <div className="container section-page bg-[#E1CDE9] p-8 mt-4 rounded-2xl mb-4">
              <div className="header-title pb-6 space flex justify-between">
                <h2 className="text-2xl font-bold inline-block">
                  Ưu đãi mỗi ngày
                </h2>
              </div>
              <div className="container section-page bg-[#E1CDE9] p-8 mt-4 rounded-2xl mb-4">
                <div className="gap-3.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  {products &&
                    products.slice(0, productsPerView).map((item) => {
                      const categoryName = getCategoryName(item.categoryId);
                      return (
                        <div
                          key={item.productId}
                          className='col-md-6 col-lg-4 mb-3'
                        >
                          <Link
                            to={`/${encodeURIComponent(
                              categoryName,
                            )}/${encodeURIComponent(item.productName)}`}
                            state={{
                              id: item.productId,
                              category: categoryName,
                              brandId: item.brandId,
                            }}
                            className='bg-white no-underline text-[#111] active:text-[#111]'
                          >
                            <ProductCart item={item} star={star} />
                          </Link>
                        </div>
                      );
                    })}
                </div>
              </div>
              {/* Product content */}
            </div>
          </div>
        </div>
      </div>
      <ChatBot />
    </div>
  );
};

export default Gift;
