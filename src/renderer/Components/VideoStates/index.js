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
`
const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

function VideoStates(props) {
  // eslint-disable-next-line react/prop-types
  const { cctvSelected, currentCCTVIndex } = props;
  return (
    <Vcenter>
      <Container>
        {cctvSelected.map((cctv, cctvIndex) => (
          <VideoState
            key={cctv.cctvId}
            cctv={cctv}
            cctvIndex={cctvIndex}
            currentCCTVIndex={currentCCTVIndex}
          />
        ))}
      </Container>
    </Vcenter>
  )
}

export default React.memo(VideoStates);