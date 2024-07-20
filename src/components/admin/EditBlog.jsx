/* eslint-disable no-unused-vars */
import { Button, Form, Input, Modal, Select } from 'antd';
import RichTextEditor from '../rich-text-editor/RichTextEditor';
import { Suspense, useCallback, useEffect, useState } from 'react';
import BlogCategoryAPI from '../../services/blog/blog.category';
import BlogAPI from '../../services/blog/blog';
import { toast } from 'react-toastify';
import UserAPI from '../../services/account/User';
import ReactHTMLParser from 'react-html-parser';
import dayjs from 'dayjs';

import 'dayjs/locale/en';

export default function EditBlog({
  blog,
  open,
  onCancel,
  onOk,
  form,
  isUpdate,
  setIsUpdate,
  confirmLoading,
}) {
  const [content, setContent] = useState(blog.blogContent || '');
  const [currentBlog, setCurrentBlog] = useState({
    userId: blog.userId,
    blogContent: blog.blogContent,
    categoryId: blog.categoryId,
    titleName: blog.titleName,
    dateCreated: blog.dateCreated,
  });
  const [formValues, setFormValues] = useState(currentBlog);
  const [currentStep, setCurrentStep] = useState(1);
  const [staffs, setStaffs] = useState([]);
  const [blogCategories, setBlogCategories] = useState([]);

  async function handleFetchingBlogCategories() {
    try {
      const response = await BlogCategoryAPI.fetchBlogsCategories();
      setBlogCategories(
        response.$values.map((item) => ({
          label: item.categoryName,
          value: item.categoryId,
        })),
      );
    } catch (error) {
      console.error('Error fetching blog categories:', error);
    }
  }

  async function handleFetchingStaffs() {
    try {
      const response = await UserAPI.fetchAccounts();
      const filteredStaffs = response.$values.filter(
        (item) => item.roleId !== 3,
      );
      setStaffs(
        filteredStaffs.map((item) => ({
          label: item.userName,
          value: item.userId,
        })),
      );
    } catch (error) {
      console.error('Error fetching staffs:', error);
    }
  }

  useEffect(() => {
    if (open) {
      handleFetchingBlogCategories();
      handleFetchingStaffs();
    }
    if (form && currentBlog) {
      form.setFieldsValue(currentBlog);
    }
  }, [currentBlog, form, open]);

  const handleOnFinish = async (values) => {
    try {
      const newDate = dayjs(new Date().toISOString());
      const finalValues = {
        ...values,
        ...formValues,
        blogContent: content,
        dateCreated: newDate,
      };
      await BlogAPI.updateBlog(blog.blogId, finalValues);

      form.resetFields();
      onCancel();
      toast.success('Blog updated successfully!');
      setIsUpdate(!isUpdate);
    } catch (err) {
      console.error('Error updating blog:', err);
      toast.error('Failed to update blog!');
    }
  };

  const handleChange = (value, field) => {
    setFormValues((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleOnChangeEditor = useCallback(
    (newContent) => {
      form.setFieldsValue({ blogContent: newContent });
      setContent(newContent);
    },
    [form],
  );

  const nextStep = () => {
    form
      .validateFields()
      .then((values) => {
        setFormValues((prevValues) => ({ ...prevValues, ...values }));
        setCurrentStep(currentStep + 1);
      })
      .catch((error) => {
        console.error('Validation Failed:', error);
      });
  };

  const prevStep = () => setCurrentStep(currentStep - 1);

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      confirmLoading={confirmLoading}
      title={'Edit Blog'}
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
          <Button key='Edit' type='primary' onClick={handleOnFinish}>
            Edit
          </Button>
        ),
      ]}
    >
      <Form form={form} layout='vertical' initialValues={currentBlog}>
        {currentStep === 1 && (
          <>
            <Form.Item label='Title' name='titleName'>
              <Input
                onChange={(e) => handleChange(e.target.value, 'titleName')}
              />
            </Form.Item>
            <Form.Item label='Category' name='categoryId'>
              <Select
                options={blogCategories}
                onChange={(value) => handleChange(value, 'categoryId')}
              />
            </Form.Item>
            <Form.Item label='Author' name='userId'>
              <Select
                options={staffs}
                onChange={(value) => handleChange(value, 'userId')}
              />
            </Form.Item>
          </>
        )}
        {currentStep === 2 && (
          <Suspense>
            <Form.Item label='Content' name='blogContent'>
              <RichTextEditor
                form={form}
                initialValue={content}
                onChange={handleOnChangeEditor}
              />
            </Form.Item>
          </Suspense>
        )}
        {currentStep === 3 && (
          <Form.Item label={'Preview'}>
            {content && ReactHTMLParser(content)}
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}
