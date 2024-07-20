import Thumbnails from "../../components/slider/Thumbnails";
import { Button, ConfigProvider, Image, Input, message } from "antd";
import { TinyColor } from "@ctrl/tinycolor";
// import assets
import star from '../../assets/images/star.png';
import { useCallback, useContext, useEffect, useState } from 'react';
import CustomNumberFormat from '../../utils/CustomNumberFormat';
import Breadcrumb from '../../components/breadcrumb/Breadcrumb';
import Voucher from '../../components/voucher';
import Rating from '../../components/rating';
import ContentProduct from '../../components/content-product-detail';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
// import { useDispatch } from "react-redux";
// import { addToCart } from "../../components/cart/CartSlice"    ;
//import react-toasity
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import CartContext
import { CartContext } from '../../context/CartContext';
//import servicelay
import { productAPI } from "../../services/product";
import Brand from "../../components/brand";
import BrandAPI from "../../services/brand";
import { AuthContext } from "../../context/AuthContextUser";
import FeedbackAPI from "../../services/feedback/feedback";
import PopupPreorder from "../../components/popuppreorder/PopupPreorder";
import ChatBot from "../../components/chatbox/ChatBot";

const ProductDetails = () => {
  document.title = 'Thông Tin Chi Tiết Sản Phẩm';
  window.scrollTo(0, 0);

  const [productData, setProductData] = useState({
    productId: 0,
    productName: '',
    description: '',
    newPrice: 0,
    oldPrice: 0,
    imageLinks: '',
    brandId: '',
    rating: 0,
    feedback: 0,
    discount: 0,
    category: '',
    quantity: 0,
  });

  const [brandData, setBrandData] = useState({
    brandId: '',
    brandName: '',
    imgBrand: '',
  });

  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const getProductById = async () => {
    try {
      const productRes = await productAPI.fetchProduct(state.id);
      const _productRes = productRes;
      // console.log(_productRes)
      setProductData(_productRes);
      setProductQuantity(productRes.quantity > 0 ? 1 : 0); // Initialize productQuantity based on productData
      // rest of the code
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };
  const getBrandById = async () => {
    try {
      const brandRes = await BrandAPI.fetchBrand(state.brandId);
      const _brandRes = brandRes;
      setBrandData(_brandRes);
    } catch (error) {
      console.error('Error fetching brand:', error);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    getProductById();
    getBrandById();
  }, [state.id, state.brandId]);


  const [feedbacks, setFeedbacks] = useState([]);
  const totalReviews = feedbacks.length;
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await FeedbackAPI.feedbackByProductId(productData.productId);
        if (response && response.$values.length > 0) {
          const allFeedbacks = response.$values.flatMap(item => item.feedbacks.$values);
          setFeedbacks(allFeedbacks);
        } else {
          console.error("Invalid feedback response format:", response);
          setFeedbacks([]);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setFeedbacks([]);
      }
    };

    if (productData.productId) {
      fetchFeedbacks();
    }
  }, [productData.productId]);

  // const calculateRating = (cumulativeScores) => {
  //   if (cumulativeScores && cumulativeScores.length > 0) {
  //     const totalScore = cumulativeScores.reduce(
  //       (acc, score) => acc + score,
  //       0
  //     );
  //     return totalScore / cumulativeScores.length;
  //   }
  //   return 0;
  // };
  const [priceAfterDiscount, setPriceAfterDiscount] = useState(0);

  useEffect(() => {
    if (productData.oldPrice && productData.discount >= 0) {
      setPriceAfterDiscount(
        productData.oldPrice -
          productData.oldPrice * (productData.discount / 100),
      );
    }
  }, [productData]);

  // import color
  const colors1 = ['#6253E1', '#04BEFE'];
  const colors2 = ['#ce93d8', '#ab47bc'];
  // gradient color
  const getHoverColors = (colors) =>
    colors.map((color) => new TinyColor(color).lighten(5).toString());
  const getActiveColors = (colors) =>
    colors.map((color) => new TinyColor(color).darken(5).toString());

  const [productQuantity, setProductQuantity] = useState(1);

  const increment = () => {
    setProductQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrement = () => {
    setProductQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  };

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handlePreOrder = async (phoneNumber, email) => {
    const userId = localStorage.getItem("userId");
    const productId = productData.productId;
    const productName = productData.productName;
    if (!userId) {
      message.error("Vui lòng đăng nhập trước khi đặt hàng trước.");
      return;
    }
    const dataPreOrder = {
      userId,
      productId,
      productName,
      phoneNumber,
      email
    }

    try {
      const response = await productAPI.preOrder(dataPreOrder);
      message.success("Đặt trước thành công!");
      console.log("Pre-order successful:", response);
      // Add further handling after successful pre-order, such as displaying a notification
    } catch (error) {
      message.error("Đặt trước thất bại!");
      console.error("Pre-order failed:", error);
      // Add error handling if necessary
    }
  };

  const [rating, setRating] = useState(0); // State for the product rating

  const ratingStars = [...Array(Math.min(Math.round(rating), 5))].map(
    (_, i) => (
      <Image
        key={i}
        width={15}
        height={15}
        className="mr-1  align-middle"
        src={star}
        alt="Rating Star"
        loading="lazy"
        preview={false}
      />
    )
  );

  useEffect(() => {
    let isMounted = true; // Track if component is mounted
    const fetchRating = async () => {
      const currentProductId = productData.productId;
      try {
        const response = await FeedbackAPI.ratingProduct(currentProductId);
        // Update rating only if the component is still mounted
        if (isMounted) {
          setRating(response || 0); // Set rating directly, default to 0 if undefined
        }
      } catch (error) {
        console.error("Error fetching rating:", error);
        if (isMounted) {
          setRating(0); // Set rating to 0 on error
        }
      }
    };
    fetchRating();
    // Cleanup function to set isMounted to false on unmount
    return () => {
      isMounted = false;
    };
  }, [productData.productId]);
  // addToCart
  const { handleAddToCart, handlePurchaseNow } = useContext(CartContext);

  const handleButtonAction = useCallback(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: location.pathname,
          id: state.id,
          brandId: state.brandId,
        },
      });
    } else {
      handleAddToCart({ ...productData, quantity: productQuantity });
    }
  }, [
    isAuthenticated,
    navigate,
    location.pathname,
    state.id,
    state.brandId,
    handleAddToCart,
    productData,
    productQuantity,
  ]);

  //buy now
  const handleBuyNow = useCallback(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: location.pathname,
          id: state.id,
          brandId: state.brandId,
        },
      });
    } else {
      handlePurchaseNow({ ...productData, quantity: productQuantity });
      navigate("/cart", { state: { productId: productData.productId } });
    }
  }, [
    isAuthenticated,
    location.pathname,
    state.id,
    state.brandId,
    handlePurchaseNow,
    navigate,
    productData,
    productQuantity,
  ]);

  return (
    <div className='bg-[#F5F7FD] text-left'>
      {/* breadcrumb  */}
      <div className='isolate block'>
        <div className='container mx-auto'>
          <div className='m-0 flex flex-wrap'>
            <div className='max-w-[initial] bg-transparent justify-between p-0 mb-0 flex'>
              <Breadcrumb />
            </div>
          </div>
        </div>
      </div>
      {/* main content */}
      <div className='relative min-h-[calc(100vh-490px)] container'>
        {/* product-details */}
        <div className='pb-4 mx-[calc(100vw-1400px)]'>
          {/* container */}
          <div className='container flex p-[20px] rounded-xl bg-[#fff]'>
            {/* container left image*/}
            <div className='w-[445px] mr-[30px]'>
              {/* thumbnail */}
              <div className='relative block'>
                <Thumbnails
                  images={productData?.imageLinks}
                  numberOfMainSlide={1}
                  numberOfSubSlide={4}
                />
              </div>
            </div>
            <div className='ml-[30px] pt-1 text-base leading-4'>
              {/* brand */}
              <h2 className='leading-4 text-base font-semibold mb-[10px] text-[#404040]'>
                Thương Hiệu:
                <Link
                  to={`/brand/${brandData?.brandName}`}
                  state={{
                    brandId: brandData?.brandId,
                    brandName: brandData?.brandName,
                    imageBrand: brandData?.imageBrand,
                  }}
                  className='text-[#ab47bc] no-underline'
                >
                  <span className='px-1'>{brandData?.brandName}</span>
                </Link>
              </h2>
              <div className='flex'>
                {/* title */}
                <h1 className='mb-3 leading-7 text-[#111] not-italic text-[20px] font-normal'>
                  {productData?.productName}
                </h1>
                <sup className='-top-[0.5px] relative text-[75%] leading-[0] align-baseline'>
                  <Image
                    src='https://cdn1.concung.com/themes/desktop4.1/image/icon/copy.svg'
                    preview={false}
                    alt='Ấn vào để copy'
                  />
                  <span className='top-[10px] text-[10px] bg-[#0a0a0a0a] py-[2px] px[15px] rounded w-[132px] leading-[15px] hidden absolute'>
                    Sao chép thành công
                  </span>
                </sup>
              </div>
              {/* product-meta */}
              <div className='pb-[0] mb-4 justify-between flex'>
                {/* container */}
                <div className='items-center text-base flex'>
                  <div className='cursor-pointer items-center text-center relative flex'>
                    {/* rating */}
                    <u className='text-base underline'>{productData?.rating}</u>
                    <div className='pl-[10px] justify-between items-center mr-4'>
                      <div className='text-[10px] inline-block'>
                        {/* start checked */}
                        <span className="h-[17px] inline-block relative">
                          {ratingStars}
                        </span>
                      </div>
                    </div>
                    {/* feedback */}
                    <span className="h-5 block border-l border-solid border-[#eaeaea]"></span>
                    <u className="mr-[5px] pl-4 text-base text-center underline leading-4">
                      {totalReviews}
                    </u>
                    Đánh Giá
                  </div>
                </div>
              </div>

              {/* event admin setup */}
              <div className=''></div>

              {/* prices __ changes*/}
              <div className='bg-[#f8f8f8] p-[14px] w-[535px] rounded-lg mt-4 flex items-start justify-between flex-wrap'>
                {/* current price */}
                <div className='flex items-center max-w-full'>
                  {/* price tag */}
                  <span className='leading-7 text-3xl break-all text-[#202020] inline-block align-bottom mr-[0.5rem]'>
                    <CustomNumberFormat numStr={priceAfterDiscount} />
                  </span>
                  {/* discount tag */}
                  <span className='clear-left mb-0 block text-[10px] text-[#555] align-baseline'>
                    {productData?.discount > 0 && (
                      <span className='border-[#ff379b] border-2 border-solid text-lg leading-5 py-[2px] px-[5px] rounded-t-[10px] rounded-br-lg'>
                        {productData?.discount?.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                        %
                      </span>
                    )}
                  </span>
                </div>
                {/* old__price */}
                <span className='clear-left mb-0 block mt-[10px] max-w-full text-[10px] text-[#555] align-baseline w-full'>
                  <del className='text-[#67686c] line-through text-base'>
                    <CustomNumberFormat numStr={productData?.oldPrice} />
                  </del>
                </span>
                <span className='clear-left mb-0 block mt-[10px] max-w-full text-[10px] text-[#555] align-baseline w-full'>
                  {productData?.discount > 0 && (
                    <del className='text-[#67686c] line-through text-base'>
                      <CustomNumberFormat numStr={productData?.oldPrice} />
                    </del>
                  )}
                </span>
              </div>
              {/*  */}
              <div className='clear-both text-center block'>
                {/* promotion */}
                <div className=''></div>
                {/* amount */}
                <div className='mt-4 relative items-center flex'>
                  {/* text */}
                  <span className='min-w-[135px] text-[#67686c] text-left'>
                    Số Lượng
                  </span>
                  {/* box quantity */}
                  {/* Decrement Button */}
                  <ConfigProvider
                    theme={{
                      components: {
                        Button: {
                          defaultActiveBorderColor: '#CE93D8',
                        },
                      },
                    }}
                  >
                    <Button
                      onClick={decrement}
                      type="button"
                      className="m-0 p-0 w-[30px] h-[30px] align-[initial] text-center"
                      disabled={productQuantity === 0}
                    >
                      <svg
                        width={30}
                        height={30}
                        viewBox='0 0 30 30'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        className='__web-inspector-hide-shortcut__'
                      >
                        <rect width={30} height={30} rx={5} fill='#EEEEEE' />
                        <line
                          x1={11}
                          y1={15}
                          x2={19}
                          y2={15}
                          stroke='#555555'
                          strokeWidth={2}
                          strokeLinecap='round'
                        />
                      </svg>
                    </Button>
                  </ConfigProvider>
                  {/* show quantity */}
                  {/* still error can show */}
                  <Input
                    type='text'
                    size='2'
                    maxLength={2}
                    className='w-[34px] text-center border-0 overflow-visible m-0 p'
                    readOnly={true}
                    placeholder={productQuantity}
                    value={productQuantity}
                  />
                  {/* Increment Button */}
                  <ConfigProvider
                    theme={{
                      components: {
                        Button: {
                          defaultActiveBorderColor: '#CE93D8',
                        },
                      },
                    }}
                  >
                    <Button
                      onClick={increment}
                      type="button"
                      className="m-0 p-0 w-[30px] h-[30px] align-[initial] text-center"
                      disabled={productQuantity === 0}
                    >
                      <svg
                        width={30}
                        height={30}
                        style={{ verticalAlign: 'initial' }}
                        viewBox='0 0 30 30'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <rect width={30} height={30} rx={5} fill='#EEEEEE' />
                        <line
                          x1={11}
                          y1={15}
                          x2={19}
                          y2={15}
                          stroke='#555555'
                          strokeWidth={2}
                          strokeLinecap='round'
                        />
                        <line
                          x1={15}
                          y1={19}
                          x2={15}
                          y2={11}
                          stroke='#555555'
                          strokeWidth={2}
                          strokeLinecap='round'
                        />
                      </svg>
                    </Button>
                  </ConfigProvider>
                </div>
                <div className='mt-4 items-center flex'>
                  {/* add to Cart */}
                  <ConfigProvider
                    theme={{
                      components: {
                        Button: {
                          colorPrimary: `linear-gradient(90deg,  ${colors2.join(
                            ', ',
                          )})`,
                          colorPrimaryHover: `linear-gradient(90deg, ${getHoverColors(
                            colors2,
                          ).join(', ')})`,
                          colorPrimaryActive: `linear-gradient(90deg, ${getActiveColors(
                            colors2,
                          ).join(', ')})`,
                          lineWidth: 0,
                        },
                      },
                    }}
                  >
                    <Button
                      onClick={handleButtonAction}
                      type='primary'
                      size='large'
                      className='p-0 w-[240px] leading-[54px] capitalize h-[54px] mr-4 align-middle text-center '
                      disabled={productQuantity === 0}
                    >
                      Thêm Vào Giỏ Hàng
                    </Button>
                    <ToastContainer
                      position='top-right'
                      autoClose={1000}
                      hideProgressBar={false}
                      newestOnTop={false}
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                      theme='light'
                    />
                  </ConfigProvider>
                  {/* buy now */}
                  <ConfigProvider
                    theme={{
                      components: {
                        Button: {
                          colorPrimary: `linear-gradient(135deg, ${colors1.join(
                            ', ',
                          )})`,
                          colorPrimaryHover: `linear-gradient(135deg, ${getHoverColors(
                            colors1,
                          ).join(', ')})`,
                          colorPrimaryActive: `linear-gradient(135deg, ${getActiveColors(
                            colors1,
                          ).join(', ')})`,
                          lineWidth: 0,
                        },
                      },
                    }}
                  >
                    <Button
                      onClick={handleBuyNow}
                      type='primary'
                      size='large'
                      className='p-0 w-[240px] leading-[54px] capitalize h-[54px]'
                      disabled={productQuantity === 0}
                    >
                      Mua Ngay
                    </Button>
                  </ConfigProvider>
                </div>
                {/* pre-order show when quanity === 0 */}
                <div className='mt-4 items-center flex'>
                  {/* pre-order */}
                  {productQuantity === 0 && (
                    <ConfigProvider
                      theme={{
                        components: {
                          Button: {
                            colorPrimary: `linear-gradient(135deg, ${colors1.join(
                              ', ',
                            )})`,
                            colorPrimaryHover: `linear-gradient(135deg, ${getHoverColors(
                              colors1,
                            ).join(', ')})`,
                            colorPrimaryActive: `linear-gradient(135deg, ${getActiveColors(
                              colors1,
                            ).join(', ')})`,
                            lineWidth: 0,
                          },
                        },
                      }}
                    >
                      <Button
                        type="primary"
                        size="large"
                        className="p-0 w-[240px] leading-[54px] capitalize h-[54px]"
                        onClick={handleOpenPopup}
                      >
                        Đặt Trước
                      </Button>
                      <PopupPreorder isOpen={isPopupOpen} onClose={handleClosePopup} handlePreOrder={handlePreOrder} />
                    </ConfigProvider>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* main top */}
          {/* page section */}
          {/* page-scroll */}
          {/* block gift order product */}
          {/* together product list */}
          {/* similar product list */}
          {/* Voucher */}
          <Voucher />
          {/* brand block */}
          <Brand brandId={brandData} />
          {/* content details */}
          <ContentProduct contentInfo={productData.description} />
          {/* Rating */}
          <Rating productId={productData.productId} />
          <ChatBot />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
