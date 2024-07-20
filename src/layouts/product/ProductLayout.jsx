import { Outlet } from "react-router-dom";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import { underline } from "@cloudinary/url-gen/qualifiers/textDecoration";

const ProductLayout = () => {
  return (
    <>
      <main>
        {/* breadcrumb  */}
        {/* <div className="p-0">
          <div className="mb-4 container mx-auto">
            <div className="m-0 flex flex-wrap">
              <div className="max-w-[initial] bg-transparent justify-between p-0 mb-0 flex no-underline">
                <Breadcrumb />
              </div>
            </div>
          </div>
        </div> */}
        <Outlet />
      </main>
    </>
  );
};

export default ProductLayout;
