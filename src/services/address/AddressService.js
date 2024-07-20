import { instance } from '../instance';

export const AddressAPI = {
    contactInfo: async (userId, data) => {
        try {
            // console.log('Sending request to:', `/User/contact-info/${userID}`);
            // console.log('Request payload:', data);
            const response = await instance.post(`/User/contact-info/${userId}`, data);
            // console.log('Response received:', response);
            return response;
        } catch (err) {
            // console.error('Error during API request:', err);
            // throw err;
            console.log(err)
        }
    },
}
