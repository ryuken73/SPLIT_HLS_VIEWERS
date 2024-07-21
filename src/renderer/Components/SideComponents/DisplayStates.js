import React from 'react';
import styled from 'styled-components';
import colors from '../../lib/colors';

const Container = styled.div`
  margin-top: 10px;
  margin-bottom: ${(props) => props.isBig && '50px'};
`
const Title = styled.div`
  font-size: ${(props) => (props.isBig ? '2rem' : '1rem')};
  font-weight: bold;
`
const ValueContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid white;
  padding: 5px;
  background: ${colors.autoRun[900]};
`
const Value = styled.div`
  font-size: ${(props) => (props.isBig ? '2.5rem' : '2rem')};
  font-weight: bold;
`

function DisplayStates(props) {
  const {title, value, isBig} = props;
  return (
    <Container isBig={isBig}>
      <Title isBig={isBig}>
        {title}
      </Title>
      <ValueContainer>
        <Value isBig={isBig}>
          {value}
        </Value>
      </ValueContainer>
    </Container>
  )
}

export default React.memo(DisplayStates);
