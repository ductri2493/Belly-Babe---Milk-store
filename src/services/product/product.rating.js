import { instance } from "../instance";

const RatingAPI = {
    createRating: async (data) => {
        const rating = await instance.post(`Rating/AddRating`, null, { params: data });
        return rating;
    },
    deleteRating: async (ratingId) => {
        const rating = await instance.delete(`Rating/DeleteRating/${ratingId}`);
        return rating;
    },
    updateRating: async (ratingId, data) => {
        const rating = await instance.put(`Rating/UpdateRating/${ratingId}`, null, { params: data });
        return rating;
    },
    getAllRatings: async () => {
        const rating = await instance.get(`Rating/GetAllRatings`);
        return rating;
    },
    getRatingById: async (ratingId) => {
        const rating = await instance.get(`Rating/GetRatingById/${ratingId}`);
        return rating;
    },
    getRatingByProductId: async (productId) => {
        const rating = await instance.get(`Rating/GetRatingsByProductId/${productId}`);
        return rating;
    },
    getRatingByUser: async (userId) => {
        const rating = await instance.get(`Rating/GetRatingsByUserId/${userId}`);
        return rating;
    }
}

export default RatingAPI;
