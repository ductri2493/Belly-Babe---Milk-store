import { useEffect, useMemo, useState } from 'react';
import { Button, Input, Pagination, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { productAPI } from '../../../../services/product';
import { useForm } from 'antd/es/form/Form';
import EditProductForm from '../../../../components/admin/EditProductForm';
import DescriptionModal from '../../../../components/admin/DescriptionModal';
import ProductModal from '../../../../components/admin/ProductModal';
import CustomNumberFormat from '../../../../utils/CustomNumberFormat';
import { toast, ToastContainer } from 'react-toastify';
import ProductCategory from '../../../../services/product/product.category';
import BrandAPI from '../../../../services/brand';
import ControlTable from '../../../../components/ControlTable';
import FilterProduct from '../../../../components/admin/filter/FilterProduct';
import ProductDetails from '../../../../components/admin/details/ProductDetails';

const ManageProduct = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedDescription, setSelectedDescription] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [selectedProductEdit, setSelectedProductEdit] = useState(null);
  const [createForm] = useForm();
  const [editForm] = useForm();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParameters] = useState(['productName']);
  const [editing, setEditing] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [productId, setProductId] = useState(null);
  // Data
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  // Filters
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filtersVisible, setFiltersVisible] = useState(false);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productData, categoriesData, brandData] = await Promise.all([
          productAPI.fetchProducts(),
          ProductCategory.fetchCategories(),
          BrandAPI.fetchBrands(),
        ]);
        setProducts(productData.$values || []);
        setCategories(categoriesData.$values || []);
        setBrands(brandData.$values || []);
        setFilteredProducts(applyFilters(productData.$values || []));
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [refresh, filteredBrands, filteredCategories]);

  // Filter Products
  const applyFilters = (products) => {
    let filtered = products;
    if (filteredBrands.length > 0) {
      filtered = filtered.filter((product) =>
        filteredBrands.includes(product.brandId),
      );
    }
    if (filteredCategories.length > 0) {
      filtered = filtered.filter((product) =>
        filteredCategories.includes(product.categoryId),
      );
    }
    return filtered;
  };

  const handleBrandChange = (selectedBrands) => {
    setFilteredBrands(selectedBrands);
  };

  const handleCategoryChange = (selectedCategories) => {
    setFilteredCategories(selectedCategories);
  };

  const handleSearch = () => {
    setFilteredProducts(
      applyFilters(
        products.filter((product) =>
          searchParameters.some(
            (param) =>
              product[param] &&
              product[param]
                .toString()
                .toLowerCase()
                .includes(searchQuery.toLowerCase()),
          ),
        ),
      ),
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredProducts.slice(start, end);
  }, [currentPage, filteredProducts, pageSize]);

  // Modal Handlers
  const handleOpenDescription = (description) => {
    setIsOpenModal(true);
    setSelectedDescription(description);
  };

  const handleCloseEditDescription = () => {
    setIsOpenModal(false);
    setSelectedDescription(null);
  };

  const handleCancelCreateProduct = () => {
    setIsOpenCreateModal(false);
  };

  const handleOpenCreateModal = () => {
    setIsOpenCreateModal(true);
  };

  const handleOkCreateProduct = () => {
    createForm.submit();
  };

  const handleFinishFormCreateProduct = async (values) => {
    try {
      await productAPI.createProduct(values);
      toast.success('Product created successfully');
      handleCancelCreateProduct();
      createForm.resetFields();
      setRefresh(!refresh);
    } catch (error) {
      console.error('Failed to create product:', error);
      toast.error('Failed to create product');
    }
  };

  const handleOpenDetailModal = (productId) => {
    setDetailModal(true);
    setProductId(productId);
  };

  const handleOkDetail = () => {
    setDetailModal(false);
    setProductId(null);
  };

  const handleCancelDetail = () => {
    setDetailModal(false);
    setProductId(null);
  };

  const handleOpenEdit = (productId) => {
    setSelectedProductEdit(productId);
    setEditing(true);
  };

  const handleOkEdit = () => {
    editForm.submit();
    setSelectedProductEdit(null);
  };

  const handleDelete = async () => {
    if (selectedProductIds.length === 0) return;
    try {
      await Promise.all(
        selectedProductIds.map((id) => productAPI.deleteProduct(id)),
      );
      toast.success('Products deleted successfully');
      setRefresh(!refresh);
    } catch (error) {
      console.error('Failed to delete products:', error);
      toast.error('Failed to delete products');
    }
  };

  const columns = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'productId',
        key: 'productId',
        width: '5%',
      },
      {
        title: 'Tên sản phẩm',
        dataIndex: 'productName',
        key: 'productName',
        ellipsis: true,
        width: '20%',
      },
      {
        title: 'Thương hiệu',
        dataIndex: 'brandId',
        key: 'brandId',
        render: (brandId) => {
          const brand = brands.find((b) => b.brandId === brandId);
          return brand ? brand.brandName : '';
        },
      },
      {
        title: 'Giá mới nhất',
        dataIndex: 'newPrice',
        key: 'newPrice',
        render: (newPrice) => <CustomNumberFormat numStr={newPrice} />,
      },
      {
        title: 'Mô tả sản phẩm',
        dataIndex: 'description',
        key: 'description',
        render: (description) => (
          <Button onClick={() => handleOpenDescription(description)}>
            Xem mô tả
          </Button>
        ),
      },
      {
        title: 'Chi tiết',
        dataIndex: 'productId',
        render: (productId) => (
          <Button onClick={() => handleOpenDetailModal(productId)}>
            Xem chi tiết
          </Button>
        ),
      },
      {
        title: 'Trạng thái',
        dataIndex: 'isSelling',
        key: 'isSelling',
        render: (isSelling) => (
          <label
            className={
              isSelling ? 'badge bg-label-info' : 'badge bg-outline-warning'
            }
          >
            {isSelling ? 'Đang bán' : 'Ngừng bán'}
          </label>
        ),
      },
      {
        title: 'Hành động',
        dataIndex: 'productId',
        render: (productId) => (
          <Dropdown
            menu={{
              items: [
                {
                  key: 'edit',
                  label: 'Chỉnh Sửa',
                  icon: <i className='bx bx-edit me-1' />,
                  onClick: () => handleOpenEdit(productId),
                },
                {
                  key: 'delete',
                  label: 'Xóa',
                  icon: <i className='bx bx-trash me-1' />,
                  onClick: async () => {
                    await productAPI.deleteProduct(productId);
                    toast.success('Product deleted successfully');
                    setRefresh(!refresh);
                  },
                },
              ],
            }}
          >
            <Button className='dropdown-toggle hide-arrow btn-outline-secondary'>
              <DownOutlined />
            </Button>
          </Dropdown>
        ),
      },
    ],
    [brands, refresh],
  );

  return (
    <div className='container-fluid flex-grow-1 container-p-y'>
      <h4 className='font-bold py-3 mb-4 absolute top-5 z-10'>
        <span className='text-muted font-light'>Quản Lí /</span> Sản Phẩm
      </h4>
      <div className='card'>
        <div className='card-header flex items-center justify-between'>
          <h5 className='mb-0'>Sản Phẩm</h5>
          <div className='input-group w-1/4 flex'>
            <Input
              type='search'
              className='form-control'
              placeholder='Tìm kiếm sản phẩm...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              className='btn-primary h-[34px]'
              type='button'
              onClick={handleSearch}
            >
              <i className='bx bx-search text-3xl leading-none' />
            </Button>
          </div>
          <div className='float-right flex gap-2'>
            <Button onClick={handleDelete} danger>
              <i className='icon-trash'></i>
              Xóa Sản Phẩm
            </Button>
            <Button
              className='btn btn-primary flex'
              onClick={handleOpenCreateModal}
            >
              Tạo Mới Sản Phẩm
            </Button>
            <Button
              type='default'
              size='middle'
              onClick={() => setRefresh(!refresh)}
            >
              Làm Mới
            </Button>
            <Button onClick={() => setFiltersVisible(!filtersVisible)}>
              <i className='icon-filter'></i> Bộ Lọc <DownOutlined />
            </Button>
            <Button
              type='default'
              className='ml-2'
              onClick={() => {
                setFilteredBrands([]);
                setFilteredCategories([]);
              }}
            >
              <i className='icon-filter'></i> Đặt Lại Bộ Lọc
            </Button>
          </div>
        </div>
        <FilterProduct
          brands={brands}
          categories={categories}
          filtersVisible={filtersVisible}
          handleBrandChange={handleBrandChange}
          handleCategoryChange={handleCategoryChange}
        />
        <div className='table-responsive text-nowrap mt-2'>
          <ControlTable
            rowKey='productId'
            columns={columns}
            dataSource={currentData}
            selectedRowKeys={selectedProductIds}
            onChange={setSelectedProductIds}
            onRow={null}
            rowSelection={{
              selectedProductIds,
              setSelectedProductIds,
            }}
          />
        </div>
        <div className='flex justify-end p-3'>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredProducts.length}
            onChange={handlePageChange}
          />
        </div>
      </div>
      {editing && selectedProductEdit && (
        <EditProductForm
          form={editForm}
          isOpen={editing}
          setIsOpen={setEditing}
          productId={selectedProductEdit}
          isOk={handleOkEdit}
          isRefresh={setRefresh}
          setSelectedProductEdit={setSelectedProductEdit}
        />
      )}
      {isOpenModal && selectedDescription && (
        <DescriptionModal
          product={selectedDescription || { description: '' }}
          open={isOpenModal}
          onCancel={handleCloseEditDescription}
          initialValue={selectedDescription}
          onClose={handleCloseEditDescription}
          setIsOpenModal={setIsOpenModal}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      )}
      {isOpenCreateModal && (
        <ProductModal
          initialValue={'<h3>Xin Chào...!</h3>'}
          form={createForm}
          open={isOpenCreateModal}
          onOk={handleOkCreateProduct}
          onCancel={handleCancelCreateProduct}
          onFinish={handleFinishFormCreateProduct}
        />
      )}
      <ProductDetails
        brands={brands}
        categories={categories}
        detailModal={detailModal}
        handleCancelDetail={handleCancelDetail}
        handleOkDetail={handleOkDetail}
        productId={productId}
      />
      <ToastContainer />
    </div>
  );
};

export default ManageProduct;
