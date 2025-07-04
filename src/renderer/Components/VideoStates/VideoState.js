/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import { remove } from '../../lib/arrayUtil';
import colors from '../../lib/colors';

const { autoRun, idle } = colors;

const Container = styled.div`
  background: ${(props) => props.bgcolor || 'black'};
  font-weight: bold;
  line-height: 44px;
  text-align: center;
  border-radius: 10px;
  min-width: 100px;
  max-width: 200px;
  border: ${(props) =>
    props.isActive ? '2px solid yellow' : '2px solid white'};
  box-sizing: border-box;
  cursor: pointer;
  margin: 10px;
`;
const Title = styled.div`
  padding-left: 10px;
  padding-right: 10px;
  /* color: ${(props) => props.color || 'white'}; */
  color: ${(props) => props.color || 'white'};
  font-size: clamp(1rem, 2vw, 1.5rem);
  /* font-size: 2vw; */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-decoration: ${(props) => props.disabled && 'line-through'};
`;
const SubTitle = styled.div`
  color: yellow;
  font-size: 0.9rem;
  line-height: 0.9rem;
  margin-bottom: 5px;
  margin-left: 5px;
  margin-right: 5px;
  text-decoration: ${(props) => props.disabled && 'line-through'};
`;
const TimeDisplay = styled(SubTitle)`
  color: white;
  font-size: 0.7rem;
  line-height: 0.7rem;
  text-decoration: ${(props) => props.disabled && 'line-through'};
`;
const StyledSpan = styled.span`
  color: red;
  cursor: pointer;
  font-weight: 700;
`;
const PLAYER_STATUS = {
  normal: 'normal',
  pause: 'pause',
  stalled: 'stalled',
};
const PLAYER_EVENTS = {
  playing: 'playing',
  pause: 'pause',
  stalled: 'stalled',
  suspend: 'suspend',
  error: 'error',
  abort: 'abort',
  waiting: 'waiting',
  ended: 'ended',
};

const secondToHHMMSS = (seconds) => {
  return new Date(seconds * 1000).toISOString().slice(11, 19);
};

