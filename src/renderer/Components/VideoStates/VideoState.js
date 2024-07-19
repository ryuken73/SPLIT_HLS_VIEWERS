import React from 'react';
import styled from 'styled-components';
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
  /* color: ${props => props.color || 'white'}; */
  color: ${props => props.color || 'white'};
  font-size: clamp(1rem, 2vw, 1.5rem);
  /* font-size: 2vw; */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const SubTitle = styled.div`
  color: yellow;
  font-size: 0.6rem;
  line-height: 0.6rem;
  margin-bottom: 5px;
  margin-left: 5px;
  margin-right: 5px;
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


function VideoState(props) {
  // eslint-disable-next-line react/prop-types
  const { autoPlay, cctv, cctvIndex, currentCCTVIndex, cctvPlayersRef } = props;
  const [playerStatus, setPlayerStatus] = React.useState(PLAYER_STATUS.pause);
  const isActive = cctvIndex === currentCCTVIndex;
  const isPaused = playerStatus === PLAYER_STATUS.pause;
  const isStalled = playerStatus === PLAYER_STATUS.stalled;
  // console.log(' re-render playerStatue=', cctv.title, playerStatus)

  // eslint-disable-next-line react/prop-types
  const handlePlayerEvent = React.useCallback((event) => {
    const { type } = event;
    // console.log('player event captured:', type);
    if (type === PLAYER_EVENTS.playing) {
      // console.log('player is playing!');
      setPlayerStatus(PLAYER_STATUS.normal);
      return;
    }
    if (type === PLAYER_EVENTS.pause || type === PLAYER_EVENTS.ended) {
      // console.log('player is paused!');
      setPlayerStatus(PLAYER_STATUS.pause);
      return;
    }
    // console.log('player is stalled!');
    setPlayerStatus(PLAYER_STATUS.stalled);
  }, []);

  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const player = cctvPlayersRef.current[cctvIndex];
    if (player === undefined) return;
    // eslint-disable-next-line react/prop-types
    player.addEventListener('playing', handlePlayerEvent);
    player.addEventListener('pause', handlePlayerEvent);
    player.addEventListener('stalled', handlePlayerEvent);
    player.addEventListener('suspend', handlePlayerEvent);
    player.addEventListener('error', handlePlayerEvent);
    player.addEventListener('waiting', handlePlayerEvent);
    player.addEventListener('ended', handlePlayerEvent);
    player.addEventListener('abort', handlePlayerEvent);
    // eslint-disable-next-line consistent-return
    return () => {
      if (player !== undefined) {
        player.removeEventListener('playing', handlePlayerEvent);
        player.removeEventListener('pause', handlePlayerEvent);
        player.removeEventListener('stalled', handlePlayerEvent);
        player.removeEventListener('suspend', handlePlayerEvent);
        player.removeEventListener('error', handlePlayerEvent);
        player.removeEventListener('waiting', handlePlayerEvent);
        player.removeEventListener('ended', handlePlayerEvent);
        player.removeEventListener('abort', handlePlayerEvent);
      }
    };
  }, [cctvIndex, cctvPlayersRef, handlePlayerEvent]);

  const onClick = React.useCallback(() => {
    cctvPlayersRef.current[cctvIndex].pause();
  }, [cctvIndex, cctvPlayersRef]);

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
      return autoRun[950];
    }
    return idle[950];
  }, [autoPlay, isActive, isPaused, isStalled])
  const getTitleColor = React.useCallback(() => {
    if (isActive){
      return 'yellow';
    }
    return autoRun[50];

  }, [isActive]);
  const bgColor = getBackgroundColor();
  const titleColor = getTitleColor();
  // eslint-disable-next-line no-nested-ternary
  const statusString = isPaused ? '[Paused]': isStalled ? '[Fail]' : '';

  // console.log('player state =', playerStatus, isStalled, bgColor, cctv.title)

  return (
    <Container isActive={isActive} bgcolor={bgColor} onClick={onClick}>
      <Title color={titleColor}>{cctv.title}</Title>
      <SubTitle> {statusString} # of Resets [0]</SubTitle>
    </Container>
  );
}

export default React.memo(VideoState);
