import React from 'react';
import styled from 'styled-components';

const Container = styled.fieldset`
  margin-top: 1rem;
  border: 3px solid white;
`

function ShowProgress(props) {
  // eslint-disable-next-line react/prop-types, @typescript-eslint/no-unused-vars
  const { showProgress: value = true, setShowProgress } = props;
  const onChangeShowProgress = React.useCallback((e) => {
    if (e.target.id === 'showProgress') {
        setShowProgress(true);
    } else {
        setShowProgress(false);
    }
    },
    [setShowProgress],
  );
  return (
    <Container onChange={onChangeShowProgress} value={value}>
      <legend>Show Progress</legend>
      <div>
        <input
          type="radio"
          id="showProgress"
          name="showProgress"
          value="show"
          defaultChecked={value === true}
        />
        <label for="showProgress">show</label>
      </div>
      <div>
        <input
          type="radio"
          id="hideProgress"
          name="showProgress"
          value="hide"
          defaultChecked={value === false}
        />
        <label for="hideProgress">hide</label>
      </div>
    </Container>
  )
}

export default React.memo(ShowProgress);
