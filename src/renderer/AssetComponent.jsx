import React from 'react';
import WebPagePlayer from './WebPagePlayer';
import MP4Player from './MP4Player';
import HLSJSPlayer from './HLSJSPlayer';
import YoutubeJSPlayer from './YoutubeJSPlayer';

const viewMap = {
  web: WebPagePlayer,
  mp4: MP4Player,
  hls: HLSJSPlayer,
  ytb: YoutubeJSPlayer,
};

const mp4RegExp = /.*\.mp4.*/;
const youtubeRegExp = /.*youtube.com\/.*/;

export default function AssetComponent(props) {
  const { source } = props;
  const type =
    source.type === 'web'
      ? 'web'
      : mp4RegExp.test(source.url)
        ? 'mp4'
        : youtubeRegExp.test(source.url)
          ? 'ytb'
          : 'hls';
  const Viewer = viewMap[type];
  return <Viewer {...props} />;
}
