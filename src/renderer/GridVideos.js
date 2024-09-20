/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { EffectFade, EffectFlip, EffectCube } from 'swiper/modules';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import MP4Player from './MP4Player';
import SwiperControl from './SwiperControl';
import HLSJSPlayer from './HLSJSPlayer';
import YoutubeJSPlayer from './YoutubeJSPlayer';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-flip';
import 'swiper/css/effect-cube';

const Container = styled.div`
  height: auto;
  width: 75vw;
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
    setVideoStates
  } = props;

  const [titlePosition, setTitlePosition] = React.useState({ x: 0, y: 0 });
  // console.log('#!Players',cctvPlayersRef.current, cctvsSelected, enableOverlayGlobal, currentIndexRef.current)

  const mp4RegExp = /.*\.mp4.*/;
  const youtubeRegExtp = /.*youtube.com\/.*/;

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
      y: draggableData.y
    });
  }, []);

  return (
    <Container>
      <Swiper
        loop
        speed={500}
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
              />
            ) : youtubeRegExtp.test(cctv.url) ? (
              <YoutubeJSPlayer
                key={cctv.cctvId}
                source={cctv}
                setPlayer={setCCTVPlayerRef}
                lastLoaded={cctvLastLoadedTime[cctvIndex]}
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
            ) : (
              <HLSJSPlayer
                key={cctv.cctvId}
                source={cctv}
                setPlayer={setCCTVPlayerRef}
                lastLoaded={cctvLastLoadedTime[cctvIndex]}
                cctvIndex={cctvIndex}
                currentCCTVIndex={currentCCTVIndex}
                aspectRatio="4/3"
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
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
}

export default React.memo(GridVideos);
