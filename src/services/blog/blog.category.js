import { instance } from "../instance";

const BlogCategoryAPI = {
    fetchBlogsCategories: async () => {
        try {
            const blogs = await instance.get(`BlogCategory/GetBlogCategories`)
            return blogs;
        }
        catch (err) {
            console.error(err);
        }
    },
    fetchBlogCategory: async (params) => {
        try {
            const blog = await instance.get(`BlogCategory/GetBlogCategoryById/${params}`)
            return blog;
        }
        catch (err) {
            console.error(err);
        }
    },
    createBlogCategory: async (data) => {
        try {
            const blog = await instance.post(`BlogCategory/AddBlogCategory`, data)
            return blog;
        }
        catch (err) {
            console.error(err);
        }
    },
    deleteBlogCategory: async (params) => {
        try {
            const blog = await instance.delete(`BlogCategory/DeleteBlogCategory/${params}`)
            return blog;
        }
        catch (err) {
            console.error(err);
        }
    },
    updateBlogCategory: async (params, data) => {
        try {
            const blog = await instance.put(`BlogCategory/UpdateBlogCategory/${params}`, data)
            return blog;
        }
        catch (err) {
            console.error(err);
        }
    }
}

export default BlogCategoryAPI;