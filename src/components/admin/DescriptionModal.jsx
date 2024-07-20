import { Button, Modal } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import RichTextEditor from '../rich-text-editor/RichTextEditor';
import ReactHtmlParser from 'react-html-parser';
import { Bounce, Slide, toast } from 'react-toastify';
import { productAPI } from '../../services/product';

const DescriptionModal = ({
  product = { productId: '', description: '' },
  open,
  onCancel,
  initialValue = '',
  onClose,
  setIsOpenModal,
  refresh,
  setRefresh,
  btn = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialValue);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    setContent(initialValue);
  }, [initialValue]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setContent(initialValue);
  }, [initialValue]);

  const handleCloseEditor = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const handleEditorChange = useCallback((newContent) => {
    // console.log(newContent);
    setContent(newContent);
  }, []);

  const handleSave = useCallback(async () => {
    try {
      if (!product.productId) {
        return toast.error('Không tìm thấy sản phẩm!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          transition: Slide,
        });
      }
      if (content) {
        console.log(product);
        const { productId, description } = product;
        const trimmedContent = content.trim();
        setConfirmLoading(true);
        if (trimmedContent !== description) {
          // console.log(product);
          // console.log(productId);
          // console.log(`trimmedContent: ${trimmedContent}`); // track
          const response = await productAPI.updateProduct(productId, {
            description: trimmedContent,
          });
          // console.log(response);
          toast.success(response.message);
        }
        setRefresh(!refresh);
        setIsOpenModal(false);
      } else {
        toast.error('Description content cannot be empty!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error('Failed to update description:', error);
      toast.error('Failed to update description!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      });
    } finally {
      setConfirmLoading(false);
    }
  }, [content, product, refresh, setIsOpenModal, setRefresh]);

  return (
    <Modal
      open={open}
      onOk={handleSave}
      onCancel={onCancel}
      title='Mô tả sản phẩm'
      confirmLoading={confirmLoading}
      footer={
        isEditing ? (
          <>
            <Button
              key='save'
              type='primary'
              onClick={handleSave}
              loading={confirmLoading}
            >
              Save Changes
            </Button>
            <Button key='cancel' onClick={handleCancelEdit}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            {btn && (
              <Button key='edit' type='primary' onClick={handleEdit}>
                Edit
              </Button>
            )}
            <Button key='close' onClick={handleCloseEditor}>
              Close
            </Button>
          </>
        )
      }
      width={1000}
    >
      {isEditing ? (
        <RichTextEditor
          onChange={handleEditorChange}
          initialValue={content}
          onSave={handleSave}
        />
      ) : (
        content && ReactHtmlParser(content)
      )}
    </Modal>
  );
};

DescriptionModal.propTypes = {
  product: PropTypes.shape({
    productId: PropTypes.number.isRequired,
    description: PropTypes.string,
  }).isRequired,
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  initialValue: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  setIsOpenModal: PropTypes.func.isRequired,
  refresh: PropTypes.bool.isRequired,
  setRefresh: PropTypes.func.isRequired,
};

export default DescriptionModal;
