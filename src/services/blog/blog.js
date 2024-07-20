import { instance } from "../instance";

const BlogAPI = {
  fetchBlogs: async () => {
    try {
      const blogs = await instance.get(`Blog/GetAllBlogs`);
      return blogs;
    } catch (err) {
      console.error(err);
    }
  },

  fetchBlogCategories: async () => {
    const blogs = await instance.get(`BlogCategory/GetBlogCategories`);
    return blogs;
  },

  fetchBlogId: async (params) => {
    try {
      const blog = await instance.get(`Blog/GetBlogById/${params}`);
      return blog;
    } catch (err) {
      console.error(err);
    }
  },

  fetchBlogCategory: async (params) => {
    try {
      const blog = await instance.get(`Blog/GetBlogsByCategory/${params}`);
      return blog;
    } catch (err) {
      console.error(err);
    }
  },
  fetchBlogUser: async (params) => {
    try {
      const blog = await instance.get(`Blog/GetBlogsByUserId/${params}`);
      return blog;
    } catch (err) {
      console.error(err);
    }
  },
  createBlog: async (data) => {
    try {
      const blog = await instance.post(`Blog/AddBlock`, null, {
        params: data,
      });
      return blog;
    } catch (err) {
      console.error(err);
    }
  },
  updateBlog: async (params, data) => {
    try {
      const blog = await instance.put(`Blog/UpdateBlog/${params}`, null, {
        params: data,
      });
      return blog;
    } catch (err) {
      console.error(err);
    }
  },
  deleteBlog: async (params) => {
    try {
      const blog = await instance.delete(`Blog/DeleteBlog/${params}`);
      return blog;
    } catch (err) {
      console.error(err);
    }
  },
};

export default BlogAPI;
