/* eslint-disable no-useless-escape */
import {
  Form,
  InputNumber,
  Button,
  Modal,
  Col,
  Row,
  Select,
  Upload,
} from 'antd';
import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import RichTextEditor from '../rich-text-editor/RichTextEditor';
const Loading = lazy(() => import('../loader/Loading'));
import ReactHtmlParser from 'react-html-parser';
import TextArea from 'antd/es/input/TextArea';
import BrandAPI from '../../services/brand';
import ProductCategory from '../../services/product/product.category';
import { UploadOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { uploadImage } from '../../utils/uploadImage';

const initialProductValue = {
  productName: '',
  description: '',
  quantity: 0,
  categoryName: '',
  oldPrice: 0,
  newPrice: 0,
  discount: 0,
  imageLinks: '',
};

export default function ProductModal({
  form,
  open,
  onOk,
  onCancel,
  onSave,
  onFinish,
  initialValue,
}) {
  const [content, setContent] = useState(initialValue?.description || '');
  const [currentStep, setCurrentStep] = useState(1);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [brandOptions, setBrandOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [formValues, setFormValues] = useState(initialProductValue);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [brandData, categoryData] = await Promise.all([
          BrandAPI.fetchBrands(),
          ProductCategory.fetchCategories(),
        ]);
        setBrandOptions(
          brandData?.$values.map(({ brandName, brandId }) => ({
            label: brandName,
            value: brandId,
          })) || [],
        );
        setCategoryOptions(
          categoryData?.$values.map(({ categoryName, categoryId }) => ({
            label: categoryName,
            value: categoryId,
          })) || [],
        );
      } catch (error) {
        console.error('Failed to fetch options:', error);
      }
    };

    if (open) fetchOptions();

    if (initialValue) {
      form.setFieldsValue(initialValue);
      setContent(initialValue.description || '');
      setFormValues(initialValue);
      setFileList(initialValue.imageLinks || []);
    } else {
      form.resetFields();
      setContent('');
      setFormValues(initialProductValue);
      setFileList([]);
    }
  }, [initialValue, form, open]);

  const handleEditorChange = useCallback(
    (newContent) => {
      form.setFieldsValue({ description: newContent });
      setContent(newContent);
      setFormValues((prevValues) => ({
        ...prevValues,
        description: newContent,
      }));
    },
    [form],
  );

  const handleSaveContent = useCallback(() => {
    if (content) {
      onSave(content.trim());
    } else {
      toast.warn('Content cannot be empty');
    }
  }, [content, onSave]);

  const handleCreate = useCallback(() => {
    setConfirmLoading(true);
    form
      .validateFields()
      .then((values) => {
        // console.log(values);
        const imageLinks = fileList
          .map(async (file) => {
            console.log('file', file.originFileObj);
            await uploadImage(file.originFileObj);
          })
          .join(',');
        const finalValues = {
          ...formValues,
          ...values,
          description: content,
          imageLinks,
        };
        console.log('finalValues', finalValues);
        return onFinish(finalValues);
      })
      .then(() => {
        setConfirmLoading(false);
        onOk?.();
      })
      .catch((error) => {
        console.error('Validation Failed:', error);
        setConfirmLoading(false);
      });
  }, [form, formValues, content, fileList, onFinish, onOk]);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  const nextStep = () => {
    form
      .validateFields()
      .then((values) => {
        setFormValues((prevValues) => ({ ...prevValues, ...values }));
        setCurrentStep((prev) => prev + 1);
      })
      .catch((error) => {
        console.error('Validation Failed:', error);
      });
  };

  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const handleImageChange = useCallback(({ fileList: newFileList }) => {
    setFileList(newFileList);
    setFormValues((prevValues) => ({
      ...prevValues,
      fileList: newFileList,
    }));
  }, []);

  return (
    <Modal
      title='Create New Product'
      open={open}
      onCancel={handleCancel}
      width='50vw'
      centered
      confirmLoading={confirmLoading}
      footer={[
        currentStep > 1 && (
          <Button key='Back' onClick={prevStep}>
            Back
          </Button>
        ),
        currentStep < 3 && (
          <Button key='Next' type='primary' onClick={nextStep}>
            Next
          </Button>
        ),
        currentStep === 3 && (
          <Button key='Create Product' type='primary' onClick={handleCreate}>
            Create Product
          </Button>
        ),
      ]}
    >
      <Form
        form={form}
        layout='vertical'
        initialValues={initialProductValue}
        autoComplete='off'
      >
        {currentStep === 1 && (
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={24} className='gutter-row'>
              <Form.Item
                name='productName'
                label='Product Name'
                rules={[
                  { required: true, message: 'Please enter the product name' },
                ]}
              >
                <TextArea autoSize />
              </Form.Item>
              <Row gutter={16}>
                <Col span={11}>
                  <Form.Item
                    name='brandId'
                    label='Brand Name'
                    rules={[
                      { required: true, message: 'Please select a brand' },
                    ]}
                  >
                    <Select options={brandOptions} />
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item
                    name='categoryId'
                    label='Category'
                    rules={[
                      { required: true, message: 'Please select a category' },
                    ]}
                  >
                    <Select options={categoryOptions} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
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
                    <InputNumber />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item name='newPrice' label='New Price'>
                    <InputNumber
                      min={0}
                      style={{ width: '100%' }}
                      formatter={(value) =>
                        `VND ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }
                      parser={(value) => value.replace(/\VND\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
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
                <Col span={11}>
                  <Form.Item
                    name={'fileList'}
                    label='Hình ảnh'
                    rules={[
                      {
                        required: true,
                        message: 'Please upload the main image',
                      },
                    ]}
                  >
                    <Upload
                      listType='picture'
                      fileList={fileList}
                      className='mr-2'
                      onChange={handleImageChange}
                    >
                      <Button icon={<UploadOutlined />} className='btn-primary'>
                        Upload Image
                      </Button>
                    </Upload>
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
              onSave={handleSaveContent}
              onChange={handleEditorChange}
              isBtnSave={false}
            />
          </Form.Item>
        )}
        {currentStep === 3 && (
          <>
            <h5 className='text-[#333] pb-4'>Preview</h5>
            <Suspense fallback={<Loading />}>
              {content && ReactHtmlParser(content)}
            </Suspense>
          </>
        )}
      </Form>
    </Modal>
  );
}
