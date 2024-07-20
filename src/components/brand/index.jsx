// import assets
import watchshop from "../../assets/img/watch-shop.png";
import follow from "../../assets/img/follow.png";
import trustBrand from "../../assets/img/trustbrand.png";
import checkGreen from "../../assets/img/check-green.png";
import { Link } from "react-router-dom";

const Brand = ({ brandId }) => {
  return (
    <div className="section-page p-6 mt-4 rounded-2xl bg-white">
      <div key={brandId?.brandId} className="group-info flex h-24">
        <div className="name-brand flex w-[380px]">
          <div className="h-[100px] mr-5">
            <Link
              to={`/brand/${brandId?.brandName}`} // Đặt đường dẫn tới BrandDetail
              state={{
                brandId: brandId?.brandId,
                brandName: brandId?.brandName,
                imageBrand: brandId?.imageBrand,
              }}
            >
              <img
                className="w-24 rounded-full"
                src={brandId?.imageBrand} // Đảm bảo đường dẫn hình ảnh được sử dụng đúng cách
                alt={brandId?.brandName}
              />

            </Link>
          </div>
          <div className="mt-4">
            <div
              className="flex mt-15 text-[20px] font-bold text-[#202020] leading-5 no-underline"
            >
              {brandId?.brandName}
            </div>
            <a href="">
              <img className="mt-3 h-4" src={trustBrand} alt="Trust Brand" />
            </a>
            {/* <div className="flex mt-4 mb-[40px]">
              <a className="mr-5 w-[120px] leading-6 " href="">
                <img className="w-[120px]" src={watchshop} alt="Watch Shop" />
              </a>
            </div> */}
          </div>
        </div>
        <div className="group-follow ml-32 w-[190px] leading-4 items-center mt-2 mb-4">
          <div className="satisfied flex mb-4">
            <span className="min-w-20"> Hài lòng: </span>
            <span className="text-pink-600 block">100%</span>
          </div>
          <div className="rating flex mb-4">
            <span className="min-w-20"> Đánh giá:</span>
            <span className="text-pink-600 block">5.0 / 5.0</span>
          </div>
        </div>
        <div className="group-info ml-32 leading-4 items-center mt-2 mb-4">
          <div className="folower flex mb-4">
            <span>
              <img className="w-4" src={checkGreen} alt="Check Green" />
            </span>
            <span className="pl-2 text-pink-600 block">100% chất lượng</span>
          </div>
          <div className="satisfied flex mb-4">
            <span>
              <img className="w-4" src={checkGreen} alt="Check Green" />
            </span>
            <span className="pl-2 text-pink-600 block">
              Phân phối chính hãng
            </span>
          </div>
          <div className="rating flex mb-4">
            <span>
              <img className="w-4" src={checkGreen} alt="Check Green" />
            </span>
            <span className="pl-2 text-pink-600 block">Đổi trả dễ dàng</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brand;
