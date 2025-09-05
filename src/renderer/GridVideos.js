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
  display: ${(props) => props.gridEnabled && 'grid'};
  grid-template-columns: ${(props) => props.gridEnabled && '1fr 1fr'};
  grid-gap: ${(props) => props.gridEnabled && '0.4rem'};
  height: auto;
  width: 75vw;
`;
const AssetContainer = styled.div`
  position: ${(props) => !props.gridEnabled && 'absolute'};
  top: ${(props) => !props.gridEnabled && 0};
  left: ${(props) => !props.gridEnabled && 0};
  height: 100%;
  width: 100%;
  opacity: ${(props) => props.gridEnabled && '1 !important'};
  z-index: ${(props) =>
    props.gridEnabled ? '10 !important' : props.cctvIndex * -1};
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
    fourBy4Enabled
  } = props;

  const [titlePosition, setTitlePosition] = React.useState({ x: 0, y: 0 });
  // console.log('#!Players',cctvPlayersRef.current, cctvsSelected, enableOverlayGlobal, currentIndexRef.current)

  useHotkeys(
    'a',
    () => {
      if (fourBy4Enabled) return;
      toggleAutoPlay();
    },
    [toggleAutoPlay],
  );
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

  const cctvsToShow = fourBy4Enabled
    ? cctvsSelected.slice(0, 4)
    : cctvsSelected;

  return (
    <Container gridEnabled={fourBy4Enabled}>
      {cctvsToShow.map((cctv, cctvIndex) => (
        <AssetContainer
          key={cctv.cctvId}
          cctvIndex={cctvIndex}
          ref={(el) => (assetsRef.current[cctvIndex] = el)}
          gridEnabled={fourBy4Enabled}
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
            lastLoaded={cctvLastLoadedTime[cctvIndex]}
          />
        </AssetContainer>
      ))}
    </Container>
  );
}

export default React.memo(GridVideos);
