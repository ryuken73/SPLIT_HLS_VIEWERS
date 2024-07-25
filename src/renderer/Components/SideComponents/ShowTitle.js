import React from 'react';
import styled from 'styled-components';

const Container = styled.fieldset`
  margin-top: 1rem;
  border: 3px solid white;
`

function ShowTitle(props) {
  // eslint-disable-next-line react/prop-types, @typescript-eslint/no-unused-vars
  const { showTitle: value = true, setShowTitle } = props;
  const onChangeShowTitle = React.useCallback((e) => {
    if (e.target.id === 'show') {
        setShowTitle(true);
    } else {
        setShowTitle(false);
    }
    },
    [setShowTitle],
  );
  return (
    <Container onChange={onChangeShowTitle} value={value}>
      <legend>Show Title</legend>
      <div>
        <input
          type="radio"
          id="show"
          name="showTitle"
          value="show"
          defaultChecked={value === true}
        />
        <label for="show">show</label>
      </div>
      <div>
        <input
          type="radio"
          id="hide"
          name="showTitle"
          value="hide"
          defaultChecked={value === false}
        />
        <label for="hide">hide</label>
      </div>
    </Container>
  )
}

export default React.memo(ShowTitle);
