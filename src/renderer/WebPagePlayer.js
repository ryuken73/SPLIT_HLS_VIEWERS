/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import Webview from './Webview';
import DraggableTitle from './Components/Player/DraggableTitle';

const Conatiner = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  background-color: black;
  aspect-ratio: 16/9;
`;

function WebPagePlayer(props) {
  const {
    source,
    setPlayer,
    cctvIndex,
    currentCCTVIndex,
    onDrag,
    position,
    alignBy,
    titleFontSize,
    titleOpacity,
    titleBlur,
    showTitle = true,
    autoInterval,
    autoPlay,
    showProgress,
  } = props;
  // const playerRef = React.useRef(null);
  const { url } = source;

  const isActive = cctvIndex === currentCCTVIndex;
  console.log('in webPagePlayer:', currentCCTVIndex);

  // React.useLayoutEffect(() => {
  //   setPlayer(cctvIndex, playerRef.current);
  // }, [cctvIndex, setPlayer]);

  return (
    <Conatiner>
      {/* <webview
        ref={playerRef}
        partition="no-xframe"
        style={{
          width: '100%',
          height: '100%',
        }}
        src={url}
      /> */}
      <Webview url={url} cctvIndex={cctvIndex} setPlayer={setPlayer} />
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
    </Conatiner>
  );
}

export default React.memo(WebPagePlayer);
