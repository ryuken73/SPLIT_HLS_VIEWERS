import React from 'react'
import styled from 'styled-components';

const Container = styled.div`
  /* height: 50px; */
  /* background: ${(props) => (props.isActive ? 'red' : 'black')}; */
  background: ${(props) => props.bgColor || 'black'};
  color: ${(props) => (props.isActive ? 'yellow' : 'white')};
  font-weight: bold;
  line-height: 44px;
  text-align: center;
  border-radius: 10px;
  min-width: 100px;
  max-width: 200px;
  border: ${props => props.isActive ? '2px solid yellow' : '2px solid white'};
  box-sizing: border-box;
  cursor: pointer;
  margin: 10px;
`;
const Title = styled.div`
  padding-left: 10px;
  padding-right: 10px;
  color: white;
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
  waiting: 'waiting',
  ended: 'ended',
};


function VideoState(props) {
  // eslint-disable-next-line react/prop-types
  const { cctv, cctvIndex, currentCCTVIndex, cctvPlayersRef } = props;
  const [playerStatus, setPlayerStatus] = React.useState(null);
  const isActive = cctvIndex === currentCCTVIndex;
  const isNormal = playerStatus === PLAYER_STATUS.normal;
  const isPaused = playerStatus === PLAYER_STATUS.pause;
  const isStalled = playerStatus === PLAYER_STATUS.stalled;

  // eslint-disable-next-line react/prop-types
  const handlePlayerEvent = React.useCallback((event) => {
    const { type } = event;
    if (type === PLAYER_EVENTS.playing){
      setPlayerStatus(PLAYER_STATUS.normal);
      return;
    }
    if (type === PLAYER_EVENTS.pause || type === PLAYER_EVENTS.ended){
      setPlayerStatus(PLAYER_STATUS.pause);
      return;
    }
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
    // eslint-disable-next-line consistent-return
    return () => {
      if (player !== undefined){
        player.removeEventListener('playing', handlePlayerEvent);
        player.removeEventListener('pause', handlePlayerEvent);
        player.removeEventListener('stalled', handlePlayerEvent);
        player.removeEventListener('suspend', handlePlayerEvent);
        player.removeEventListener('error', handlePlayerEvent);
        player.removeEventListener('waiting', handlePlayerEvent);
        player.removeEventListener('ended', handlePlayerEvent);
      }
    }
  }, [cctvIndex, cctvPlayersRef, handlePlayerEvent, player]);

  const onClick = React.useCallback(() => {
    cctvPlayersRef.current[cctvIndex].pause();
  }, [cctvIndex, cctvPlayersRef])

  // eslint-disable-next-line no-nested-ternary
  const bgColor = isActive
    ? 'maroon'
    : isPaused
      ? 'grey'
      : isStalled
        ? 'darkslategrey'
        : 'black';

  return (
    <Container
      isActive={isActive}
      bgColor={bgColor}
      onClick={onClick}
      isPaused={isPaused}
      isStalled={isStalled}
    >
      <Title>{cctv.title}</Title>
      <SubTitle> # of Resets [0]</SubTitle>
    </Container>
  )

}

export default React.memo(VideoState)
