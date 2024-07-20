import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import BlogAPI from "../../services/blog/blog";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import BlogCart from "../../components/BlogBanner/BlogCart";

const BlogCategoryPage = ({ width, height }) => {
    const { categoryBlogs } = useParams();
    const [blogs, setBlogs] = useState([]);
    const [categoriesBlog, setCategoriesBlog] = useState([]);

    useEffect(() => {
        const fetchCategoryBlogs = async () => {
            try {
                const _categoriesBlog = await BlogAPI.fetchBlogCategories();
                setCategoriesBlog(_categoriesBlog.$values || []);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategoryBlogs();
    }, []);

    useEffect(() => {
        if (categoriesBlog.length > 0) {
            const allBlogs = categoriesBlog.flatMap((category) =>
                category.blogs?.$values || []
            );
            const currentCategoryBlogs = allBlogs.filter((blog) => {
                const categoryName = getCategoryName(blog.categoryId).trim();
                return categoryName === categoryBlogs;
            });
            setBlogs(currentCategoryBlogs);
        }
    }, [categoriesBlog, categoryBlogs]);

    const getCategoryName = (categoryId) => {
        const category = categoriesBlog.find((cat) => cat.categoryId === categoryId);
        if (category) {
            if (category.categoryId !== null) {
                const parentCategory = categoriesBlog.find(
                    (cat) => cat.categoryId === category.categoryId
                );
                return `${parentCategory.categoryName}`;
            } else {
                return category ? category.categoryName : "";
            }
        }
        return "Unknown";
    };

    return (
        <div className="main-content bg-[#f5f7fd]">
            {/* Breadcrumb */}
            <div className="bg-transparent ml-[90px]">
                <Breadcrumb />
            </div>
            {/* Container */}
            <div className="container mx-auto w-full">
                <div className="flex mx-[20px]">
                    {/* Homepage Content */}
                    <div className="block w-full">
                        {/* Blog content */}
                        <div className="container section-page bg-[#E1CDE9] p-8 rounded-2xl mb-4">
                            <div className="header-title pb-6 space flex justify-between">
                                {/* <h2 className="text-2xl font-bold inline-block">Các bài viết </h2> */}
                            </div>
                            <div className="gap-3.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                                {blogs.map((blog) => (
                                    <div key={blog.blogId} className="col-md-6 col-lg-4 mb-3">
                                        <Link
                                            to={`/blog/${encodeURIComponent(
                                                getCategoryName(blog.categoryId)
                                            )}/${encodeURIComponent(blog.titleName)}`}
                                            className="block relative"
                                            style={{ width, height }}
                                            state={{ blogId: blog.blogId }}
                                        >
                                            <BlogCart blog={blog} /> {/* Pass blog as prop */}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Blog content */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogCategoryPage;
