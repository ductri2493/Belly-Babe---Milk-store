import { createContext, useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
  addToCart,
  removeFromCart,
  removePaidItems,
  clearCart,
} from "../redux/features/cart/cartSlice";
import CartAPI from "../services/order/cart";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [itemInCart, setItemInCart] = useState(() => {
    const savedItemInCart = localStorage.getItem("itemInCart");
    return savedItemInCart !== null ? JSON.parse(savedItemInCart) : 0;
  });

  const [cartProducts, setCartProducts] = useState(() => {
    const savedCartProducts =
      JSON.parse(localStorage.getItem("cartItems")) || []; // Lấy dữ liệu từ localStorage
    return savedCartProducts;
  });

  const dispatch = useDispatch();

  const handleAddToCart = useCallback(
    async (productData) => {
      try {
        const { productId, quantity } = productData;
        const existingProductIndex = cartProducts.findIndex(
          (product) => product.productId === productId
        );

        if (existingProductIndex !== -1) {
          const updatedCartProducts = [...cartProducts];
          updatedCartProducts[existingProductIndex].quantity += quantity;
          setCartProducts(updatedCartProducts);
        } else {
          const updatedCartProducts = [
            ...cartProducts,
            { ...productData, quantity },
          ];
          setCartProducts(updatedCartProducts);
          setItemInCart((prevCount) => prevCount + 1);
        }

        const productAddToCart = {
          userId: parseInt(localStorage.getItem("userId")),
          productId,
          quantity,
          isChecked: false
        };

        const response = await CartAPI.addToCart(productAddToCart);

        if (response === "Đã thêm sản phẩm vào giỏ hàng thành công.") {
          dispatch(addToCart(productData));
          toast.success("Đã Thêm Sản Phẩm Vào Giỏ Hàng! 🛒");
        } else {
          console.error("Invalid response from server:", response);
          throw new Error("Invalid response from server");
        }
      } catch (error) {
        console.error("Error sending cart data to API:", error);
        toast.error("Đã xảy ra lỗi khi lưu giỏ hàng. Vui lòng thử lại sau.");
      }
    },
    [dispatch, cartProducts]
  );

  const handlePurchaseNow = useCallback(
    async (productData) => {
      try {
        const { productId, quantity } = productData;
        const existingProductIndex = cartProducts.findIndex(
          (product) => product.productId === productId
        );

        // Update local cart state based on existing or new product
        if (existingProductIndex !== -1) {
          const updatedCartProducts = [...cartProducts];
          updatedCartProducts[existingProductIndex].quantity += quantity;
          setCartProducts(updatedCartProducts);
        } else {
          const updatedCartProducts = [
            ...cartProducts,
            { ...productData, quantity },
          ];
          setCartProducts(updatedCartProducts);
          setItemInCart((prevCount) => prevCount + 1);
        }

        const productAddToCart = {
          userId: parseInt(localStorage.getItem("userId")), // Convert to integer if needed
          productId,
          quantity,
          isChecked: true
        };

        // Call API to update cart on the server
        const response = await CartAPI.addToCart(productAddToCart);
        // Check if response is valid
        if (response === "Đã thêm sản phẩm vào giỏ hàng thành công.") {
          // Dispatch action to Redux store
          dispatch(addToCart(productData));
        } else {
          console.error("Invalid response from server:", response);
          throw new Error("Invalid response from server");
        }
      } catch (error) {
        console.error("Error sending cart data to API:", error);
        toast.error("Đã xảy ra lỗi khi lưu giỏ hàng. Vui lòng thử lại sau.");
      }
    },
    [dispatch, cartProducts]
  );

  const handleRemoveFromCart = useCallback(
    async (productId) => {
      try {
        const userId = parseInt(localStorage.getItem("userId"));
        const response = await CartAPI.deleteProductFromCart({
          userId,
          productId,
        });

        if (response === "Sản phẩm đã được xóa khỏi giỏ hàng thành công.") {
          const updatedCartProducts = cartProducts.filter(
            (product) => product.productId !== productId
          );
          setCartProducts(updatedCartProducts);
          setItemInCart((prevCount) => Math.max(prevCount - 1, 0));
          dispatch(removeFromCart(productId));
        } else {
          console.error("Error response from server:", response);
          throw new Error("Error response from server");
        }
      } catch (error) {
        console.error("Error deleting product from cart:", error);
        toast.error(
          "Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng. Vui lòng thử lại sau."
        );
      }
    },
    [dispatch, cartProducts]
  );

  const handleRemovePaidItemsFromCart = useCallback(
    (paidItemIds) => {
      console.log('Removing paid items from cart:', paidItemIds); // Thêm dòng này để kiểm tra
      const updatedCartProducts = cartProducts.filter(
        (product) => !paidItemIds.includes(product.productId)
      );
      setCartProducts(updatedCartProducts);
      setItemInCart((prevCount) => Math.max(prevCount - paidItemIds.length, 0));
      dispatch(removePaidItems(paidItemIds));
    },
    [dispatch, cartProducts]
  );

  const handleLogout = useCallback(() => {
    setCartProducts([]);
    setItemInCart(0);
    dispatch(clearCart()); // Dispatch clear cart action to Redux
    localStorage.removeItem("itemInCart");
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("itemInCart", JSON.stringify(itemInCart));
    localStorage.setItem("cartItems", JSON.stringify(cartProducts)); // Lưu vào localStorage với key là cartItems
  }, [itemInCart, cartProducts]);

  return (
    <CartContext.Provider
      value={{
        itemInCart,
        setItemInCart,
        cartProducts,
        setCartProducts,
        handleAddToCart,
        handleRemoveFromCart,
        handleRemovePaidItemsFromCart,
        handlePurchaseNow,
        handleLogout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
