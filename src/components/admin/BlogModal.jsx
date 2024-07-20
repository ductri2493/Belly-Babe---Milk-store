import { Button, Form, Input, Modal, Select } from 'antd';
import { Suspense, useCallback, useEffect, useState } from 'react';
import BlogCategoryAPI from '../../services/blog/blog.category';
import UserAPI from '../../services/account/User';
import RichTextEditor from '../rich-text-editor/RichTextEditor';
import ReactHTMlParser from 'react-html-parser';
import { toast, ToastContainer } from 'react-toastify';
import dayjs from 'dayjs';

import 'dayjs/locale/vi';

const initialValue = {
  blogContent: '',
  titleName: '',
  dateCreated: dayjs(new Date().toISOString()),
};

function BlogModal({ onCancel, onOk, open, form, onFinish }) {
  const [content, setContent] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [staffs, setStaffs] = useState([]);
  const [blogCategories, setBlogCategories] = useState([]);
  const [formValue, setFormValue] = useState(initialValue);

  async function handleFetchingBlogCategories() {
    // Fetch blog categories
    const data = await BlogCategoryAPI.fetchBlogsCategories().then(
      (response) => {
        setBlogCategories(
          response.$values.map((item) => ({
            label: item.categoryName,
            value: item.categoryId,
          })),
        );
      },
    );
  }

  async function handleFetchingStaffs() {
    // Fetch staffs
    const data = await UserAPI.fetchAccounts().then((response) => {
      const _data = response.$values.filter((item) => item.roleId !== 3);
      setStaffs(
        _data.map((item) => ({
          label: item.userName,
          value: item.userId,
        })),
      );
    });
  }

  useEffect(() => {
    if (open) {
      handleFetchingBlogCategories();
      handleFetchingStaffs();
    }
  }, [open]);

  function handleOnCancel() {
    if (onCancel) {
      onCancel();
    }
  }

  function handleOnOk() {
    setConfirmLoading(true);
    setTimeout(() => {
      if (onOk) {
        onOk();
      }
      setConfirmLoading(false);
    }, 2000);
  }

  const handleOnChangeEditor = useCallback(
    (value) => {
      form && form.setFieldsValue({ blogContent: value });
      setContent(value);
      setFormValue((prevValues) => ({
        ...prevValues,
        blogContent: value,
      }));
    },
    [form],
  );

  function handleOnCreate() {
    form
      .validateFields()
      .then((values) => {
        const finalValues = { ...formValue, ...values, blogContent: content };
        console.log(finalValues);
        return finalValues && onFinish(finalValues);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });
  }

  const nextStep = () => {
    form
      .validateFields()
      .then((values) => {
        setFormValue((prevValues) => ({ ...prevValues, ...values }));
        setCurrentStep(currentStep + 1);
      })
      .catch((error) => {
        console.error('Validation Failed:', error);
      });
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div>
      <Modal
        title='Tạo mới bài viết'
        confirmLoading={confirmLoading}
        onCancel={handleOnCancel}
        onOk={handleOnOk}
        open={open}
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
            <Button
              key='Tạo mới'
              type='primary'
              className=''
              onClick={handleOnCreate}
            >
              Create Product
            </Button>
          ),
        ]}
      >
        <Form form={form} layout='vertical' initialValues={initialValue}>
          {currentStep === 1 && (
            <>
              <Form.Item
                label='Title'
                name='titleName'
                rules={[
                  {
                    required: true,
                    message: 'Please input the title!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Form.Item
                  label='Category'
                  name='categoryId'
                  rules={[
                    {
                      required: true,
                      message: 'Please select the category!',
                    },
                  ]}
                >
                  <Select options={blogCategories} />
                </Form.Item>
              </Form.Item>
              <Form.Item>
                <Form.Item
                  label='Author'
                  name='userId'
                  rules={[
                    {
                      required: true,
                      message: 'Please select the author!',
                    },
                  ]}
                >
                  <Select options={staffs} />
                </Form.Item>
              </Form.Item>
            </>
          )}
          {currentStep === 2 && (
            <Suspense>
              <Form.Item
                label='Nội dung'
                name='blogContent'
                rules={[
                  {
                    required: true,
                    message: 'Please input the content!',
                  },
                ]}
              >
                <RichTextEditor
                  form={form}
                  initialValue={content}
                  onChange={handleOnChangeEditor}
                />
              </Form.Item>
            </Suspense>
          )}
          {currentStep === 3 && (
            <Form.Item label={'Xem trước'}>
              {content && ReactHTMlParser(content)}
            </Form.Item>
          )}
        </Form>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default BlogModal;
