import { Modal, Typography } from 'antd';
import CustomNumberFormat from '../../../utils/CustomNumberFormat';
import { productAPI } from '../../../services/product';
import { useEffect, useState } from 'react';

function ProductDetails({
  productId,
  brands,
  categories,
  detailModal,
  handleOkDetail,
  handleCancelDetail,
}) {
  const [product, setProduct] = useState({});

  const fetchProductData = async (productId) => {
    try {
      const response = await productAPI.fetchProduct(productId);
      if (response) {
        console.log(response);
        setProduct(response);
      }
    } catch (error) {
      console.error('Failed to fetch product: ', error);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductData(productId);
    }
  }, [productId]);

  return (
    <>
      <Modal
        onCancel={handleCancelDetail}
        onOk={handleOkDetail}
        open={detailModal}
      >
        <div className='modal-header'>
          <h5 className='modal-title'>Chi tiết sản phẩm</h5>
        </div>
        <div className='modal-body'>
          <div className='form-group'>
            <label className='form-label'>Tên sản phẩm</label>
            <div>
              <Typography>{product?.productName}</Typography>
            </div>
          </div>
          <div className='form-group'>
            <label className='form-label mt-3'>Giá mới nhất</label>
            <div>
              <Typography>
                <CustomNumberFormat numStr={product?.newPrice} />
              </Typography>
            </div>
          </div>
          <div className='form-group'>
            <label className='form-label mt-3'>Giá cũ</label>
            <div>
              <Typography>
                <CustomNumberFormat numStr={product?.oldPrice} />
              </Typography>
            </div>
          </div>
          <div className='form-group'>
            <label className='form-label mt-3'>Thương hiệu</label>
            <div>
              {brands.map((brand) => {
                return brand.brandId === product?.brandId ? (
                  <Typography key={brand.brandId}>{brand.brandName}</Typography>
                ) : null;
              })}
            </div>
          </div>
          <div className='form-group'>
            <label className='form-label mt-3'>Phân loại</label>
            <div>
              {categories.map((category) => {
                return category.categoryId === product?.categoryId ? (
                  <Typography key={category.categoryId}>
                    {category.categoryName}
                  </Typography>
                ) : null;
              })}
            </div>
          </div>
          <div className='form-group'>
            <label className='form-label mt-3'>Số lượng</label>
            <div>
              <Typography>{product?.quantity}</Typography>
            </div>
          </div>
          <div className='form-group'>
            <label className='form-label mt-3'>Trạng thái</label>
            <div>
              <Typography
                className={`${
                  product?.isSelling
                    ? 'badge bg-label-info'
                    : 'badge bg-outline-warning'
                }`}
              >
                {product?.isSelling ? 'Đang bán' : 'Ngừng bán'}
              </Typography>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ProductDetails;
