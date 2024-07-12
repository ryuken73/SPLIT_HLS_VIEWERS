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

const GridContainer = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: ${(props) => `repeat(${props.dimension}, 1fr)`};
  grid-template-rows: ${(props) => `repeat(${props.dimension}, 1fr)`};
  align-items: stretch;
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

  console.log(modalOpen)
  // const cctvs = [...cctvsInAreas.values()].flat();
  const currentIndexRef = React.useRef(null);
  currentIndexRef.current = currentActiveIndex;

  // console.log('#!Players',cctvPlayersRef.current, cctvsSelected, enableOverlayGlobal, currentIndexRef.current)

  const mp4RegExp = /.*\.mp4.*/;

  // const addToPreloadMap = (element) => {
  //   if (element === null) return;
  //   const cctvId = element.id;
  //   const preloadMap = preLoadMapRef.current;
  //   preloadMap.set(cctvId, element);
  // };

  useHotkeys('a', () => toggleAutoPlay(), [toggleAutoPlay]);
  useHotkeys('t', () => toggleOverlayGlobal(), [toggleOverlayGlobal]);

  const setCCTVPlayerRef = React.useCallback(
    (cctvIndex, player) => {
      cctvPlayersRef.current[cctvIndex] = player;
    },
    [cctvPlayersRef],
  );

  const Container = React.useCallback((props) => {
    const {modalBox, swiper, grid, children} = props;
    if (modalOpen){
      return (
        <ModalBox {...modalBox}>
          <Swiper {...swiper}>
            {children}
          </Swiper>
        </ModalBox>
      )
    }
    return <GridContainer {...grid}>{children}</GridContainer>

    },
    [],
  );

  return (
    <Container
      grid={{
        dimension: gridDimension
      }}
      modalBox={{
        open: modalOpen,
        modalOpenRef,
        currentCCTVIndex,
        gridDimension,
        keepMounted: true,
        autoPlay,
        setOpen: setModalOpen,
        contentWidth: '80%',
        contentHeight: 'auto',
      }}
      swiper={{
        loop: true,
        speed: 1500
      }}
    >
      <SwiperControl swiperRef={swiperRef} />
      {cctvsSelected.map((cctv, cctvIndex) => (
        <SwiperSlide key={cctv.cctvId}>
          {/* <Box
            key={cctv.cctvId}
            id={cctv.cctvId}
            ref={addToPreloadMap}
            overflow="hidden"
            minWidth="60px"
            height="100%"
          > */}
            {/* <div
              key={cctv.cctvId}
              id={cctv.cctvId}
              style={{
                // height: '100%',
                boxSizing: 'border-box',
                // padding: '1px',
                borderColor: 'black',
                // border: 'solid 1px black',
                // background: `${autoPlay ? 'maroon' : 'white'}`,
              }}
            > */}
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
                  width={350}
                  height={200}
                  fluid={false}
                  aspectRatio="16/9"
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
            {/* </div> */}
          {/* </Box> */}
        </SwiperSlide>
      ))}
    </Container>
  );
}

export default React.memo(GridVideos);
