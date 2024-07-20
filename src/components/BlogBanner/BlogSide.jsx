import BlogThumbnail from "./BlogThumbnail";

const BlogSide = () => {
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
    </div>
  );
};

export default BlogSide;
