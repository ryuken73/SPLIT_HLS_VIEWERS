import React from 'react'
import styled from 'styled-components';

const Container = styled.div`
  /* height: 50px; */
  background: ${(props) => (props.isActive ? 'red' : 'black')};
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
`
const Title = styled.div`
  padding-left: 10px;
  padding-right: 10px;
  color: white;
  font-size: clamp(1rem, 2vw, 1.5rem);
  /* font-size: 2vw; */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`
const SubTitle = styled.div`
  color: yellow;
  font-size: 0.6rem;
  line-height: 0.6rem;
  margin-bottom: 5px;
  margin-left: 5px;
  margin-right: 5px;
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
      <SubTitle> # of Resets [0]</SubTitle>
    </Container>
  )

}

export default React.memo(VideoState)
