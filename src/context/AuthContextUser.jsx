import { createContext, useState, useEffect, useRef } from "react";

export const AuthContext = createContext();

const SESSION_DURATION = 3600000; // 1 giờ (mili giây)

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const storedPhoneNumber = localStorage.getItem("phoneNumber");
    const storedToken = localStorage.getItem("token");
    const storeduserId = localStorage.getItem("userId");
    if (storedPhoneNumber && storedToken && storeduserId) {
      setUserInfo({
        phoneNumber: storedPhoneNumber,
        token: storedToken,
        userId: storeduserId,
      });
    }
  }, []);

  useEffect(() => {
    const resetTimeout = () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(logout, SESSION_DURATION);
    };

    // Theo dõi hoạt động người dùng
    window.addEventListener('mousemove', resetTimeout);
    window.addEventListener('keydown', resetTimeout);
    window.addEventListener('scroll', resetTimeout);

    return () => {
      // Dọn dẹp event listeners khi component unmount
      window.removeEventListener('mousemove', resetTimeout);
      window.removeEventListener('keydown', resetTimeout);
      window.removeEventListener('scroll', resetTimeout);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const register = (phoneNumber, token, userId) => {
    setUserInfo({ phoneNumber, token, userId });
    localStorage.setItem("phoneNumber", phoneNumber);
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
  };


  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem("phoneNumber");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  };

  const value = { userInfo, isAuthenticated: !!userInfo, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
