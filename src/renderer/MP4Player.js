/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import DraggableTitle from './Components/Player/DraggableTitle';

const Container = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100%;
  aspect-ratio: 16/9;
  position: relative;
  background-color: black;
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
    currentCCTVIndex,
    onDrag,
    position,
    alignBy,
    titleFontSize,
    showTitle,
    titleOpacity,
    titleBlur,
    autoInterval,
    autoPlay,
    showProgress
  } = props;

  const playerRef = React.useRef(null);
  const { url } = source;

  const [reloadTrigger, setReloadTrigger] = React.useState(true);
  const isActive = cctvIndex === currentCCTVIndex;

  const onLoadDataHandler = React.useCallback((event) => {
    // console.log(lastLoaded)
    if (playerRef.current === null) {
      return;
    }
    // console.log('loadedMetadata mp4', playerRef.current.duration);
    // eslint-disable-next-line no-restricted-globals
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
      {showTitle && (
        <DraggableTitle
          onDrag={onDrag}
          position={position}
          title={source.title}
          alignBy={alignBy}
          titleFontSize={titleFontSize}
          titleOpacity={titleOpacity}
          titleBlur={titleBlur}
          isActive={isActive}
          autoInterval={autoInterval}
          autoPlay={autoPlay}
          showProgress={showProgress}
        />
      )}
    </Container>
  );
}

export default React.memo(MP4Player);
