import { instance } from "../instance";

const FeedbackAPI = {
  addFeedback: async ({ userId, orderId, productId, content, rating }) => {
    try {
      const requestUrl = `Feedback/AddFeedback?userId=${userId}&orderId=${orderId}&productId=${productId}&content=${encodeURIComponent(
        content
      )}&rating=${rating}`; // Construct URL with parameters
      console.log("Sending feedback to URL:", requestUrl); // Log the full URL
      const feedback = await instance.post(requestUrl);
      console.log("API Response:", feedback.data); // Log the API response
      return feedback.data;
    } catch (err) {
      console.error("API Error:", err); // Log the error details
      throw err; // Re-throw the error to handle it in the component
    }
  },

  ratingProduct: async (productId) => {
    // console.log("Received productId:", productId); // Log productId in the API function
    const fetch = await instance.get(
      `RatingCategory/CalculateAverageRating/${productId}`
    );
    return fetch;
  },
  feedbackByProductId: async (productId) => {
    const fetch = await instance.get(
      `Feedback/GetFeedbackByProductIdAndRating/${productId}`
    );
    return fetch;
  },
};

export default FeedbackAPI;
