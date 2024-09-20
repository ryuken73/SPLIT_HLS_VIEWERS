/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import YouTubePlayer from 'react-player/youtube';
import DraggableTitle from './Components/Player/DraggableTitle';

const PLAYER_STATUS = {
  normal: 'normal',
  pause: 'pause',
  stalled: 'stalled',
};

const Container = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100%;
  aspect-ratio: 16/9;
  position: relative;
  background-color: black;
`;

function YoutubePlayer(props) {
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
    titleOpacity,
    titleBlur,
    showTitle,
    autoInterval,
    autoPlay,
    showProgress,
    setVideoStates,
  } = props;
  const playerRef = React.useRef(null);
  const { url } = source;

  const [reloadTrigger, setReloadTrigger] = React.useState(true);
  const isActive = cctvIndex === currentCCTVIndex;
  const IS_PREVIEW = !showTitle;

  const onLoadDataHandler = React.useCallback((event) => {
    // console.log(lastLoaded)
    if (playerRef.current === null) {
      return;
    };
    // eslint-disable-next-line no-restricted-globals
    if (!isNaN(playerRef.current.duration)) {
      playerRef.current.play();
    };
  }, []);

  React.useEffect(() => {
    if (playerRef.current === null) {
      return;
    }
    // console.log('^^^ setPlayer:', playerRef.current)
    setPlayer(cctvIndex, playerRef.current);
  }, [cctvIndex, setPlayer]);

  //neet to reload player method
  React.useEffect(() => {
    // console.log('reload while get next player: ', lastLoaded, cctvIndex);
    // eslint-disable-next-line @typescript-eslint/no-shadow
    console.log('reload youtube js player', lastLoaded);
    setReloadTrigger((reloadTrigger) => {
      return !reloadTrigger;
    });
    console.log(playerRef.current);
    // playerRef.current.load();
  }, [lastLoaded]);

  const setPlayerNormal = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (event) => {
      if (IS_PREVIEW) return;
      setVideoStates((videoStates) => {
        return {
          ...videoStates,
          [url]: PLAYER_STATUS.normal,
        };
      });
    },
    [IS_PREVIEW, setVideoStates, url],
  );
  const setPlayerPaused = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (event) => {
      if (IS_PREVIEW) return;
      setVideoStates((videoStates) => {
        return {
          ...videoStates,
          [url]: PLAYER_STATUS.pause,
        };
      });
    },
    [IS_PREVIEW, setVideoStates, url],
  );
  const setPlayerStalled = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (event) => {
      if (IS_PREVIEW) return;
      setVideoStates((videoStates) => {
        return {
          ...videoStates,
          [url]: PLAYER_STATUS.stalled,
        };
      });
    },
    [IS_PREVIEW, setVideoStates, url],
  );

  return (
    <Container>
      <YouTubePlayer
        url={url}
        ref={playerRef}
        playing
        muted
        width="100%"
        height="100%"
        onReady={onLoadDataHandler}
        onPlay={setPlayerNormal}
        onPause={setPlayerPaused}
        onEnded={setPlayerPaused}
        onError={setPlayerStalled}
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

export default React.memo(YoutubePlayer);
