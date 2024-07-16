import React from 'react'
import styled from 'styled-components';

const Container = styled.div`
  height: 50px;
  background: ${(props) => (props.isActive ? 'red' : 'black')};
  color: ${(props) => (props.isActive ? 'yellow' : 'white')};
  font-weight: bold;
  line-height: 44px;
  text-align: center;
  border-radius: 10px;
  min-width: 150px;
  border: ${props => props.isActive ? '2px solid yellow' : '2px solid white'};
  box-sizing: border-box;
  cursor: pointer;
  margin: 10px;
`
const Title = styled.div`
  padding-left: 10px;
  padding-right: 10px;
`

function VideoState(props) {
  // eslint-disable-next-line react/prop-types
  const { cctv, cctvIndex, currentCCTVIndex, player } = props;
  const isActive = cctvIndex === currentCCTVIndex;
  // eslint-disable-next-line react/prop-types
  const onClick = React.useCallback(() => {
    player.pause();
  }, [player])
  return (
    <Container isActive={isActive} onClick={onClick}>
      <Title>{cctv.title}</Title>
    </Container>
  )

}

export default React.memo(VideoState)
