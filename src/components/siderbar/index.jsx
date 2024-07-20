import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { LuMilk } from "react-icons/lu";
import { TbMilk } from "react-icons/tb";
import { PiBaby } from "react-icons/pi";
import ProductCategory from "../../services/product/product.category";
import BlogSide from "../BlogBanner/BlogSide";

const SidebarData = ({ productsPerView, category }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await ProductCategory.fetchCategories();
        const filteredCategories = response?.$values || [];
        const mappedCategories = filteredCategories.map((cat) => {
          if (cat.parentCategoryId === 1) {
            return {
              ...cat,
              categoryName: "Sữa bột cao cấp",
            };
          }
          if (cat.parentCategoryId === 2) {
            return {
              ...cat,
              categoryName: "Các loại nước uống khác",
            };
          }
          if (cat.parentCategoryId === 3) {
            return {
              ...cat,
              categoryName: "Ăn dặm dinh dưỡng",
            };
          }
          return cat;
        });
        setCategories(mappedCategories);
        // setCategories(filteredCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Function to render icon based on category name
  const renderIcon = (categoryName) => {
    switch (categoryName) {
      case "Sữa bột cao cấp":
        return <LuMilk size={20} />;
      case "Các loại nước uống khác":
        return <TbMilk size={20} />;
      case "Ăn dặm dinh dưỡng":
        return <PiBaby size={20} />;
      default:
        return null; // Or a fallback icon
    }
  };

  return (
    <div className="relative z-30">
      <div className="w-[13.8rem] sticky top-[103px] min-h-[calc(100vh-770px)] mr-[15px] bg-white rounded-b-lg -mt-4 z-40">
        <div className="shadow-none px-0 pb-0">
          <div className="w-52 pb-1 max-h-[300px] relative inline bg-white rounded-b-lg">
            {/* {categories.map((category, index) => ( */}
            {categories.slice(0, 3).map((category, index) => (
              <ul
                key={index}
                className="menu-main pl-4 h-9 leading-9 text-sm list-none my-3 rounded-lg hover:bg-pink-100 transition-colors duration-400"
              >
                <li
                  key={index}
                  className="menu-1 text-inherit flex items-center font-bold"
                >
                  {renderIcon(category.categoryName)}
                  <NavLink
                    to={`/category/${category.categoryName}`}
                    className="text-gray-600 no-underline px-2 hover:text-pink-600 transition-colors duration-300"
                  >
                    {category.categoryName}
                  </NavLink>
                </li>
              </ul>
            ))}
          </div>
        </div>
      </div>
      {/* Banner */}
      <div className="sticky top-[calc(105px+130px+1rem)] w-[13.8rem] ">
        <div className=" relative">
          <BlogSide />
        </div>
      </div>
    </div>
  );
};

export default SidebarData;
