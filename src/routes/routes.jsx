//
import { createBrowserRouter } from 'react-router-dom';

// components

// layouts
import RootLayout from '../layouts/index';
import LoginLayout from '../layouts/login/LoginLayout';

// pages
import Home from '../pages/home/Home';
import Promotion from '../pages/promotion';
import Cart from '../pages/cart/Cart.jsx';
import Login from '../pages/login';
import VerifyOtp from '../pages/login/otp/index.jsx';
import ProductDetails from '../pages/product/ProductDetails';
import CategoryPage from '../pages/categories-page/CategoryPage.jsx';
import AdminLayout from '../layouts/admin/AdminLayout.jsx';
import LoginAdmin from '../pages/admin/login-admin/LoginAdmin.jsx';
import Admin from '../pages/admin/main/Admin';
import ManageUserAccount from '../pages/admin/manage/manage-account/ManageUserAccount';
import ManageStaffAccount from '../pages/admin/manage/manage-account/ManageStaffAccount';
import ManageProduct from '../pages/admin/manage/manage-product/ManageProduct';
import Address from '../pages/address/Address.jsx';
import DiscountCategories from '../pages/viewall/DiscountCategories.jsx';
import BrandDetail from '../pages/brand/BrandDetail.jsx';
import BrandOffer from '../pages/viewall/BrandOffer.jsx';
import Order from '../pages/order/Order.jsx';
import Payment from '../pages/payment/Payment.jsx';
import PaymentSuccess from '../pages/payment/PaymentSuccess.jsx';
import Profile from '../pages/admin/profile/Profile.jsx';
import ManageVoucher from '../pages/admin/manage/manage-voucher/ManageVoucher.jsx';
import ManageBlog from '../pages/admin/manage/manage-blog/ManageBlog.jsx';
import ManageOrder from '../pages/admin/manage/manage-order/ManageOrder.jsx';
import AddressList from '../pages/address/AddressList.jsx';
import BlogDetail from '../pages/blog/BlogDetail.jsx';
import BlogCategoryPage from '../pages/categories-page/BlogCategoryPage.jsx';
import Location from '../pages/location-store/location.jsx';
import Gift from '../components/services/content/gift.jsx';
import Deal from '../components/services/content/Deal.jsx';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import FlashSale from '../pages/viewall/FlashSale.jsx';
import UserInfo from '../pages/user/UserInfo.jsx';
import TermsAndConditions from '../pages/termsandconditions/TermsAndConditions.jsx';
import ResultSearch from '../components/search/ResultSearch.jsx';
import ManagePreOrder from '../pages/admin/manage/manage-order/ManagePreOrder.jsx';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      { path: 'cart', element: <Cart /> },
      { path: 'address', element: <Address /> },
      { path: 'address/edit/:id', element: <Address /> },
      { path: 'addresslist', element: <AddressList /> },
      { path: 'order', element: <Order /> },
      { path: 'payment', element: <Payment /> },
      { path: 'payment-success', element: <PaymentSuccess /> },
      { path: 'promotion', element: <Promotion /> },
      { path: 'location', element: <Location /> },
      { path: 'deal', element: <Deal /> },
      { path: 'gift', element: <Gift /> },
      { path: 'userinfo', element: <UserInfo /> },
      { path: 'brand/:brandName', element: <BrandDetail /> },
      { path: 'termsandcondition', element: <TermsAndConditions /> },
      { path: '/search/:searchTerm', element: <ResultSearch /> },
      { path: "/search/", element: < ResultSearch /> },
      {
        path: 'blog/:categoryBlogs/:titleName',
        element: <BlogDetail />,
      },
      {
        path: 'blog/:categoryBlogs',
        element: <BlogCategoryPage />,
        children: [{ path: ':titleName', element: <BlogDetail /> }],
      },
      {
        path: 'category/:parentCategoryName',
        element: <CategoryPage />,
        children: [{ path: ':product_title', element: <ProductDetails /> }],
      },
      {
        path: ':category/:product_title',
        element: <ProductDetails />,
      },
      {
        path: 'DiscountCategories',
        element: <DiscountCategories />,
        children: [{ path: ':product_title', element: <ProductDetails /> }],
      },
      {
        path: 'BrandOffer',
        element: <BrandOffer />,
      },
      {
        path: 'FlashSale',
        element: <FlashSale />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/login/verify-otp', element: <VerifyOtp /> },
    ],
  },
  {
    path: 'login-admin',
    element: <LoginAdmin />,
  },
  {
    path: 'admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <Admin /> },
      { path: 'profile', element: <Profile /> },
      { path: 'manage/user', element: <ManageUserAccount /> },
      { path: 'manage/staff', element: <ManageStaffAccount /> },
      { path: 'manage/product', element: <ManageProduct /> },
      { path: 'manage/voucher', element: <ManageVoucher /> },
      { path: 'manage/order', element: <ManageOrder /> },
      { path: 'manage/pre-order', element: <ManagePreOrder /> },
      { path: 'manage/blog', element: <ManageBlog /> },
    ],
  },
]);

export default routes;
