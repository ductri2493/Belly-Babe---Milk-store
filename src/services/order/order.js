import { instance } from "../instance";

const OrderAPI = {
  // placeOrder: async (data) => {
  //   try {
  //     const {
  //       userId,
  //       recipientName,
  //       recipientPhone,
  //       recipientAddress,
  //       deliveryId,
  //       note,
  //     } = data;
  //     const response = await instance.post(
  //       `/Order/PlaceOrder?userId=${userId}&recipientName=${recipientName}&recipientPhone=${recipientPhone}&recipientAddress=${recipientAddress}&deliveryId=${deliveryId}&note=${encodeURIComponent(
  //         note
  //       )}`
  //     );
  //     return response;
  //   } catch (err) {
  //     console.error(err);
  //   }
  // },

  placeOrder: async (data) => {
    try {
      const response = await instance.post(
        `Order/PlaceOrder`
        , null, {
        params: data
      });
      return response;
    } catch (err) {
      console.error(err);
    }
  },

  getOrderFromUser: async (params) => {
    try {
      const order = await instance.get(`Order/GetOrdersFromUser/${params}`);
      return order;
    } catch (err) {
      console.error(err);
    }
  },
  updateOrderStatus: async (params, data) => {
    try {
      const updateOrder = await instance.put(`Order/UpdateOrderStatus/${params}`, null, { params: data });
      return updateOrder;
    } catch (err) {
      console.error(err);
    }
  },
  getOrdersByStatusFromUser: async (params) => {
    try {
      const orderStatus = await instance.get(
        `Order/GetOrdersByStatusFromUser/${params}}`
      );
      return orderStatus;
    } catch (err) {
      console.error(err);
    }
  },
  cancelOrder: async (params, data) => {
    try {
      const cancelOrder = await instance.delete(
        `Order/CancelOrder/${params}`,
        data
      );
      return cancelOrder;
    } catch (err) {
      console.error(err);
    }
  },
  getAllOrders: async () => {
    try {
      const orders = await instance.get(`Order/GetAllOrders`);
      return orders;
    } catch (err) {
      console.error(err);
    }
  },
  getLatestOrderStatus: async (params) => {
    try {
      const latestOrderStatus = await instance.get(
        `Order/GetLatestOrderStatus/${params}`
      );
      return latestOrderStatus;
    } catch (err) {
      console.error(err);
    }
  }
};

export default OrderAPI;
