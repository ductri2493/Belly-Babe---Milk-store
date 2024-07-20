import { Button, Modal, Typography } from 'antd';
import { Suspense, useEffect, useState } from 'react';
import { Loading } from '../../loader/Loading';
import ReactHtmlParser from 'react-html-parser';
import { formatDate } from '../../../utils/utils';
import BlogCategoryAPI from '../../../services/blog/blog.category';

function BlogDetails({
  detailModal,
  handleOnCancelDetail,
  handleOnOkDetail,
  blog,
  customers,
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [blogCategories, setBlogCategories] = useState([]);

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  useEffect(() => {
    async function fetchBlogCategories() {
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
    fetchBlogCategories();
  }, []);

  return (
    <Modal
      open={detailModal}
      onCancel={handleOnCancelDetail}
      onOk={handleOnOkDetail}
      footer={[
        currentStep > 1 && (
          <Button key='Back' onClick={prevStep}>
            Quay lại
          </Button>
        ),
        currentStep < 2 && (
          <Button key='Next' type='primary' onClick={nextStep}>
            Tiếp theo
          </Button>
        ),
      ]}
    >
      <div className='modal-header'>
        <h3>Chi tiết bài viết</h3>
      </div>
      <div className='modal-body'>
        {currentStep === 1 && (
          <>
            <div className='form-group'>
              <label className='form-label'>Ngày tạo bài viết </label>
              <Typography>{formatDate(blog?.dateCreated)}</Typography>
            </div>
            <div className='form-group mt-3'>
              <label className='form-label'>Title: </label>
              <Typography>{blog?.titleName}</Typography>
            </div>
            <div className='form-group mt-3'>
              <label className='form-label'>Tác giả bài viết: </label>
              <Typography>
                {customers
                  ?.filter((customer) => customer.userId === blog.userId)
                  .map((customer) => customer.fullName)
                  .join(', ')}
              </Typography>
              <Typography>
                {customers
                  ?.filter((customer) => customer.userId === blog.userId)
                  .map((customer) => customer.userName)
                  .join(', ')}
              </Typography>
            </div>
            <div className='form-group mt-3'>
              <label className='form-label'>Phân loại bài viết: </label>
              <Typography>
                {blogCategories
                  ?.filter((category) => category.value === blog.categoryId)
                  .map((category) => category.label)
                  .join(', ')}
              </Typography>
            </div>
          </>
        )}
        {currentStep === 2 && (
          <div className='form-group mt-3'>
            <label className='form-label'>Nội dung bài viết: </label>
            <Typography>
              <Suspense fallback={<Loading />}>
                {blog.blogContent && ReactHtmlParser(blog.blogContent)}
              </Suspense>
            </Typography>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default BlogDetails;
