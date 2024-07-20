import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import SwiperCore from 'swiper/core';
import { Autoplay, Navigation, Thumbs } from 'swiper/modules';

// Install Swiper modules
SwiperCore.use([Autoplay, Navigation, Thumbs]);

const Thumbnails = ({
  images,
  numberOfMainSlide,
  numberOfSubSlide,
  interval = 3000,
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [imagesArray, setImagesArray] = useState([]);

  useEffect(() => {
    if (images) {
      const linksArray = images.split(',');
      const imagesArray = linksArray.map((link, index) => ({
        id: index,
        image: link.trim(),
        title: `Image ${index + 1}`,
      }));
      setImagesArray(imagesArray);
    } else {
      setImagesArray([]);
    }
  }, [images]);

  const imgLength = imagesArray?.length;

  return (
    <>
      {imgLength > 0 && (
        <>
          {/* swiper 1 */}
          <Swiper
            spaceBetween={10}
            slidesPerView={numberOfMainSlide}
            loop={true}
            autoplay={{ delay: interval, disableOnInteraction: false }}
            effect='fade'
            thumbs={{
              swiper:
                thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
            }}
            className='mySwiper2'
          >
            {imagesArray.map((item, index) => (
              <SwiperSlide key={item.id}>
                <div href=''>
                  <img
                    src={item.image}
                    alt={item.title}
                    loading='lazy'
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* swiper 2 */}
          <Swiper
            freeMode={true}
            spaceBetween={10}
            className='mySwiper'
            navigation={imgLength > 1}
            loop={true}
            watchSlidesProgress={true}
            onSwiper={setThumbsSwiper}
            slidesPerView={numberOfSubSlide}
            modules={[Thumbs, Navigation]}
          >
            {imagesArray.map((item, i) => (
              <SwiperSlide key={item.id}>
                <img
                  src={item.image}
                  alt={item.title}
                  loading='lazy'
                  style={{ width: '100%', height: 'auto' }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </>
  );
};

export default Thumbnails;
