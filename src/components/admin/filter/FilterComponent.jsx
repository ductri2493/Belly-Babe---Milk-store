import { Button } from 'antd';
import { useState } from 'react';

const FilterComponent = ({
  filtersVisible,
  brands,
  categories,
  handleBrandChange,
  handleCategoryChange,
}) => {
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const toggleBrandSelection = (brandId) => {
    const newSelectedBrands = selectedBrands.includes(brandId)
      ? selectedBrands.filter((id) => id !== brandId)
      : [...selectedBrands, brandId];
    setSelectedBrands(newSelectedBrands);
    handleBrandChange(newSelectedBrands);
  };

  const toggleCategorySelection = (categoryId) => {
    const newSelectedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];
    setSelectedCategories(newSelectedCategories);
    handleCategoryChange(newSelectedCategories);
  };

  const resetBrands = () => {
    setSelectedBrands('');
    handleBrandChange('');
  };

  const resetCategories = () => {
    setSelectedCategories('');
    handleCategoryChange('');
  };

  return (
    filtersVisible && (
      <div className='transition-all flex flex-wrap'>
        <div className='flex flex-wrap gap-2 container'>
          <label className='flex items-center'>Thương hiệu: </label>
          <Button
            type='dashed'
            key='reset-brands'
            className='p-2 text-center'
            onClick={resetBrands}
          >
            Tất cả thương hiệu
          </Button>
          {brands.map((brand) => (
            <Button
              type='dashed'
              key={brand.brandId}
              className={`p-3 text-center ${
                selectedBrands.includes(brand.brandId)
                  ? 'bg-blue-500 text-white'
                  : ''
              }`}
              onClick={() => toggleBrandSelection(brand.brandId)}
            >
              {brand.brandName}
            </Button>
          ))}
        </div>
        <div className='flex flex-wrap gap-2 mt-4 container'>
          <label className='flex items-center'>Loại sản phẩm: </label>
          <Button
            type='dashed'
            key='reset-categories'
            className='p-2 text-center'
            onClick={resetCategories}
          >
            Tất cả loại sản phẩm
          </Button>
          {categories.map((category) => (
            <Button
              type='dashed'
              key={category.categoryId}
              className={`p-2 text-center ${
                selectedCategories.includes(category.categoryId)
                  ? 'bg-blue-500 text-white'
                  : ''
              }`}
              onClick={() => toggleCategorySelection(category.categoryId)}
            >
              {category.categoryName}
            </Button>
          ))}
        </div>
      </div>
    )
  );
};

export default FilterComponent;
