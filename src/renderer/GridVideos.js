/* eslint-disable no-return-assign */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
// import { EffectFade, EffectFlip, EffectCube } from 'swiper/modules';
import styled from 'styled-components';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import SwiperControl from './SwiperControl';
import AssetComponent from './AssetComponent';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-flip';
import 'swiper/css/effect-cube';

const Container = styled.div`
  height: auto;
  width: 75vw;
`;
const AssetContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  opacity: 1;
  z-index: ${props => props.cctvIndex * -1};
`;
function GridVideos(props) {
  const {
    swiperRef,
    cctvsSelected = [],
    toggleAutoPlay,
    autoPlay,
    toggleOverlayGlobal,
    cctvPlayersRef,
    cctvLastLoadedTime,
    currentCCTVIndex,
    alignBy,
    titleFontSize,
    titleOpacity,
    titleBlur,
    showTitle,
    autoInterval,
    showProgress,
    setVideoStates,
    assetsRef,
  } = props;

  const [titlePosition, setTitlePosition] = React.useState({ x: 0, y: 0 });
  // console.log('#!Players',cctvPlayersRef.current, cctvsSelected, enableOverlayGlobal, currentIndexRef.current)

  useHotkeys('a', () => toggleAutoPlay(), [toggleAutoPlay]);
  useHotkeys('t', () => toggleOverlayGlobal(), [toggleOverlayGlobal]);

  const setCCTVPlayerRef = React.useCallback(
    (cctvIndex, player) => {
      cctvPlayersRef.current[cctvIndex] = player;
    },
    [cctvPlayersRef],
  );

  const handleTitleDrag = React.useCallback((event, draggableData) => {
    setTitlePosition({
      x: draggableData.x,
      y: draggableData.y,
    });
  }, []);

  return (
    <Container>
      {cctvsSelected.map((cctv, cctvIndex) => (
        <AssetContainer
          key={cctv.cctvId}
          cctvIndex={cctvIndex}
          ref={(el) => (assetsRef.current[cctvIndex] = el)}
        >
          <AssetComponent
            source={cctv}
            setPlayer={setCCTVPlayerRef}
            cctvIndex={cctvIndex}
            currentCCTVIndex={currentCCTVIndex}
            onDrag={handleTitleDrag}
            position={titlePosition}
            alignBy={alignBy}
            titleFontSize={titleFontSize}
            titleOpacity={titleOpacity}
            titleBlur={titleBlur}
            showTitle={showTitle}
            autoInterval={autoInterval}
            autoPlay={autoPlay}
            showProgress={showProgress}
            setVideoStates={setVideoStates}
          />
        </AssetContainer>
      ))}
    </Container>
  );
}

export default React.memo(GridVideos);
