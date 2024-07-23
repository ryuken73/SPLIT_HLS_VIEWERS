/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
// import ReactHlsPlayer from 'react-hls-player/dist';
import ReactHlsPlayer from './Components/ReactHlsPlayer';
import usePrevious from './hooks/usePrevious';
import {isPlayerPlaying} from './lib/sourceUtil';
import { replace } from './lib/arrayUtil';
import DraggableTitle from './Components/Player/DraggableTitle';

const Conatiner = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  background-color: black;
  aspect-ratio: 16/9;
`;
const CustomPlayer = styled(ReactHlsPlayer)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const hlsConfig = {
  enableWorker: false,
  debug: false,

  // liveBackBufferLength: 15,
  // backBufferLength1: 15,
  // liveMaxBackBufferLength: 15,
  // maxBufferSize: 0,
  // maxBufferLength: 10,
  // liveSyncDurationCount: 1,
  backBufferLength: 0,
  liveBackBufferLength: 0,
  liveMaxBackBufferLength: 0,
  maxBufferSize: 10,
  maxBufferLength: 10 * 1000 * 1000,
}

function HLSJSPlayer(props) {
  const {
    source,
    setPlayer,
    lastLoaded,
    cctvIndex,
    aspectRatio,
    onDrag,
    position,
    alignBy,
    showTitle=true,
    titleFontSize
  } = props;
  const playerRef = React.useRef(null);
  const { url } = source;

  const [reloadTrigger, setReloadTrigger] = React.useState(true);


  // console.log('re-render player:', cctvIndex, source.title);
  const onLoadDataHandler = React.useCallback((event) => {
    // console.log('^^^',event)
    event.target.play();
  }, []);

  // React.useEffect(() => {
  //   console.log('HLSJS Player mount')
  //   return () => console.log('HLSJS Player umount')
  // }, [])


  React.useLayoutEffect(() => {
    setPlayer(cctvIndex, playerRef.current);
    playerRef.current.addEventListener('loadedmetadata', onLoadDataHandler);
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (playerRef.current === null) return;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      playerRef.current.removeEventListener(
        'loadedmetadata',
        onLoadDataHandler,
      );
    }
  }, [cctvIndex, onLoadDataHandler, setPlayer])

  React.useEffect(() => {
    // console.log('reload while get next player: ', lastLoaded, cctvIndex);
    // eslint-disable-next-line @typescript-eslint/no-shadow
    setReloadTrigger((reloadTrigger) => {
      return !reloadTrigger;
    });
  }, [cctvIndex, lastLoaded]);

  return (
    <Conatiner>
      <CustomPlayer
        src={url}
        autoPlay={reloadTrigger}
        playerRef={playerRef}
        hlsConfig={hlsConfig}
        muted
        width="100%"
        aspectRatio={aspectRatio}
      />
      {showTitle && (
        <DraggableTitle
          onDrag={onDrag}
          position={position}
          title={source.title}
          alignBy={alignBy}
          titleFontSize={titleFontSize}
        />
      )}
    </Conatiner>
  );
};

export default React.memo(HLSJSPlayer);
