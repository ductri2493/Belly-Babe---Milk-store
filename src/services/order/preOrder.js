import { instance } from "../instance";

const preOrderAPI = {
    fetchPreOrders: async () => {
        try {
            const response = await instance.get('PreOrder/GetAllPreOrders');
            return response;
        } catch (error) {
            console.error('Error:', error);
        }
    },
    fetchPreOrder: async (params) => {
        try {
            const response = await instance.get(`PreOrder/GetPreOrder/${params}`);
            return response;
        } catch (error) {
            console.error('Error:', error);
        }
    },
    notifyCustomer: async (data) => {
        try {
            const response = await instance.post('PreOrder/NotifyCustomer', data);
            return response;
        } catch (error) {
            console.error('Error:', error);
        }
    }

}

export default preOrderAPI;