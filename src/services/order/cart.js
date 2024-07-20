import { instance } from "../instance";

const CartAPI = {
  addToCart: async ({ userId, productId, quantity, isChecked }) => {
    try {
      let url = `Cart/AddToCart?productId=${productId}&quantity=${quantity}&isChecked=${isChecked}`;
      if (userId) {
        url += `&userId=${userId}`;
      }

      const response = await instance.post(url);
      return response;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error; // Rethrow để xử lý ở mức cao hơn
    }
  },

  purchaseNow: async ({ userId, productId, quantity }) => {
    try {
      let url = `Cart/PurchaseNow?productId=${productId}&quantity=${quantity}`;
      if (userId) {
        url += `&userId=${userId}`;
      }
      const response = await instance.post(url);
      return response;
    } catch (error) {
      console.error("Error purchasing now:", error);
      throw error;
    }
  },
  cartDetails: async (params) => {
    try {
      const cart = await instance.get(`Cart/CartDetails/${params}`);
      return cart;
    } catch (err) {
      // console.error(err);
    }
  },
  increaseQuantity: async ({ userId, productId, quantityToAdd }) => {
    try {
      let url = `Cart/IncreaseQuantity?productId=${productId}&quantityToAdd=${quantityToAdd}`;
      if (userId) {
        url += `&userId=${userId}`;
      }
      const response = await instance.post(url);
      // console.log("Response from increaseQuantity API:", response);
      return response;
    } catch (err) {
      console.error("Lỗi khi tăng số lượng:", err);
      throw err;
    }
  },

  decreaseQuantity: async ({ userId, productId, quantityToSubtract }) => {
    try {
      let url = `Cart/DecreaseQuantity?productId=${productId}&quantityToSubtract=${quantityToSubtract}`;
      if (userId) {
        url += `&userId=${userId}`;
      }
      const response = await instance.post(url);
      // console.log("Response from decreaseQuantity API:", response);
      return response;
    } catch (err) {
      console.error("Lỗi khi giảm số lượng:", err);
      throw err;
    }
  },
  deleteProductFromCart: async ({ userId, productId }) => {
    try {
      let url = `Cart/DeleteProductFromCart?productId=${productId}`;
      if (userId) {
        url += `&userId=${userId}`;
      }
      const response = await instance.delete(url);
      // console.log("Response from deleteProductFromCart API:", response);
      return response;
    } catch (error) {
      console.error("Error deleting product from cart:", error);
      throw error;
    }
  },
  updateProductCheckedStatus: async (params) => {
    try {
      const cart = await instance.post(
        `Cart/UpdateProductCheckedStatus/${params}`
      );
      return cart;
    } catch (err) {
      console.error(err);
    }
  },
};

export default CartAPI;
