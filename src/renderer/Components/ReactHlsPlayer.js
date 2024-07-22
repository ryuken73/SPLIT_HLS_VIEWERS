/* eslint-disable react/prop-types */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, RefObject } from 'react';
import Hls, { Config } from 'hls.js';

function ReactHlsPlayer({
  hlsConfig,
  playerRef = React.createRef(),
  src,
  autoPlay,
  ...props
}) {
  useEffect(() => {
    let hls;

    function _initPlayer() {
      if (hls != null) {
        hls.destroy();
      }

      const newHls = new Hls({
        enableWorker: false,
        ...hlsConfig,
      });

      if (playerRef.current != null) {
        newHls.attachMedia(playerRef.current);
      }

      newHls.on(Hls.Events.MEDIA_ATTACHED, () => {
        newHls.loadSource(src);

        newHls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (autoPlay) {
            playerRef?.current
              ?.play()
              .catch(() =>
                console.log(
                  'Unable to autoplay prior to user interaction with the dom.',
                ),
              );
          }
        });
      });

      newHls.on(Hls.Events.ERROR, function (event, data) {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              newHls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              newHls.recoverMediaError();
              break;
            default:
              _initPlayer();
              break;
          }
        }
      });

      hls = newHls;
    }

    // Check for Media Source support
    if (Hls.isSupported()) {
      _initPlayer();
    }

    return () => {
      if (hls != null) {
        hls.destroy();
      }
    };
  }, [autoPlay, hlsConfig, playerRef, src]);

  // If Media Source is supported, use HLS.js to play video
  // eslint-disable-next-line jsx-a11y/media-has-caption
  if (Hls.isSupported()) return <video ref={playerRef} {...props} />;

  // Fallback to using a regular video player if HLS is supported by default in the user's browser
  // eslint-disable-next-line jsx-a11y/media-has-caption
  return <video ref={playerRef} src={src} autoPlay={autoPlay} {...props} />;
}

export default ReactHlsPlayer;
