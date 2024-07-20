import { Card, Image } from "antd";
import CustomNumberFormat from "../../utils/CustomNumberFormat";
import { useEffect, useState } from "react";
import star from "../../assets/images/star.png";
import FeedbackAPI from "../../services/feedback/feedback";

const ProductCart = ({ item }) => {
  const [images, setImages] = useState([]);
  const [rating, setRating] = useState(0); // State for the product rating
  const [loading, setLoading] = useState(true);

  const ratingStars = [...Array(Math.min(Math.round(rating), 5))].map(
    (_, i) => (
      <Image
        key={i}
        width={15}
        height={15}
        className="mr-1 mb-[30px] align-middle"
        src={star}
        alt="Rating Star"
        loading="lazy"
        preview={false}
      />
    )
  );

  useEffect(() => {
    if (item?.imageLinks) {
      setImages(item.imageLinks.split(","));
    }
  }, [item]);

  useEffect(() => {
    let isMounted = true; // Track if component is mounted
    const fetchRating = async () => {
      if (!item || !item.productId) return;
      const currentProductId = item.productId;
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
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchRating();
    // Cleanup function to set isMounted to false on unmount
    return () => {
      isMounted = false;
    };
  }, [item?.productId]);

  useEffect(() => {
    if (item?.imageLinks) {
      setImages(item.imageLinks.split(","));
    }
  }, [item]);

  return (
    <Card className='w-[11.3rem] rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-lg hover:scale-105'>
      <div className='relative'>
        <Image
          className='w-full h-48 object-cover rounded-t-lg mb-2 transition-transform duration-300 hover:scale-125'
          src={images[0]}
          alt='Product Image'
          preview={false}
        />
      </div>
      <div className="text-left flex flex-col justify-between h-full">
        <h5 className="text-sm font-semibold leading-5 text-gray-800 mt-1">
          <div className="line-clamp-2 h-11">{item.productName}</div>
        </h5>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <p className="text-sm text-gray-600">({item?.quantity})</p>
          </div>
          <div className="flex items-center mb-3 mr-3">{ratingStars}</div>
        </div>
        <div className='flex items-center justify-between mt-2 gap-1'>
          <p className='text-[16px] font-semibold text-gray-800 flex items-center'>
            <CustomNumberFormat numStr={item?.newPrice} />
          </p>
          {item?.discount > 0 && (
            <p className="inline-flex items-center px-1 py-1 rounded-full bg-pink-500 text-white text-xs font-medium">
              -
              {item?.discount?.toLocaleString(undefined, {
                maximumFractionDigits: 1,
              })}
              %
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProductCart;
