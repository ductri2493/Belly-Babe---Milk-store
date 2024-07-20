import React, { useState, useEffect } from "react";
import { Button, Input } from "antd";
import { useNavigate } from "react-router-dom";
import CustomNumberFormat from "../../utils/CustomNumberFormat";
import { Link } from "react-router-dom";
import { productAPI } from "../../services/product";
import ProductCategory from "../../services/product/product.category";

const Search = ({ placeholder, onClickInput }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const fetchProduct = async () => {
    try {
      const products = await productAPI.fetchProducts();
      if (products && products.$values) {
        setData(products.$values);
      } else {
        console.error("Fetched data is not in the expected format:", products);
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

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, []);

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

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    filterProducts(event.target.value);
  };

  const normalizeVietnamese = (str) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // remove accents
  };

  const filterProducts = (inputValue) => {
    if (!Array.isArray(data)) {
      console.error("Data is not an array:", data);
      return;
    }

    if (inputValue.trim() === "") {
      setSearchResults([]);
    } else {
      const normalizedInput = normalizeVietnamese(inputValue);
      const filteredProducts = data.filter((productWrapper) => {
        const productName = productWrapper.productName;
        const normalizedTitle = normalizeVietnamese(productName);
        return (
          normalizedTitle.includes(normalizedInput) ||
          productName.toLowerCase().includes(inputValue.toLowerCase())
        );
      });
      setSearchResults(filteredProducts.slice(0, 5));
    }
  };

  const handleProductClick = () => {
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleSearchSubmit = () => {
    navigate(`/search/${searchTerm}`);
    setSearchTerm(""); // Reset search term
    setSearchResults([]); // Reset search results
  };

  return (
    <div className="relative w-[45vw] block">
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        onClick={onClickInput}
        onPressEnter={handleSearchSubmit}
        className="w-full min-w-56 pr-12 h-12 text-base pl-5 border-[2px] border-solid border-[#A487BC] rounded-xl overflow-visible m-0 focus:border-[#A487BC] focus:shadow-none hover:border-[#A765C9]"
      />
      {searchResults.length > 0 && (
        <div
          className={`absolute mt-1 w-[45vw] h-auto max-h-[60vh] bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-y-auto`}
        >
          {searchResults.map((productWrapper) => {
            const categoryName = getCategoryName(productWrapper.categoryId);
            return (
              <Link
                to={`/${categoryName}/${encodeURIComponent(
                  productWrapper.productName
                )}`}
                state={{
                  id: `${productWrapper.productId}`,
                  category: `${categoryName}`,
                  brandId: `${productWrapper.brandId}`,
                }}
                key={productWrapper.productId} // Unique key for each link
                className="flex px-4 py-3 hover:bg-gray-100 cursor-pointer"
                onClick={handleProductClick}
              >
                <div className="p-2">
                  <img
                    src={productWrapper.imageLinks.split(',')[0]}
                    alt={productWrapper.productName}
                    width={50}
                  />
                </div>
                <div className="px-2 py-2">
                  <p className="text-sm font-medium text-gray-800 mb-1">
                    {productWrapper.productName}
                  </p>
                  <p className="text-xs font-bold text-black">
                    <CustomNumberFormat numStr={productWrapper.newPrice} />
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      <Button
        type="submit"
        onClick={handleSearchSubmit}
        className="btn cursor-pointer border-none absolute bottom-0 top-0 right-0 w-20 h-full bg-[#A487BC] bg-[url(https://cdn1.concung.com/themes/desktop4.1/image/v40/icon/search.svg)] bg-no-repeat bg-center bg-[length:28px_28px] px-7 rounded-r-xl normal-case whitespace-normal inline-block font-normal text-center align-middle border-[1px] border-transparent text-sm overflow-visible m-0"
      ></Button>
    </div>
  );
};

export default Search;
