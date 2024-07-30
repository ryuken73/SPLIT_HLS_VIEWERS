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

function SetTitleBlur(props) {
  const { titleBlur, setTitleBlur } = props;
  const increaseBlur = React.useCallback(() => {
    setTitleBlur((size) => {
      return size + 1;
    })
  }, [setTitleBlur]);
  const decreaseBlur = React.useCallback(() => {
    setTitleBlur((size) => {
      return Math.max(size - 1, 0);
    })
  }, [setTitleBlur]);
  return (
      <Container>
        <legend>Title Blur Size</legend>
        <FlexBox>
          <button style={{width: '30px'}} onClick={decreaseBlur}>-</button>
          <FontSize>{titleBlur}</FontSize>
          <button style={{width: '30px'}} onClick={increaseBlur}>+</button>
        </FlexBox>
      </Container>
  )
}

export default React.memo(SetTitleBlur)
