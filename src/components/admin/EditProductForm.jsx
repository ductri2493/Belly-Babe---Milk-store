/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
import { Button, Col, Form, InputNumber, Modal, Row, Select } from 'antd';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { productAPI } from '../../services/product';
import TextArea from 'antd/es/input/TextArea';
import RichTextEditor from '../rich-text-editor/RichTextEditor';
import { Loading } from '../loader/Loading';
import ReactHtmlParser from 'react-html-parser';
import UploadImage from '../UploadImage';
import BrandAPI from '../../services/brand';
import ProductCategory from '../../services/product/product.category';
import { toast } from 'react-toastify';

const EditProductForm = ({
  productId,
  isOpen,
  setIsOpen,
  form,
  isOk,
  isRefresh,
  setSelectedProductEdit,
}) => {
  const [currentProduct, setCurrentProduct] = useState({});
  const [brandOptions, setBrandOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [content, setContent] = useState('');

  const handleChange = (value, field) => {
    form.setFieldsValue({ [field]: value });
  };

  const fetchProductData = async (productId) => {
    try {
      const data = await productAPI.fetchProduct(productId);
      if (data) {
        setCurrentProduct(data);
        form.setFieldsValue(data);
        setContent(data.description || '');
      }
    } catch (error) {
      console.error('Failed to fetch product: ', error);
      toast.error('Failed to fetch product data');
    }
  };

  const fetchBrands = async () => {
    try {
      const data = await BrandAPI.fetchBrands();
      if (data) {
        setBrandOptions(
          data.$values.map((item) => ({
            label: item.brandName,
            value: item.brandId,
          })),
        );
      }
    } catch (error) {
      console.error('Failed to fetch brands: ', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await ProductCategory.fetchCategories();
      if (data) {
        setCategoryOptions(
          data.$values.map((item) => ({
            label: item.categoryName,
            value: item.categoryId,
          })),
        );
      }
    } catch (error) {
      console.error('Failed to fetch categories: ', error);
    }
  };

  const handleEditorChange = useCallback(
    (newContent) => {
      form.setFieldsValue({ description: newContent });
      setContent(newContent);
    },
    [form],
  );

  const handleCancel = () => {
    setIsOpen(false);
    setSelectedProductEdit(null);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    if (isOk) isOk();
    setTimeout(() => {
      setIsOpen(false);
      setSelectedProductEdit(null);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleSubmitAndRedirect = async () => {
    try {
      const values = await form.validateFields();
      const finalValues = { ...values, description: content };
      await productAPI.updateProduct(productId, finalValues);
      toast.success('Product updated successfully');
      setIsOpen(false);
      if (isRefresh) isRefresh();
    } catch (error) {
      console.error('Failed to update product:', error);
      toast.error('Failed to update product');
    }
  };

  const nextStep = async () => {
    try {
      const values = await form.validateFields();
      setCurrentStep((prevStep) => prevStep + 1);
    } catch (error) {
      console.error('Validation Failed:', error);
    }
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  useEffect(() => {
    if (isOpen) {
      fetchBrands();
      fetchCategories();
      if (productId) fetchProductData(productId);
    }
  }, [isOpen, productId]);

  return (
    <Modal
      title='Chỉnh sửa sản phẩm'
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width='50vw'
      centered
      confirmLoading={confirmLoading}
      footer={[
        currentStep > 1 && (
          <Button key='Back' onClick={prevStep}>
            Quay lại
          </Button>
        ),
        currentStep < 3 && (
          <Button key='Next' type='primary' onClick={nextStep}>
            Tiếp theo
          </Button>
        ),
        currentStep === 3 && (
          <Button key='Submit' type='primary' onClick={handleSubmitAndRedirect}>
            Chỉnh sửa sản phẩm
          </Button>
        ),
      ]}
    >
      <Form
        form={form}
        layout='vertical'
        initialValues={currentProduct}
        autoComplete='off'
      >
        {currentStep === 1 && (
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={24}>
              <Form.Item
                name='productName'
                label='Product Name'
                rules={[
                  { required: true, message: 'Please enter the product name' },
                ]}
              >
                <TextArea
                  autoSize
                  onChange={(e) => handleChange(e.target.value, 'productName')}
                />
              </Form.Item>
              <Row>
                <Col span={11}>
                  <Form.Item
                    name='brandId'
                    label='Brand Name'
                    rules={[
                      { required: true, message: 'Please select a brand' },
                    ]}
                  >
                    <Select
                      options={brandOptions}
                      onChange={(value) => handleChange(value, 'brandId')}
                    />
                  </Form.Item>
                </Col>
                <Col span={2} />
                <Col span={11}>
                  <Form.Item
                    name='categoryId'
                    label='Category'
                    rules={[
                      { required: true, message: 'Please select a category' },
                    ]}
                  >
                    <Select
                      options={categoryOptions}
                      onChange={(value) => handleChange(value, 'categoryId')}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <Form.Item
                    name='discount'
                    label='Discount'
                    rules={[
                      {
                        type: 'number',
                        min: 0,
                        message: 'Discount cannot be less than 0',
                      },
                      {
                        type: 'number',
                        max: 100,
                        message: 'Discount cannot be more than 100',
                      },
                    ]}
                  >
                    <InputNumber
                      onChange={(value) => handleChange(value, 'discount')}
                    />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item name='newPrice' label='New Price'>
                    <InputNumber
                      onChange={(value) => handleChange(value, 'newPrice')}
                      min={0}
                      style={{ width: '100%' }}
                      formatter={(value) =>
                        `VND ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }
                      parser={(value) => value.replace(/\VND\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
                <Col span={2} />
                <Col span={5}>
                  <Form.Item
                    name='oldPrice'
                    label='Old Price'
                    rules={[
                      { required: true, message: 'Please enter the old price' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (value < getFieldValue('newPrice')) {
                            return Promise.reject(
                              new Error(
                                'Old price should not be less than new price',
                              ),
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <InputNumber
                      onChange={(value) => handleChange(value, 'oldPrice')}
                      min={0}
                      style={{ width: '100%' }}
                      formatter={(value) =>
                        `VND ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }
                      parser={(value) => value.replace(/\VND\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <Form.Item name='imageLinks' label='Hình Ảnh Chính'>
                    <UploadImage />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
        )}
        {currentStep === 2 && (
          <Form.Item
            name='description'
            label='Product Description'
            rules={[
              {
                required: true,
                message: 'Please enter the product description',
              },
            ]}
          >
            <RichTextEditor
              form={form}
              initialValue={content}
              onChange={handleEditorChange}
              isBtnSave={false}
            />
          </Form.Item>
        )}
        {currentStep === 3 && (
          <>
            <h5 className='text-[#333] pb-4'>Xem Trước</h5>
            <Suspense fallback={<Loading />}>
              {ReactHtmlParser(content)}
            </Suspense>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default EditProductForm;
