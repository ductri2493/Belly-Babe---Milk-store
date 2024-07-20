import { Link } from 'react-router-dom';
import './Product.scss';
import { productAPI } from '../../services/product';
import { useEffect, useState } from 'react';
import ProductCategory from '../../services/product/product.category';
import ProductCart from '../cart/ProductCart';

const Product = ({ productsPerView, category }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchProducts = async () => {
    try {
      const _products = await productAPI.fetchProducts();
      setProducts(_products.$values);
    } catch (error) {
      console.error('Error fetching products:', error);
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
    fetchProducts();
    fetchCategories();
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
    <div className='gap-3.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
      {products
        // .filter(item => getCategoryName(item.categoryId) === category)  // Adjust filter based on category name structure
        .slice(0, productsPerView)
        .map((item) => {
          const categoryName = getCategoryName(item.categoryId);
          return (
            <div key={item.productId} className='col-md-6 col-lg-4 mb-3 custom-padding'>
              <Link
                to={`/${encodeURIComponent(categoryName)}/${encodeURIComponent(
                  item.productName,
                )}`}
                state={{
                  id: item.productId,
                  category: categoryName,
                  brandId: item.brandId,
                }}
                className='bg-white no-underline text-[#111] active:text-[#111]'
              >
                <ProductCart item={item} />
              </Link>
            </div>
          );
        })}
    </div>
  );
};

export default Product;
