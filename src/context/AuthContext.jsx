/* eslint-disable no-unused-vars */
// AuthProvider.js
import { createContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { Roles } from '../types/user';
import { decodeToken } from '../hooks/useJWT';
import { useNavigate } from 'react-router-dom';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { login } from '../services/authServices/authServices';
const initialState = {
  userInfo: {
    id: 0,
    fullName: '',
    email: '',
    firstName: '',
    lastName: '',
    dob: '',
    phone: '',
    address: '',
    imageUrl: '',
    role: Roles.guest,
  },
  isInitialized: false,
  isAuthenticated: false,
};

const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem(
      'accessToken',
    )}`;
  } else {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT':
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        userInfo: action.payload.userInfo,
      };
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        userInfo: action.payload.user,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        userInfo: initialState.userInfo,
      };
    default:
      return state;
  }
};

const AuthContext = createContext({
  ...initialState,
  method: 'JWT',
  handleLogin: (email, password) => {},
  logout: () => {},
  handleRegister: (email, fullName, password, confirmPassword) => {},
});

export const AuthProvider = ({ children }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  // Check for token in local storage on mount
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      const decoded = decodeToken(accessToken);
      const user = {
        id: decoded.MemberId,
        email: decoded.email,
        role: parseInt(decoded.Role),
        fullName: decoded.name,
      };
      dispatch({
        type: 'INIT',
        payload: { userInfo: user, isAuthenticated: true },
      });
    } else {
      dispatch({
        type: 'INIT',
        payload: { userInfo: initialState, isAuthenticated: false },
      });
    }
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const res = await login(email, password);

      if (res.status === 200) {
        const { token } = res.data;
        const decoded = decodeToken(token);
        setSession(token);
        const user = {
          id: decoded.MemberId,
          email: decoded.email,
          role: parseInt(decoded.Role),
          fullName: decoded.FullName,
        };
        // toast.success('Login successfully!');
        dispatch({ type: 'LOGIN', payload: { user } });
        if (user.role === Roles.admin) {
          navigate('/admin');
        } else navigate('/');
      }
    } catch (error) {
      // console.error(error);
    }
  };

  const logout = () => {
    localStorage.clear();
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  const handleRegister = async (email, fullName, password, confirmPassword) => {
    await axios
      .post(`${API_URL}/register`, {
        emailAddress: email,
        fullName: fullName,
        password: password,
        confirmPassword: confirmPassword,
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success('Account registered successfully!');
          navigate('/session/signin');
        }
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast.error(err.response.data);
        } else {
          toast.error(err.response.data);
        }
      });
  };

  return (
    <>
      <AuthContext.Provider
        value={{
          ...state,
          method: 'JWT',
          handleLogin,
          logout,
          handleRegister,
        }}
      >
        {children}
      </AuthContext.Provider>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
        transition={Bounce}
      />
    </>
  );
};

export default AuthContext;
