import { NavLink } from "react-router-dom";

const LoginHeader = () => {
  return (
    <header className="container mx-auto px-4 flex items-baseline pt-3 ">
      {/* Logo Section */}
      <NavLink
        to="/"
        className="w-[190px] flex items-end justify-center text-inherit no-underline"
      >
        <h1 className="text-[#A765C9] text-4xl font-bold">Belly&</h1>
        <h1 className="text-3xl font-bold text-gray-800">Babe</h1>
      </NavLink>

      {/* Divider Line (Optional) */}
      <span className="md:block border-l-[0.05px] h-6 border-solid border-gray-300 ml-4 items-center flex" />

      {/* Login Text */}
      <span className="ml-4 text-3xl font-semibold text-[#555]">Đăng Nhập</span>
    </header>
  );
};

export default LoginHeader;
