import React, { useEffect, useState } from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link as RouterLink, useLocation, useParams } from "react-router-dom";

const breadcrumbNameMap = {
  "/": "Trang chủ",
  "/category": "Danh mục",
  "/cart": "Giỏ hàng",
  "/checkout": "Thanh toán",
  "/login": "Đăng nhập",
  "/register": "Đăng ký",
  "/profile": "Thông tin cá nhân",
  "/order": "Đơn hàng",
  "/blog": "Bài viết"
};

const toTitleCase = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const Breadcrumb = () => {
  const location = useLocation();
  const { category, product_title, categoryBlogs, titleName } = useParams();
  const [pathnames, setPathnames] = useState([]);

  useEffect(() => {
    setPathnames(location.pathname.split("/").filter((x) => x));
  }, [location]);

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
      className="bg-transparent ml-16 pt-2 text-sm list-none rounded pr-0 text-[inherit] no-underline"
      sx={{
        backgroundColor: "transparent",
        textDecoration: "none",
        listStyle: "none",
      }}
    >
      {/* Home */}
      <Link
        component={RouterLink}
        to="/"
        color="inherit"
        className="no-underline text-[#8a45ab]"
        sx={{ textDecoration: "none" }}
      >
        {breadcrumbNameMap["/"]}
      </Link>

      {/* Category */}
      {category && (
        <Link
          component={RouterLink}
          to={`/category/${encodeURIComponent(category)}`} // Ensure proper encoding
          color="inherit"
          className="no-underline text-[#8a45ab]"
          sx={{ textDecoration: "none" }}
        >
          {decodeURIComponent(category)}
        </Link>
      )}

      {/* Product */}
      {product_title && (
        <Typography
          color="text.primary"
          sx={{ textDecoration: "none" }}
          className="no-underline text-sm text-[#8a45ab]"
        >
          {toTitleCase(product_title)}
        </Typography>
      )}

      {/* Blog Category */}
      {categoryBlogs && (
        <Link
          component={RouterLink}
          to={`/blog/${encodeURIComponent(categoryBlogs)}`} // Ensure proper encoding
          color="inherit"
          className="no-underline text-[#8a45ab]"
          sx={{ textDecoration: "none" }}
        >
          {decodeURIComponent(categoryBlogs)}
        </Link>
      )}

      {/* Blog Title */}
      {titleName && (
        <Typography
          color="text.primary"
          sx={{ textDecoration: "none" }}
          className="no-underline text-sm text-[#8a45ab]"
        >
          {toTitleCase(decodeURIComponent(titleName))}
        </Typography>
      )}
    </Breadcrumbs>
  );
};

export default Breadcrumb;
