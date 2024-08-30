import React from 'react';

function SwiperCustom(props) {
  const { speed, children } = props;
  return (
    <div>SwiperCustom</div>
  )
}

export default React.memo(SwiperCustom);