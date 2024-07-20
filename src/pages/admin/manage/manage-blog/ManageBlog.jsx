import { useEffect, useMemo, useState } from 'react';
import Layout from '../Layout';
import { Button, Dropdown, Typography } from 'antd';
import BlogAPI from '../../../../services/blog/blog';
import { useForm } from 'antd/es/form/Form';
import BlogModal from '../../../../components/admin/BlogModal';
import EditBlog from '../../../../components/admin/EditBlog';
import ReactHTMLParser from 'react-html-parser';
import UserAPI from '../../../../services/account/User';
import { toast, ToastContainer } from 'react-toastify';
import { DownOutlined } from '@ant-design/icons';
import BlogDetails from '../../../../components/admin/details/BlogDetails';
import { formatDate } from '../../../../utils/utils';

export default function ManageBlog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParameters] = useState([
    'blogContent',
    'categoryName',
    'titleName',
    'dateCreated',
    'userName',
  ]);
  const [blogs, setBlogs] = useState([]);
  const [blog, setBlog] = useState({});
  const [selectedBlogEdit, setSelectedBlogEdit] = useState({});
  const [selectedBlogIds, setSelectedBlogIds] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [form] = useForm();
  const [editForm] = useForm();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);

  async function handleFetchingData() {
    try {
      const _blogs = await BlogAPI.fetchBlogs();
      if (_blogs) {
        setBlogs(_blogs.$values);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleFetchingUsers() {
    try {
      const _users = await UserAPI.fetchAccounts();
      if (_users) {
        setUsers(_users.$values);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    handleFetchingData();
    handleFetchingUsers();
  }, [isUpdate]);

  const columns = useMemo(() => {
    return [
      {
        title: 'Id',
        dataIndex: 'blogId',
        key: 'blogId',
        width: '5%',
      },
      {
        title: 'Tác giả',
        dataIndex: 'userId',
        key: 'userId',
        ellipsis: true,
        render: (userId) => {
          const user = users.find((user) => user.userId === userId);
          return user?.userName;
        },
        width: '10%',
      },
      {
        title: 'Tiêu đề',
        dataIndex: 'titleName',
        key: 'titleName',
        ellipsis: true,
      },
      {
        title: 'Nội dung bài viết',
        dataIndex: 'blogId',
        key: 'blogId',
        ellipsis: true,
        with: '25%',
        render: (blogId) => {
          const blog = blogs.find((blog) => blog.blogId === blogId);
          return (
            <Typography.Link onClick={() => handleOpenDetail(blog)}>
              {blog?.blogContent && ReactHTMLParser(blog.blogContent)}
            </Typography.Link>
          );
        },
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'dateCreated',
        key: 'dateCreated',
        width: '15%',
        render: (dateCreated) => <span>{formatDate(dateCreated)}</span>,
      },
      {
        title: 'Thao tác',
        dataIndex: 'blogId',
        width: '7%',
        render: (blogId) => {
          return (
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'edit',
                    label: 'Chỉnh Sửa',
                    icon: <i className='bx bx-edit me-1' />,
                    onClick: () =>
                      handleOpenEdit(
                        blogs.find((blog) => blog.blogId === blogId),
                      ),
                  },
                  {
                    key: 'delete',
                    label: 'Xóa',
                    icon: <i className='bx bx-trash me-1' />,
                    onClick: async () => {
                      await BlogAPI.deleteBlog(blogId);
                      toast.success('Product deleted successfully');
                      setIsUpdate(!isUpdate);
                    },
                  },
                ],
              }}
            >
              <Button className='dropdown-toggle hide-arrow btn-outline-secondary'>
                <DownOutlined />
              </Button>
            </Dropdown>
          );
        },
      },
    ];
  }, [blogs, isUpdate, users]);

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleSearch = (values) => {
    return values.filter((value) => {
      return searchParameters.some((newValue) => {
        return value[newValue]
          ? value[newValue]
              .toString()
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          : false;
      });
    });
  };

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return blogs.slice(start, end);
  }, [currentPage, pageSize, blogs]);

  const dataSearch = handleSearch(Object.values(currentData));

  function handleOpenEdit(blog) {
    setSelectedBlogEdit(blog);
    setIsEditOpen(true);
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async () => {
    const ids = selectedBlogIds;
    if (!ids.length) return;
    try {
      const _ids = ids.map((id) => id);
      await Promise.all(
        _ids.map((id) =>
          BlogAPI.deleteBlog(id)
            .then(() => {
              toast.success('Deleted blog successfully!');
              setBlogs(blogs.filter((item) => item.blogId !== id));
              setIsUpdate(!isUpdate);
            })
            .catch((error) => {
              console.error('Error deleting blog:', error);
              toast.error('Failed to delete blog!');
            }),
        ),
      );
    } catch (error) {
      console.error('Failed to delete items', error);
    }
  };

  const handleRefresh = () => {
    setIsUpdate((prev) => !prev);
  };

  const handleCancel = () => {
    setIsOpenModal(false);
  };

  const handleEditCancel = () => {
    setIsEditOpen(false);
  };

  const handleOk = () => {
    form.submit();
    handleCancel();
  };

  const handleEditOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      editForm.submit();
      handleEditCancel();
      setConfirmLoading(false);
    }, 2000);
  };

  const handleOpenDetail = (blog) => {
    setOpenDetailModal(true);
    setBlog(blog);
  };

  const handleCancelDetail = () => {
    setOpenDetailModal(false);
    setBlog({});
  };

  const handleOkDetail = () => {
    setOpenDetailModal(false);
    setBlog({});
  };

  const handleOnFinish = async (values) => {
    try {
      await BlogAPI.createBlog(values).then(() => {
        toast.success('Blog created successfully!');
        handleCancel();
        form.resetFields();
        setIsUpdate(!isUpdate);
      });
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  return (
    <>
      <Layout
        currentPage={currentPage}
        data={blogs}
        deleteMultiple={handleDelete}
        handleOpenModal={handleOpenModal}
        handlePageChange={handlePageChange}
        handleRefresh={handleRefresh}
        handleSearch={handleSearch}
        name={'Bài viết'}
        pageSize={pageSize}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        columns={columns}
        dataSource={dataSearch}
        rowKey={'blogId'}
        rowSelection={{
          selectedBlogIds,
          setSelectedBlogIds,
        }}
        onRow={null}
      />

      <ToastContainer />
      {isOpenModal && (
        <BlogModal
          form={form}
          open={isOpenModal}
          onOk={handleOk}
          onCancel={handleCancel}
          onFinish={handleOnFinish}
        />
      )}
      {isEditOpen && selectedBlogEdit && (
        <EditBlog
          blog={selectedBlogEdit}
          form={editForm}
          isUpdate={isUpdate}
          setIsUpdate={setIsUpdate}
          onCancel={handleEditCancel}
          onOk={handleEditOk}
          open={isEditOpen}
          confirmLoading={confirmLoading}
        />
      )}
      <BlogDetails
        blog={blog}
        customers={users}
        detailModal={openDetailModal}
        handleOnCancelDetail={handleCancelDetail}
        handleOnOkDetail={handleOkDetail}
      />
    </>
  );
}
