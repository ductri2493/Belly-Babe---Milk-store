// Page
import Footer from "../components/footer";
import Header from "../components/header";
import TopBar from "../components/topbar";
import { Outlet } from "react-router-dom";
import Breadcrumb from "../components/breadcrumb/Breadcrumb";
import { CartProvider } from "../context/CartContext";


//import

function RootLayout() {
  return (
    <>
      <CartProvider>
        <TopBar />
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </CartProvider>
    </>
  );
}

export default RootLayout;
