/* eslint-disable react/prop-types */
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { EffectFade, EffectFlip, EffectCube } from 'swiper/modules';
import {
  AbsolutePositionBox,
  TransparentPaper,
} from './template/basicComponents';
import MP4Player from './MP4Player';
import Box from '@mui/material/Box';
import ModalBox from './ModalBox';
import SwiperControl from './SwiperControl';
import styled from 'styled-components';
import HLSJSPlayer from './HLSJSPlayer';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-flip';
import 'swiper/css/effect-cube';

const Container = styled.div`
  height: auto;
  width: 75vw;
`;
function GridVideos(props) {
  const {
    modalOpen = false,
    modalOpenRef,
    setModalOpen,
    swiperRef,
    preLoadMapRef = null,
    cctvsSelected = [],
    // setPlayer,
    toggleAutoPlay,
    autoPlay,
    gridDimension = 2,
    enableOverlayGlobal,
    toggleOverlayGlobal,
    currentActiveIndex,
    cctvPlayersRef,
    cctvLastLoadedTime,
    setLastLoadedTime,
    reloadPlayerComponent,
    refreshMode,
    refreshInterval,
    currentCCTVIndex,
  } = props;

  // const cctvs = [...cctvsInAreas.values()].flat();
  const currentIndexRef = React.useRef(null);
  currentIndexRef.current = currentActiveIndex;

  // console.log('#!Players',cctvPlayersRef.current, cctvsSelected, enableOverlayGlobal, currentIndexRef.current)

  const mp4RegExp = /.*\.mp4.*/;

  useHotkeys('a', () => toggleAutoPlay(), [toggleAutoPlay]);
  useHotkeys('t', () => toggleOverlayGlobal(), [toggleOverlayGlobal]);

  const setCCTVPlayerRef = React.useCallback(
    (cctvIndex, player) => {
      cctvPlayersRef.current[cctvIndex] = player;
    },
    [cctvPlayersRef],
  );
  const onClick = React.useCallback((event) => {
    const targetIndex = parseInt(event.target.id, 10)
    const swipers = document.getElementsByClassName('swiper-slide');
    swipers[targetIndex].style.width = '0';
    swiperRef.current.update();
    },
    [swiperRef],
  );
  const onClick1 = React.useCallback((event) => {
    const targetIndex = parseInt(event.target.id, 10)
    const swipers = document.getElementsByClassName('swiper-slide');
    swipers[targetIndex].style.width = '756px';
    swiperRef.current.update();
    },
    [swiperRef],
  );

  return (
    <Container>
      {/* {cctvsSelected.map((cctv, index) => (
        <button key={cctv.cctvId} id={index} onClick={onClick}>{index}</button>
      ))}
      {cctvsSelected.map((cctv, index) => (
        <button key={cctv.cctvId} id={index} onClick={onClick1}>{index}</button>
      ))} */}
      <Swiper
        loop
        speed={1500}
        // speed={3000}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        modules={[EffectFade, EffectCube, EffectFlip]}
      >
        <SwiperControl swiperRef={swiperRef} />
        {cctvsSelected.map((cctv, cctvIndex) => (
          <SwiperSlide key={cctv.cctvId}>
            {mp4RegExp.test(cctv.url) ? (
              <MP4Player
                key={cctv.cctvId}
                source={cctv}
                cctvIndex={cctvIndex}
                currentIndexRef={currentIndexRef}
                autoRefresh
                setPlayer={setCCTVPlayerRef}
                lastLoaded={cctvLastLoadedTime[cctvIndex]}
                reloadPlayerComponent={reloadPlayerComponent}
                refreshMode={refreshMode}
                refreshInterval={refreshInterval}
                overlayContent={cctv.title}
              />
            ) : (
              <HLSJSPlayer
                key={cctv.cctvId}
                autoPlay={autoPlay}
                player={cctvPlayersRef.current[cctvIndex]}
                width="100%"
                height="auto"
                fluid={false}
                aspectRatio="4/3"
                fill
                source={cctv}
                setPlayer={setCCTVPlayerRef}
                enableOverlay={enableOverlayGlobal}
                overlayBig
                overlayContent={cctv.title}
                cctvIndex={cctvIndex}
                currentIndexRef={currentIndexRef}
                currentCCTVIndex={currentCCTVIndex}
                autoRefresh
                lastLoaded={cctvLastLoadedTime[cctvIndex]}
                setLastLoadedTime={setLastLoadedTime}
                refreshMode={refreshMode}
                refreshInterval={refreshInterval}
                reloadPlayerComponent={reloadPlayerComponent}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
}

export default React.memo(GridVideos);
