import React from 'react'
import styled from 'styled-components';

const Container = styled.fieldset`
  margin-top: 1rem;
  border: 3px solid white;
`

function ToggleFourByFour(props) {
  // eslint-disable-next-line react/prop-types
  const { fourBy4Enabled, setFourBy4Enabled, runAutoPlay, setShowTitle } = props;
  const onChange = React.useCallback((e) => {
      const { checked } = e.target;
      runAutoPlay(false);
      setShowTitle(!checked);
      setFourBy4Enabled(checked);
    },
    [runAutoPlay, setFourBy4Enabled, setShowTitle],
  );
  return (
    <Container onChange={onChange}>
      <legend>Toggle 4X4</legend>
      <div>
        <input
          type="checkbox"
          id="toggleFourByFor"
          name="toggleFourByFor"
          checked={fourBy4Enabled}
        />
        <label for="showProgress">Enable 4X4</label>
      </div>
    </Container>
  )
}

export default React.memo(ToggleFourByFour);
