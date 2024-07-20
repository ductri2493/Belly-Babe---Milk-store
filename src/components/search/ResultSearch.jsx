import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { productAPI } from "../../services/product";
import { RiErrorWarningLine } from "react-icons/ri";
import CustomNumberFormat from "../../utils/CustomNumberFormat";
import { Link } from "react-router-dom";
import ProductCart from "../cart/ProductCart";
import ProductCategory from "../../services/product/product.category";
import NotFound from "../../assets/img/404_page_found_milk.png"
import ChatBot from "../chatbox/ChatBot";

const ResultSearch = () => {
  const { searchTerm } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchError, setSearchError] = useState(false); // State to track search error

  const normalizeVietnamese = (str) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // remove accents
  };

  useEffect(() => {
    if (!searchTerm) {
      setSearchError(true);
      setProducts([]);
      return;
    }
    const fetchProducts = async () => {
      try {
        const products = await productAPI.fetchProducts();
        if (products && products.$values) {
          const normalizedInput = normalizeVietnamese(searchTerm);
          const filteredProducts = products.$values.filter((product) => {
            const normalizedTitle = normalizeVietnamese(product.productName);
            return (
              normalizedTitle.includes(normalizedInput) ||
              product.productName
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            );
          });
          setProducts(filteredProducts);
          setSearchError(filteredProducts.length === 0); // Set searchError based on results
        }
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

    fetchCategories();
    fetchProducts();
  }, [searchTerm]);

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
      <div className="py-4 mx-[calc(100vw-1400px)]">
        <div className="text-[#67686c] text-lg">
          ✨Kết quả tìm kiếm với từ khóa "{searchTerm}"✨
        </div>
        {searchError ? (
          <div className="container section-page bg-[#fff] h-fit p-24 rounded-2xl mb-4 flex justify-center   ">
            <h5 className=" text-red-500 mb-4">
              <RiErrorWarningLine size={250} className="mr-2" /><br />
              <p className="text-center items-center">Không tìm thấy kết quả tìm kiếm.</p>
            </h5>
          </div>
        ) : (
          <div className="container section-page bg-[#E1CDE9] p-8 mt-4 rounded-2xl mb-4">
            <div className="gap-3.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {products.map((product) => (
                <Link
                  to={`/${encodeURIComponent(
                    getCategoryName(product.categoryId)
                  )}/${encodeURIComponent(product.productName)}`}
                  state={{
                    id: product.productId,
                    category: getCategoryName(product.categoryId),
                    brandId: product.brandId,
                  }}
                  key={product.productId}
                >
                  <ProductCart item={product} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <ChatBot />
    </div >
  );
};

export default ResultSearch;