function VideoState(props) {
  // eslint-disable-next-line react/prop-types
  const {
    autoPlay,
    cctv,
    cctvIndex,
    currentCCTVIndex,
    cctvPlayersRef,
    numberOfReset,
    maxNumberOfResets,
    setVideoStates,
    playerStatus,
    moveToSlide,
    setCCTVsSelectedAray,
    setNumberOfResets,
  } = props;
  // const [playerStatus, setPlayerStatus] = React.useState(PLAYER_STATUS.pause);
  const [currentTime, setCurrentTime] = React.useState(secondToHHMMSS(0));
  const [duration, setDuration] = React.useState(secondToHHMMSS(0));
  const isActive = cctvIndex === currentCCTVIndex;
  const isPaused = playerStatus === PLAYER_STATUS.pause;
  const isStalled = playerStatus === PLAYER_STATUS.stalled;
  // console.log(' re-render playerStatue=', cctv.title, playerStatus)

  const disabled = numberOfReset > maxNumberOfResets;
  const { url } = cctv;
  // eslint-disable-next-line react/prop-types
  const handlePlayerEvent = React.useCallback(
    (event) => {
      const { type } = event;
      // console.log('player event captured:', cctvIndex, type);
      if (type === PLAYER_EVENTS.playing) {
        // console.log('player is playing!');
        setVideoStates((videoStates) => {
          return {
            ...videoStates,
            [url]: PLAYER_STATUS.normal,
          };
        });
        return;
      }
      if (type === PLAYER_EVENTS.pause || type === PLAYER_EVENTS.ended) {
        // console.log('player is paused!');
        setVideoStates((videoStates) => {
          return {
            ...videoStates,
            [url]: PLAYER_STATUS.pause,
          };
        });
        return;
      }
      // console.log('player is stalled!');
      setVideoStates((videoStates) => {
        return {
          ...videoStates,
          [url]: PLAYER_STATUS.stalled,
        };
      });
    },
    [setVideoStates, url],
  );

  const updateCurrentTime = React.useCallback((event) => {
    const HHMMSS = secondToHHMMSS(event.target.currentTime);
    setCurrentTime(HHMMSS);
  }, []);

  const updateDuration = React.useCallback((event) => {
    const HHMMSS = secondToHHMMSS(event.target.duration);
    setDuration(HHMMSS);
  }, []);

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const player = cctvPlayersRef.current[cctvIndex];
    if (player === undefined) return;
    // eslint-disable-next-line react/prop-types
    if (player.addEventListener === undefined) {
      return;
    }
    player.addEventListener('playing', handlePlayerEvent);
    player.addEventListener('pause', handlePlayerEvent);
    player.addEventListener('stalled', handlePlayerEvent);
    player.addEventListener('error', handlePlayerEvent);
    player.addEventListener('waiting', handlePlayerEvent);
    player.addEventListener('ended', handlePlayerEvent);
    player.addEventListener('abort', handlePlayerEvent);
    player.addEventListener('timeupdate', updateCurrentTime);
    player.addEventListener('durationchange', updateDuration);

    // eslint-disable-next-line consistent-return
    return () => {
      if (player.removeEventListener === undefined) return;
      if (player !== undefined) {
        player.removeEventListener('playing', handlePlayerEvent);
        player.removeEventListener('pause', handlePlayerEvent);
        player.removeEventListener('stalled', handlePlayerEvent);
        player.removeEventListener('error', handlePlayerEvent);
        player.removeEventListener('waiting', handlePlayerEvent);
        player.removeEventListener('ended', handlePlayerEvent);
        player.removeEventListener('abort', handlePlayerEvent);
      }
    };
  }, [
    cctvIndex,
    cctvPlayersRef,
    handlePlayerEvent,
    updateCurrentTime,
    updateDuration,
  ]);

  const onClick = React.useCallback(() => {
    moveToSlide(cctvIndex);
  }, [cctvIndex, moveToSlide]);

  const getBackgroundColor = React.useCallback(() => {
    if (isActive) {
      return autoRun[900];
    }
    if (isStalled) {
      return 'grey';
    }
    if (isPaused) {
      return 'darkslategrey';
    }
    if (autoPlay) {
      // return autoRun[950];
      return idle[950];
    }
    return idle[950];
  }, [autoPlay, isActive, isPaused, isStalled]);

  const getTitleColor = React.useCallback(() => {
    if (isActive) {
      return 'yellow';
    }
    return autoRun[50];
  }, [isActive]);

  const removeItem = React.useCallback(
    (e) => {
      e.stopPropagation();
      window.electron.ipcRenderer.sendMessage(
        'addHistoryDB',
        'del',
        JSON.stringify(cctv),
      );
      setCCTVsSelectedAray((cctvs) => {
        cctvPlayersRef.current = [
          ...cctvPlayersRef.current.slice(0, cctvIndex),
          ...cctvPlayersRef.current.slice(cctvIndex + 1),
        ];
        // console.log(cctvPlayersRef.current)
        return remove(cctvs).fromIndex(cctvIndex);
      });
      // eslint-disable-next-line @typescript-eslint/no-shadow
      setNumberOfResets((numberOfResets) => {
        return remove(numberOfResets).fromIndex(cctvIndex);
      });
    },
    [cctv, cctvIndex, cctvPlayersRef, setCCTVsSelectedAray, setNumberOfResets],
  );

  const bgColor = getBackgroundColor();
  const titleColor = getTitleColor();
  // eslint-disable-next-line no-nested-ternary
  // console.log('player state =', playerStatus, isStalled, bgColor, cctv.title)

  return (
    <Container isActive={isActive} bgcolor={bgColor} onClick={onClick}>
      <Title disabled={disabled} color={titleColor}>
        {cctv.title}
      </Title>
      <SubTitle disabled={disabled}>Reset Count [{numberOfReset}]</SubTitle>
      <TimeDisplay disabled={disabled}>
        {currentTime} / {duration}{' '}
        <StyledSpan onClick={removeItem}>[del]</StyledSpan>
      </TimeDisplay>
    </Container>
  );
}

export default React.memo(VideoState);
