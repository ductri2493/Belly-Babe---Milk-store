import LoginHeader from "../../components/header/login/LoginHeader";
import Footer from "../../components/footer";
import { Outlet } from "react-router-dom";

export default function LoginLayout() {
  return (
    <>
      <LoginHeader />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
