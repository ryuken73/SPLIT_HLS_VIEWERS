import React from 'react';

function Webview(props) {
  // eslint-disable-next-line react/prop-types
  const { url, cctvIndex, setPlayer } = props;
  console.log('in Webview:', cctvIndex);
  const playerRef = React.useRef(null);
  React.useLayoutEffect(() => {
    setPlayer(cctvIndex, playerRef.current);
  }, [cctvIndex, setPlayer]);

  return (
    <webview
      ref={playerRef}
      partition="no-xframe"
      style={{
        width: '100%',
        height: '100%',
      }}
      src={url}
    />
  )
}

export default React.memo(Webview)