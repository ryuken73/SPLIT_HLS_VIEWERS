/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import DraggableTitle from './Components/Player/DraggableTitle';

const Container = styled.div`
  overflow: hidden;
  width: 100%;
  height: ${(props) => !props.isModalPlayer && '100%'};
  aspect-ratio: ${(props) => props.isModalPlayer && '16/9'};
  position: relative;
  background-color: black;
`;
const Overlay = styled.div`
  display: ${(props) => !props.show && 'none'};
  position: absolute;
  bottom: 100px;
  right: 5px;
  font-size: ${(props) => (props.big ? '3vw' : '1.5vw')};
  font-weight: bold;
  opacity: 0.6;
  border: 3px solid darkviolet;
  border-radius: 10px;
  background: darkblue;
  color: white;
  z-index: 1000;
  padding: 15px;
  padding-left: 30px;
  padding-right: 30px;
  text-align: center;
  line-height: 1;
  word-break: initial;
  font-family: Arial, Helvetica, sans-serif;
`;
const CustomVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;


function MP4Player(props) {
  const {
    source = {},
    setPlayer,
    lastLoaded,
    cctvIndex,
    aspectRatio,
    onDrag,
    position,
    alignBy
  } = props;
  // const prevRefreshInterval = usePrevious(refreshInterval);
  // const isRefreshIntervalChanged = prevRefreshInterval !== refreshInterval;
  // const RELOAD_COUNTDOWN = getRandomCountdown(refreshInterval)
  // const [currentCountDown, setCurrentCountDown] = React.useState(RELOAD_COUNTDOWN);
  // const [lastReloadTime, setLastReloadTime] = React.useState(Date.now());
  // const [loadDateTime, setLoadDateTime] = React.useState(null);
  const playerRef = React.useRef(null);
  const { url } = source;

  const [reloadTrigger, setReloadTrigger] = React.useState(true);

  // React.useEffect(() => {
  // console.log('reload mp4 player:', lastLoaded)
  //   if(playerRef.current === null){
  //     return;
  //   }
  //   playerRef.current.load();
  // }, [lastLoaded]);

  const onLoadDataHandler = React.useCallback((event) => {
    // console.log(lastLoaded)
    if (playerRef.current === null) {
      return;
    }
    // console.log('loadedMetadata mp4', playerRef.current.duration);
    if (!isNaN(playerRef.current.duration)) {
      playerRef.current.play();
    }
  }, []);

  React.useLayoutEffect(() => {
    if (playerRef.current === null) {
      return;
    }
    setPlayer(cctvIndex, playerRef.current);
    playerRef.current.addEventListener('loadedmetadata', onLoadDataHandler);
    // playerRef.current.addEventListener('ended', reloadPlayer)
    // eslint-disable-next-line consistent-return
    return () => {
      if (playerRef.current === null) return;
      playerRef.current.removeEventListener(
        'loadedmetadata',
        onLoadDataHandler,
      );
    };
  }, [cctvIndex, onLoadDataHandler, setPlayer]);

    React.useEffect(() => {
    // console.log('reload while get next player: ', lastLoaded, cctvIndex);
    // eslint-disable-next-line @typescript-eslint/no-shadow
    console.log('reload mp4 player', lastLoaded)
    setReloadTrigger((reloadTrigger) => {
      return !reloadTrigger;
    });
    console.log(playerRef.current)
    playerRef.current.load();
  }, [cctvIndex, lastLoaded]);

  // React.useLayoutEffect(() => {
  //   if (autoRefresh === false) {
  //     setPlayer(20, playerRef.current, playerNum);
  //   }
  // }, [autoRefresh, playerNum, setPlayer]);

  return (
    <Container>
      <CustomVideo
        src={url}
        autoPlay={reloadTrigger}
        ref={playerRef}
        muted
        width="100%"
        crossOrigin="anonymous"
        controls
      />
      <DraggableTitle
        onDrag={onDrag}
        position={position}
        title={source.title}
        alignBy={alignBy}
      />
    </Container>
  );
}

export default React.memo(MP4Player);
