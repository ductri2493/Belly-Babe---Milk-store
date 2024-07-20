import { instance } from "../instance";

const OrderStatusAPI = {
    getAllOrderStatuses: async () => {
        try {
            const status = await instance.get("OrderStatus/GetAllOrderStatuses")
            return status;
        } catch (error) {
            console.error(error);
        }
    },
    getOrderStatusById: async (params) => {
        try {
            const status = await instance.get(`OrderStatus/GetOrderStatusById/${params}`)
            return status;
        } catch (error) {
            console.error(error);
        }
    },
    addOrderStatus: async (data) => {
        try {
            const status = await instance.post(`OrderStatus/AddOrderStatus`, data)
            return status;
        } catch (error) {
            console.error(error);
        }
    },
    updateOrderStatus: async (params, data) => {
        try {
            const status = await instance.put(`OrderStatus/UpdateOrderStatus/${params}`, data)
            return status;
        } catch (error) {
            console.error(error);
        }
    },
    deleteOrderStatus: async (params) => {
        try {
            const status = await instance.delete(`OrderStatus/DeleteOrderStatus/${params}`)
            return status;
        } catch (error) {
            console.error(error);
        }
    }
}

export default OrderStatusAPI