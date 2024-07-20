/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  margin-top: 1rem;
  border: 1px solid white;
  padding: 10px;
`
const Title = styled.div``
const FlexBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
`
const FontSize = styled.div`
  margin-left: 10px;
  margin-right: 10px;
`

function SetTitleFont(props) {
  const { titleFontSize, setTitleFontSize } = props;
  const increaseSize = React.useCallback(() => {
    setTitleFontSize((size) => {
      return parseFloat((size + 0.1).toFixed(1));
    })
  }, [setTitleFontSize]);
  const decreaseSize = React.useCallback(() => {
    setTitleFontSize((size) => {
      return parseFloat((size - 0.1).toFixed(1));
    })
  }, [setTitleFontSize]);
  return (
    <Container>
      <Title>Title Font Size</Title>
      <FlexBox>
        <button style={{width: '30px'}} onClick={increaseSize}>+</button>
        <FontSize>{titleFontSize}</FontSize>
        <button style={{width: '30px'}} onClick={decreaseSize}>-</button>
      </FlexBox>
    </Container>
  )
}

export default React.memo(SetTitleFont)
