import React from 'react'
import styled from 'styled-components';

const Container = styled.fieldset`
  margin-top: 1rem;
  border: 3px solid white;
`

function ToggleFourByFour(props) {
  // eslint-disable-next-line react/prop-types
  const {
    fourBy4Enabled,
    setFourBy4Enabled,
    setAutoPlay,
    runAutoPlay,
    setShowTitle,
  } = props;
  const onChange = React.useCallback((e) => {
      const { checked } = e.target;
      setShowTitle(!checked);
      if (checked) {
        runAutoPlay(false);
        setAutoPlay(false);
      }
      setFourBy4Enabled(checked);
    },
    [runAutoPlay, setAutoPlay, setFourBy4Enabled, setShowTitle],
  );
  return (
    <Container onChange={onChange}>
      <legend>Toggle 2X2</legend>
      <div>
        <input
          type="checkbox"
          id="toggleFourByFor"
          name="toggleFourByFor"
          checked={fourBy4Enabled}
        />
        <label for="showProgress">Enable 2X2</label>
      </div>
    </Container>
  )
}

export default React.memo(ToggleFourByFour);
