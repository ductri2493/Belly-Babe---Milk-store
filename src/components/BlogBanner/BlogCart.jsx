import React from "react";
import { Card, Image } from "antd";

const BlogCart = ({ blog }) => {
  return (
    <Card className="w-[22.3rem] h-[24rem] rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-lg hover:scale-105">
      <div className="relative w-[18rem] object-cover">
        <Image
          className=" rounded-t-lg mb-2" // Adjust height as needed
          src="https://cdn1.concung.com/storage/data/2021/thong-tin-bo-ich/2024/05/do-choi-cho-be-3-tuoi-4.webp"
          alt={blog.titleName}
          preview={false}
        />
      </div>
      <div className="text-left flex flex-col justify-between h-full">
        <h5 className="text-sm font-semibold text-gray-800 mt-2">
          <div className="line-clamp-2 ">{blog.titleName}</div>
        </h5>
        <div className="flex items-center justify-between mt-2 gap-1">
          <p className="text-[12px] text-gray-800 flex items-right">
            {blog.dateCreated}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default BlogCart;
