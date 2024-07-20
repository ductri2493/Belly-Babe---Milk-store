import React, { useEffect, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
// import required modules
import { Pagination, Autoplay } from "swiper/modules";
//import voucherData
import { VoucherAPI } from "../../services/voucher";
import CustomNumberFormat from "../../utils/CustomNumberFormat";

export default function Voucher() {
  const [vouchers, setVoucher] = useState([]);
  useEffect(() => {
    const fetchVoucher = async () => {
      try {
        const response = await VoucherAPI.fetchVouchers()
        setVoucher(response.$values);
      } catch (error) {
        console.log("Falied to fetch voucher", error);
      }
    };
    fetchVoucher()
  }, [])
  return (
    <>

      <div className="section-page p-6 mt-4 rounded-2xl bg-white">
        <div className="header-title pb-6 space flex justify-between items-center">
          <h2 className="text-2xl font-bold inline-block">Nhận Voucher</h2>
        </div>
        {/* Voucher */}
        <Swiper
          slidesPerView={3}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          className="h-fit"
          pagination={{ dynamicBullets: true }}
          modules={[Pagination, Autoplay]}
          breakpoints={{
            // when window width is >= 640px
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            // when window width is >= 768px
            768: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            // when window width is >= 1024px
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
        >

          {vouchers.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="flex h-full container">
                {/* Price div */}
                <div className="voucher  flex-grow h-auto bg-[#eee2f2] rounded-lg text-center flex flex-col justify-center items-center">
                  <div className="text-[22px] px-3 font-black text-[#db2777]">
                    <CustomNumberFormat numStr={item.price} />
                  </div>
                  <div className="text-xs font-bold text-[#9d1753]">
                    Cho đơn hàng  <CustomNumberFormat numStr={item.minimumBillAmount} />
                  </div>
                </div>
                <div className="border-dotted border-[2px] my-3 border-[#db2777]"></div>
                {/* Detail div */}
                <div className="flex-grow w-[240px] h-auto voucher bg-[#eee2f2] pl-4 rounded-lg flex flex-col justify-between">
                  <span className="text-sm mt-1 mx-3 font-black text-[#9d1753]">
                    {item.voucherName}
                  </span>
                  <div className="text-sm mx-3 font-bold text-[#db2777]">
                    Dành cho thành viên của Belly&Babe
                  </div>
                  <div className="text-center mt-auto mb-1">
                    <span className="text-xs text-gray-600 font-bold">
                      Áp dụng đến ngày {new Date(item.expiredDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
