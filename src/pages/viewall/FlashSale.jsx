import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import star from "../../assets/images/star.png";
import ProductCart from "../../components/cart/ProductCart";
import SidebarData from "../../components/siderbar";
import Banner from "../../components/banner";
import { productAPI } from "../../services/product";
import ProductCategory from "../../services/product/product.category";

const FlashSale = ({ productsPerView }) => {
  const [hotSaleProducts, setHotSaleProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchProducts = async () => {
    try {
      const _products = await productAPI.fetchProducts();
      return _products.$values;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  };

  const fetchCategories = async () => {
    try {
      const _categories = await ProductCategory.fetchCategories();
      setCategories(_categories.$values);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    const getDiscountedProducts = async () => {
      await fetchCategories();
      const allProducts = await fetchProducts();
      const discountedProducts = allProducts.filter(
        (product) => parseFloat(product.discount) > 0
      );

      const productsWithCategoryNames = discountedProducts.map((product) => {
        const category = categories.find((cat) => cat.categoryId === product.categoryId);
        let categoryName = "Unknown";

        if (category) {
          if (category.parentCategoryId !== null) {
            const parentCategory = categories.find(
              (cat) => cat.categoryId === category.parentCategoryId
            );
            categoryName = `${parentCategory.categoryName}`;
          } else {
            categoryName = category.categoryName;
          }
        }

        return {
          ...product,
          categoryName: categoryName,
        };
      });

      setHotSaleProducts(productsWithCategoryNames);
    };

    getDiscountedProducts();
  }, []);

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
                Giá sốc
              </h2>
            </div>
            {/* product */}
            <div className="gap-3.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {hotSaleProducts &&
                hotSaleProducts.slice(0, productsPerView).map((item) => {
                  return (
                    <div key={item.productId} className="col-md-6 col-lg-4 mb-3">
                      <Link
                        to={`/${encodeURIComponent(item.categoryName)}/${encodeURIComponent(item.productName)}`}
                        state={{
                          id: item.productId,
                          category: item.categoryName,
                          brandId: item.brandId,
                        }}
                        className="bg-white no-underline text-[#111] active:text-[#111]"
                      >
                        <ProductCart item={item} star={star} />
                      </Link>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashSale;
