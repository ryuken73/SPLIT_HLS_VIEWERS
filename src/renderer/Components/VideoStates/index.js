/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';
import VideoState from './VideoState';

const Vcenter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-width: 1500px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
`
const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

function VideoStates(props) {
  // eslint-disable-next-line react/prop-types
  const {
    autoPlay,
    cctvSelected,
    currentCCTVIndex,
    cctvPlayersRef,
    numberOfResets,
    maxNumberOfResets,
    videoStates,
    setVideoStates
  } = props;
  console.log(videoStates)
  return (
    <Vcenter>
      <Container>
        {cctvSelected.map((cctv, cctvIndex) => (
          <VideoState
            key={cctv.cctvId}
            cctv={cctv}
            cctvIndex={cctvIndex}
            currentCCTVIndex={currentCCTVIndex}
            cctvPlayersRef={cctvPlayersRef}
            autoPlay={autoPlay}
            numberOfReset={numberOfResets[cctvIndex]}
            playerStatus={videoStates[cctv.url]}
            setVideoStates={setVideoStates}
            maxNumberOfResets={maxNumberOfResets}
          />
        ))}
      </Container>
    </Vcenter>
  )
}

export default React.memo(VideoStates);
