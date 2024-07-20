import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BlogAPI from "../../services/blog/blog";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";

const BlogDetail = () => {
  const [blogData, setBlogData] = useState({
    blogId: 0,
    blogContent: "",
    categoryId: 0,
    dateCreated: "",
    titleName: "",
    image: "",
  });

  const [categoryBlog, setCategoryBlog] = useState({
    categoryId: 0,
    categoryName: "",
  });

  const { state } = useLocation();

  const getBlogById = async () => {
    try {
      const blogRes = await BlogAPI.fetchBlogId(state.blogId);
      setBlogData(blogRes);
    } catch (error) {
      console.error("Error fetching blog:", error);
    }
  };

  const getCategoryBlogById = async () => {
    try {
      const categoryRes = await BlogAPI.fetchBlogCategories(state.categoryBlog);
      setCategoryBlog(categoryRes);
    } catch (error) {
      console.error("Error fetching blog categories:", error);
    }
  };

  useEffect(() => {
    getBlogById();
    getCategoryBlogById();
  }, [state.blogId, state.categoryBlog]);

  return (
    <div className="py-8">
      {/* Breadcrumb */}
      <div className="bg-transparent ml-[230px]">
        <Breadcrumb />
      </div>
      {/* Blog Content */}
      <div className="max-w-4xl mx-auto px-4 ">
        <div className="p-4 bg-white rounded-[10px]">
          <h1 className="text-2xl font-extrabold mb-1 text-[#11111]">
            {blogData.titleName}
          </h1>
          <div className="text-sm mb-4">{blogData.dateCreated}</div>
          {blogData.image && (
            <img
              src={blogData.image}
              alt={blogData.titleName}
              className="w-full rounded-lg mb-4"
            />
          )}
          <p className="text-lg leading-relaxed mb-4">
            {blogData.blogContent}
          </p>
          {/* Additional content can be added here based on your blog structure */}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
