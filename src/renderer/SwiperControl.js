import React from 'react';
import { useSwiper } from 'swiper/react';

function SliderControl(props) {
  const {swiperRef, children} = props;
  const swiper = useSwiper();
  console.log(swiper)
  swiperRef.current = swiper;
  console.log('assign swiperRef:', swiperRef.current)
  return (
    <div>{children}</div>
  )
}

export default React.memo(SliderControl);
