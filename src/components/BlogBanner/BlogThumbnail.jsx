import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import BlogAPI from "../../services/blog/blog";
import BlogCart from "./BlogCart";

const BlogThumbnail = ({ numberOfSlide, categoryId, width, height }) => {
  const [blogs, setBlogs] = useState([]);
  const [categoriesBlog, setCategoriesBlog] = useState([]);

  const fetchBlogs = async () => {
    try {
      const fetchedBlogs = await BlogAPI.fetchBlogs();
      setBlogs(fetchedBlogs.$values || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const fetchCategoryBlogs = async () => {
    try {
      const _categoriesBlog = await BlogAPI.fetchBlogCategories();
      setCategoriesBlog(_categoriesBlog.$values);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchCategoryBlogs();
  }, []); // Empty dependency array ensures fetchBlogs and fetchCategoryBlogs run only once

  const filteredBlogs = blogs.filter((blog) => blog.categoryId === categoryId);

  const getCategoryName = (categoryId) => {
    const category = categoriesBlog.find(
      (cat) => cat.categoryId === categoryId
    );
    return category ? category.categoryName : "";
  };

  return (
    <Swiper
      slidesPerView={numberOfSlide}
      spaceBetween={30}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      pagination={{ dynamicBullets: true }}
      modules={[Pagination, Autoplay]}
      className="rounded-[10px] h-fit "
    >
      {filteredBlogs.map((blog) => (
        <SwiperSlide key={blog.blogId}>
          <Link
            // to={`/${getCategoryName(blog.categoryId)}/${blog.titleName}`}
            to={`blog/${getCategoryName(blog.categoryId)}/${blog.titleName}`}
            className="block relative"
            style={{ width, height }}
            state={{
              blogId: blog.blogId,
              categoryName: getCategoryName(blog.categoryId), // Add categoryName to state
            }}
          >
            <img
              src="https://cdn1.concung.com/storage/data/2021/thong-tin-bo-ich/2024/05/do-choi-cho-be-3-tuoi-4.webp"
              // src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover self-center"
            />
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default BlogThumbnail;
