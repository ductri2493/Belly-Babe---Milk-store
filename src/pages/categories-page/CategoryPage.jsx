import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductCategory from '../../services/product/product.category';
import Banner from '../../components/banner/index';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import ProductCart from '../../components/cart/ProductCart';
import SidebarData from '../../components/siderbar';
import ChatBot from '../../components/chatbox/ChatBot';

const CategoryPage = ({ productsPerView }) => {
  window.scrollTo(0, 0);
  const { parentCategoryName } = useParams();
  const [categoryProducts, setCategoryProducts] = useState([]);
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
              categoryName: 'Sữa bột cao cấp',
            };
          }
          if (cat.parentCategoryId === 2) {
            return {
              ...cat,
              categoryName: 'Các loại nước uống khác',
            };
          }
          if (cat.parentCategoryId === 3) {
            return {
              ...cat,
              categoryName: 'Ăn dặm dinh dưỡng',
            };
          }
          return cat;
        });
        setCategories(mappedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      const allProducts = categories.flatMap(
        (category) => category.products?.$values || [],
      );
      const currentCategoryProducts = allProducts.filter((product) => {
        const categoryName = getCategoryName(product.categoryId).trim();
        return categoryName === parentCategoryName;
      });

      setCategoryProducts(currentCategoryProducts);
    }
  }, [categories, parentCategoryName]);

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
    return 'Unknown'; // ??????????
  };

  // useEffect(() => {
  //   console.log(categoryProducts);
  // }, [categoryProducts]);

  return (
    <div className='main-content bg-[#f5f7fd]'>
      {/* Container */}
      <div className='container mx-auto w-full'>
        <div className='flex mx-[20px]'>
          <SidebarData />
          {/* Homepage Content */}
          <div className='block  w-[1000px] mt-4'>
            <div>
              {/* Banner content */}
              <div className='container rounded-2xl mb-15px'>
                <Banner />
              </div>
              {/* Product content */}
              <div className='container section-page bg-[#E1CDE9] p-8 mt-4 rounded-2xl mb-4'>
                <div className='header-title pb-6 space flex justify-between'>
                  <h2 className='text-2xl font-bold inline-block'>
                    {parentCategoryName}
                  </h2>
                </div>
                <div className='gap-3.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
                  {categoryProducts.slice(0, productsPerView).map((item) => (
                    <div
                      key={item.productId}
                      className='col-md-6 col-lg-4 mb-3'
                    >
                      <Link
                        to={`/${encodeURIComponent(
                          parentCategoryName,
                        )}/${encodeURIComponent(item.productName)}`}
                        state={{
                          id: item.productId,
                          category: parentCategoryName,
                          brandId: item.brandId,
                        }}
                        className='bg-white no-underline text-[#111] active:text-[#111]'
                      >
                        <ProductCart item={item} />
                      </Link>
                    </div>
                  ))}
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

export default CategoryPage;
