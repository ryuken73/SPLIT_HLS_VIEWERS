import React from 'react'

function AlignSide(props) {
  // eslint-disable-next-line react/prop-types, @typescript-eslint/no-unused-vars
  const { alignBy: value = 'right', setAlignBy } = props;
  const onChangeAlign = React.useCallback((e) => {
    console.log(e.target.id)
    setAlignBy(e.target.id)
  }, [])
  return (
    <fieldset onChange={onChangeAlign} value={value}>
      <legend>Align Title</legend>
      <div>
        <input type="radio" id="right" name="align" value="right" defaultChecked={value === 'right'} />
        <label for="right">Right</label>
      </div>
      <div>
        <input type="radio" id="left" name="align" value="left" defaultChecked={value === 'left'}  />
        <label for="left">Left</label>
      </div>
    </fieldset>
  )
}

export default React.memo(AlignSide);
