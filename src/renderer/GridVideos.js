/* eslint-disable react/prop-types */
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { EffectFade, EffectFlip, EffectCube } from 'swiper/modules';
import { remove } from './lib/arrayUtil';
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
    alignBy,
    titleFontSize,
    showTitle
  } = props;

  // const cctvs = [...cctvsInAreas.values()].flat();
  const [titlePosition, setTitlePosition] = React.useState({ x: 0, y: 0 });
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

  const delCCTVPlayerRef = React.useCallback((cctvIndex) => {
      console.log('delCCTVPlayer before:', cctvPlayersRef.current)
      const removed = remove(cctvPlayersRef.current).fromIndex(cctvIndex);
      cctvPlayersRef.current = removed;
      console.log('delCCTVPlayer after:', cctvPlayersRef.current)
    },
    [cctvPlayersRef],
  );

  const handleTitleDrag = React.useCallback((event, draggableData) => {
    setTitlePosition({
      x: draggableData.x,
      y: draggableData.y
    });
  }, []);

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
        speed={500}
        // speed={3000}
        effect="fade"
        noSwipingClass="react-draggable"
        fadeEffect={{ crossFade: true }}
        modules={[EffectFade, EffectCube, EffectFlip]}
      >
        <SwiperControl cctvsSelected={cctvsSelected} swiperRef={swiperRef} />
        {cctvsSelected.map((cctv, cctvIndex) => (
          <SwiperSlide key={cctv.cctvId}>
            {mp4RegExp.test(cctv.url) ? (
              <MP4Player
                key={cctv.cctvId}
                source={cctv}
                setPlayer={setCCTVPlayerRef}
                lastLoaded={cctvLastLoadedTime[cctvIndex]}
                cctvIndex={cctvIndex}
                aspectRatio="4/3"
                onDrag={handleTitleDrag}
                position={titlePosition}
                alignBy={alignBy}
                titleFontSize={titleFontSize}
                showTitle={showTitle}
              />
            ) : (
              <HLSJSPlayer
                key={cctv.cctvId}
                source={cctv}
                setPlayer={setCCTVPlayerRef}
                lastLoaded={cctvLastLoadedTime[cctvIndex]}
                cctvIndex={cctvIndex}
                aspectRatio="4/3"
                onDrag={handleTitleDrag}
                position={titlePosition}
                alignBy={alignBy}
                titleFontSize={titleFontSize}
                showTitle={showTitle}
                // autoPlay={autoPlay}
                // player={cctvPlayersRef.current[cctvIndex]}
                // width="100%"
                // height="auto"
                // fluid={false}
                // fill
                // delPlayer={delCCTVPlayerRef}
                // enableOverlay={enableOverlayGlobal}
                // overlayBig
                // overlayContent={cctv.title}
                // currentIndexRef={currentIndexRef}
                // currentCCTVIndex={currentCCTVIndex}
                // autoRefresh
                // setLastLoadedTime={setLastLoadedTime}
                // refreshMode={refreshMode}
                // refreshInterval={refreshInterval}
                // reloadPlayerComponent={reloadPlayerComponent}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
}

export default React.memo(GridVideos);
