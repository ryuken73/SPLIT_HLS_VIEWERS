import React from 'react';
import styled from 'styled-components';

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ReloadButton = styled.button`
  margin-bottom: 5px;
  background-color: ${(props) =>
    props.dateUnit === props.currentDateUnit ? 'yellow' : 'black'};
  color: ${(props) =>
    props.dateUnit === props.currentDateUnit ? 'black' : 'white'};
`;

function HistoryShowButtons(props) {
  // eslint-disable-next-line react/prop-types
  const { currentDateUnit = 'M', reloadHistory } = props;
  return (
    <ButtonContainer>
      <ReloadButton
        id="W"
        dateUnit="W"
        currentDateUnit={currentDateUnit}
        onClick={reloadHistory}
      >
        1W
      </ReloadButton>
      <ReloadButton
        id="M"
        dateUnit="M"
        currentDateUnit={currentDateUnit}
        onClick={reloadHistory}
      >
        1M
      </ReloadButton>
      <ReloadButton
        id="Y"
        dateUnit="Y"
        currentDateUnit={currentDateUnit}
        onClick={reloadHistory}
      >
        1Y
      </ReloadButton>
      <ReloadButton
        id="F"
        dateUnit="F"
        currentDateUnit={currentDateUnit}
        onClick={reloadHistory}
      >
        Full
      </ReloadButton>
    </ButtonContainer>
  )
}

export default React.memo(HistoryShowButtons);
