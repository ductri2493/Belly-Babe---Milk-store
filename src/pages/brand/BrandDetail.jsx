import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import Voucher from "../../components/voucher";
import Brand from "../../components/brand";
import { productAPI } from "../../services/product";
import ProductCart from "../../components/cart/ProductCart";
import ProductCategory from "../../services/product/product.category";

const BrandDetail = ({ productsPerView }) => {
  window.scrollTo(0, 0);
  const location = useLocation();
  const { brandId, imageBrand, brandName } = location.state || {};
  const { BrandProduct } = useParams();
  const [productData, setProductData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brandData, setBrandData] = useState({
    brandId: brandId || "",
    brandName: brandName || "",
    imageBrand: imageBrand || "",
  });

  const fetchProducts = async () => {
    try {
      const products = await productAPI.fetchProducts();
      console.log(products); // Ensure the structure of products
      const _products = products.$values; // Assuming this structure is necessary
      const filteredProducts = _products.filter(
        (product) => product.brandId === brandData.brandId
      );
      setProductData(filteredProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
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
    if (brandData.brandId) {
      fetchProducts();
      fetchCategories(); // Ensure categories are fetched when brandId changes
    }
  }, [brandData.brandId]);

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.categoryId === categoryId);
    if (category) {
      if (category.parentCategoryId !== null) {
        const parentCategory = categories.find(
          (cat) => cat.categoryId === category.parentCategoryId
        );
        return `${parentCategory.categoryName}`;
      } else {
        return category.categoryName;
      }
    }
    return "Unknown";
  };

  return (
    <div className="relative min-h-[calc(100vh-100px)] container">
      <div className="pb-4 mx-[calc(100vw-1400px)]">
        <div className="container flex p-[20px] rounded-xl bg-[#fff]">
          <Brand brandId={brandData} />
        </div>
        <Voucher />
        {/* Product content */}
        <div className="container section-page bg-[#E1CDE9] p-8 mt-4 rounded-2xl mb-4">
          <div className="header-title pb-6 space flex justify-between">
            <h2 className="text-2xl font-bold inline-block">
              {brandData.brandName}
            </h2>
          </div>
          <div className="gap-3.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {/* Mapping through productData and rendering ProductCart for each item */}
            {productData &&
              productData.slice(0, productsPerView).map((item) => (
                <Link
                  to={`/${encodeURIComponent(getCategoryName(item.categoryId))}/${encodeURIComponent(item.productName)}`}
                  state={{
                    id: item.productId,
                    category: getCategoryName(item.categoryId),
                    brandId: item.brandId,
                  }}
                  key={item.productId}
                >
                  <ProductCart item={item} />
                </Link>
              ))}
          </div>
        </div>
        {/* Product content */}
      </div>
    </div>
  );
};

export default BrandDetail;
