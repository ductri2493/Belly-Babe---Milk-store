import { useEffect, useState } from "react";
import star from "../../assets/images/star.png";
import FeedbackAPI from "../../services/feedback/feedback";
import { Image } from "antd";
const Rating = ({ productId }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [sortByDate, setSortByDate] = useState(false);
  const totalReviews = feedbacks.length;

  const handleRatingClick = (rating) => {
    setSelectedRating(rating);
  };

  const handleSortByDateClick = () => {
    setSortByDate(!sortByDate);
  };

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await FeedbackAPI.feedbackByProductId(productId);
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

    if (productId) {
      fetchFeedbacks();
    }
  }, [productId]);

  // Calculate average rating (rounded to one decimal place)
  // Calculate average rating (rounded to the nearest whole number)
  const averageRating = feedbacks.length > 0
    ? Math.round(feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbacks.length)
    : 0;

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
      const currentProductId = productId;
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
  }, [productId]);

  // Filtering and sorting logic in one place
  const filteredFeedbacks =
    selectedRating === null
      ? feedbacks
      : feedbacks.filter(item => item.rating === selectedRating);

  const sortedFeedbacks = sortByDate
    ? [...filteredFeedbacks].sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)) // Sort descending
    : filteredFeedbacks;


  return (
    <div className="w-[900px]">
      <div className="w-[900px] px-6 py-5  bg-white p-6 mt-4 rounded-2xl">
        <h2 className="text-2xl font-bold inline-block">Đánh Giá</h2>
        {/*RATING  */}
        <div className="rating-item mt-3 justify-between flex px-7 py-4 bg-[#FFFAF4] rounded-xl">
          <div className="min-w-[175px] text-center block  ">
            <span className="text-4xl text-[#ff379b] font-bold">
              {averageRating}.0 <span className="text-4xl text-gray-600 ">/5.0 </span>
            </span>
            <div className="flex justify-center mb-4 ">
              {ratingStars}
            </div>
            <p>
              Có <span className="font-bold">{totalReviews}</span> lượt đánh giá
            </p>
          </div>
          <div className="ml-5 flex flex-wrap justify-end">
            <div className="flex text-center">
              <button
                className={`border-solid border-2 border-[#d7d7d7] rounded-lg leading-9 h-9 mr-5 w-[150px] ${sortByDate ? 'bg-blue-200' : ''}`}
                onClick={handleSortByDateClick}
              >
                Mới nhất
              </button>
            </div>
            {/* RATING FILTER */}
            <div className="mt-3 flex flex-wrap justify-end">
              <button
                className={`border-solid border-2 border-[#d7d7d7] rounded-lg leading-9 h-9 mr-5 w-[150px] ${selectedRating === null ? 'bg-blue-200' : ''}`}
                onClick={() => handleRatingClick(null)}
              >
                Tất cả
              </button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  className={`mt-1 border-solid border-2 border-[#d7d7d7] rounded-lg leading-9 h-9 mr-5 w-[150px] ${selectedRating === rating ? 'bg-blue-200' : ''}`} // Highlight selected rating
                  onClick={() => handleRatingClick(rating)}
                >
                  {rating} <img className="w-4" src={star} alt="star" />
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* RATING CONTENT */}
        {/* RATING CONTENT */}
        {sortedFeedbacks.map((feedback) => (
          <div key={feedback.feedbackId} className="flex mb-4 mt-4">
            <div className="img-comment w-16 h-16 relative rounded-full">
              <div className=" bg-name w-16 h-16 float-left rounded-full bg-[#ffe3ec] text-[#919191] bg-cover bg-no-repeat text-center uppercase text-3xl border-solid leading-[56px]">
                {feedback.userName.charAt(0)}
              </div>
            </div>
            <div className="ml-5">
              <span className="font-bold">{feedback.userName}</span>
              <ul className="flex list-none">
                {[...Array(feedback.rating)].map((_, i) => (
                  <li key={i} className="mr-1">
                    <img className="w-4" src={star} alt="star" />
                  </li>
                ))}
                <li>
                  <p className="ml-2 mt-1 text-xs">
                    {new Date(feedback.dateCreated).toLocaleString()}
                  </p>
                </li>
              </ul>
              <p>{feedback.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rating;
