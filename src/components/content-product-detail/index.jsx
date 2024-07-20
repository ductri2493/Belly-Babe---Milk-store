import ReactHtmlParser from "react-html-parser";

const ContentProduct = ({ contentInfo }) => {
  return (
    <div className='section-page w-[900px] p-6 mt-4 rounded-2xl bg-white'>
      <div className='content-product'>
        {contentInfo && ReactHtmlParser(contentInfo)}
      </div>
    </div>
  );
};

export default ContentProduct;
