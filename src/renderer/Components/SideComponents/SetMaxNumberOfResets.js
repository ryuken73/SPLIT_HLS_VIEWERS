/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';

const Container = styled.fieldset`
  margin-top: 1rem;
  border: 3px solid white;
`
const Title = styled.div``
const FlexBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  /* margin-top: 10px; */
`
const FontSize = styled.div`
  margin-left: 10px;
  margin-right: 10px;
`

function SetMaxNumberOfResets(props) {
  const { maxNumberOfResets, setMaxNumberOfResets } = props;
  const increaseResets = React.useCallback(() => {
    setMaxNumberOfResets((maxNumber) => {
      return maxNumber + 10;
    })
  }, [setMaxNumberOfResets]);
  const decreaseResets = React.useCallback(() => {
    setMaxNumberOfResets((maxNumber) => {
      return Math.max(maxNumber - 10, 0);
    })
  }, [setMaxNumberOfResets]);
  return (
      <Container>
        <legend>Max Resets</legend>
        <FlexBox>
          <button style={{width: '30px'}} onClick={decreaseResets}>-</button>
          <FontSize>{maxNumberOfResets}</FontSize>
          <button style={{width: '30px'}} onClick={increaseResets}>+</button>
        </FlexBox>
      </Container>
  )
}

export default React.memo(SetMaxNumberOfResets)
