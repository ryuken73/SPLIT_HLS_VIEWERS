import React from 'react';
import Draggable from 'react-draggable';
import styled from 'styled-components';

const Banner = styled.div`
  position: absolute;
  top: 0;
  background: white;
  color: black;
  cursor: move;
  z-index: 99;
`

function DraggableTitle(props) {
  // eslint-disable-next-line react/prop-types
  const { title = 'sample', onDrag, position = {} } = props;
  return (
    <Draggable onDrag={onDrag} position={{ x: position.x, y: position.y }}>
      <Banner>{title}</Banner>
    </Draggable>
  )
}

export default React.memo(DraggableTitle)