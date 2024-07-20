import { createSlice } from "@reduxjs/toolkit";
import CartAPI from "../../../services/order/cart";

const initialState = {
  cartItems: [],
  orders: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { productId, quantity } = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.productId === productId
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cartItems.push({ ...action.payload, quantity });
      }
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => item.productId !== productId
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    removePaidItems: (state, action) => {
      const paidProducts = action.payload;
      console.log('State before removing paid items:', state.cartItems); // Thêm dòng này để kiểm tra
      state.cartItems = state.cartItems.filter(
        (item) => !paidProducts.includes(item.productId)
      );
      console.log('State after removing paid items:', state.cartItems); // Thêm dòng này để kiểm tra
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    increaseQuantity: (state, action) => {
      const productId = action.payload;
      const itemIndex = state.cartItems.findIndex(
        (item) => item.productId === productId
      );
      if (itemIndex !== -1) {
        state.cartItems[itemIndex].quantity += 1;
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    decreaseQuantity: (state, action) => {
      const productId = action.payload;
      const itemIndex = state.cartItems.findIndex(
        (item) => item.productId === productId
      );
      if (itemIndex !== -1 && state.cartItems[itemIndex].quantity > 1) {
        state.cartItems[itemIndex].quantity -= 1;
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.orders = [];
      localStorage.removeItem("cartItems");
    },
    addOrder: (state, action) => {
      state.orders.push(action.payload);
      localStorage.setItem("orders", JSON.stringify(state.orders));
    },
    fetchCartDetails: (state, action) => {
      state.cartItems = action.payload; // Cập nhật cartItems với dữ liệu fetch từ API
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems)); // Cập nhật localStorage
    },
  },
});

export const fetchCartItems = (userId) => async (dispatch) => {
  try {
    const response = await CartAPI.cartDetails(userId); // Gọi API để lấy chi tiết giỏ hàng
    if (response && response.$values) {
      const _response = response.$values;
      dispatch(fetchCartDetails(_response)); // Dispatch hành động để cập nhật cartItems
    } else {
      dispatch(fetchCartDetails([])); // Nếu response không có $values, dispatch cartItems rỗng
    }
  } catch (error) {
    // console.error("Failed to fetch cart details:", error);
    dispatch(fetchCartDetails([])); // Nếu xảy ra lỗi, dispatch cartItems rỗng
  }
};

export const {
  addToCart,
  removeFromCart,
  removePaidItems,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  addOrder,
  fetchCartDetails,
} = cartSlice.actions;

export default cartSlice.reducer;
