import React from "react";
import BlogThumbnail from "./BlogThumbnail";

const BlogContent = () => {
  return (
    <div className="flex flex-wrap">
      <div className="section w-full md:w-2/3 p-0 m-0">
        <BlogThumbnail
          numberOfSlide={1}
          categoryId={8}
          width="630px"
          height="300px"
        />
      </div>
      <div className="ml-0 pl-2 md:ml-15 w-full md:w-1/3">
        <div className="mb-[0.35rem]">
          <BlogThumbnail
            numberOfSlide={1}
            categoryId={1}
            width="335px"
            height="148px"
          />
        </div>
        <div>
          <BlogThumbnail
            numberOfSlide={1}
            categoryId={1}
            width="335px"
            height="148px"
          />
        </div>
      </div>
    </div>
  );
};

export default BlogContent;
