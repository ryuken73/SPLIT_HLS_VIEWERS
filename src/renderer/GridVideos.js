/* eslint-disable react/prop-types */
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { EffectFade } from 'swiper';
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

  return (
    <Container>
      <Swiper loop speed={1500}>
        <SwiperControl swiperRef={swiperRef} />
        {cctvsSelected.map((cctv, cctvIndex) => (
          <SwiperSlide key={cctv.cctvId}>
            {mp4RegExp.test(cctv.url) ? (
              <MP4Player
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
                autoPlay={autoPlay}
                player={cctvPlayersRef.current[cctvIndex]}
                // width={350}
                // height={200}
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
