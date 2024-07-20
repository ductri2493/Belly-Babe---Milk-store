// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "./Banner.css";

// import required modules
import { Autoplay, Pagination } from "swiper/modules";

// import data
import banner1 from "../../assets/img/Banner_1.png";
import banner2 from "../../assets/img/Banner_2.png";
import banner3 from "../../assets/img/Banner_3.png";
import banner4 from "../../assets/img/Banner_4.png";

export default function Banner({ numberOfSLide, navigation }) {
  return (
    <>
      <Swiper
        slidesPerView={numberOfSLide}
        spaceBetween={30}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        navigation={navigation}
        pagination={{ dynamicBullets: true }}
        modules={[Pagination, Autoplay]}
        className="rounded-[10px] h-fit"
      >
        <SwiperSlide>
          <img src={banner1} alt="" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={banner2} alt="" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={banner3} alt="" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={banner4} alt="" />
        </SwiperSlide>
      </Swiper>
    </>
  );
}
