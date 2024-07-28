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

function SetTitleFont(props) {
  const { titleOpacity, setTitleOpacity } = props;
  const increaseOpacity = React.useCallback(() => {
    setTitleOpacity((opacity) => {
      return Math.max(Math.min(parseFloat((opacity + 0.1).toFixed(1)), 1), 0);
    })
  }, [setTitleOpacity]);
  const decreaseOpacity = React.useCallback(() => {
    setTitleOpacity((opacity) => {
      return Math.max(Math.min(parseFloat((opacity - 0.1).toFixed(1)), 1), 0);
    })
  }, [setTitleOpacity]);
  return (
      <Container>
        <legend>Title Opacity</legend>
        <FlexBox>
          <button style={{width: '30px'}} onClick={decreaseOpacity}>-</button>
          <FontSize>{titleOpacity}</FontSize>
          <button style={{width: '30px'}} onClick={increaseOpacity}>+</button>
        </FlexBox>
      </Container>
  )
}

export default React.memo(SetTitleFont)
