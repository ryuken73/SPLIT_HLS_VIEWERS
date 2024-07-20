/* eslint-disable react/prop-types */
import React from 'react';
import Draggable from 'react-draggable';
import styled from 'styled-components';
import colors from '../../lib/colors';
import BlinkingDot from '../../BlinkingDot';

const AbsoluteBox = styled.div`
  position: absolute;
  right: ${(props) => props.alignBy === 'right' && '10px'};
  left: ${(props) => props.alignBy === 'left' && '10px'};
  bottom: 100px;
  opacity: 0.9;
`

const Banner = styled.div`
  background: ${colors.banner[950]};
  color: ${colors.banner[200]};
  border: 5px solid;
  border-color: ${colors.banner[950]};
  cursor: move;
  z-index: 99;
  /* font-size: clamp(2rem, 4vw, 4rem); */
  font-size: ${(props) => `clamp(${props.titleFontSize / 2}rem, 4vw, ${props.titleFontSize}rem)`};
  padding-left: 20px;
  padding-right: 20px;
  border-top-right-radius: 10px;
  border-top-left-radius: 0;
  opacity: 1;
  font-weight: bold;
`
const Live = styled(Banner)`
  display: flex;
  align-items: center;
  width: fit-content;
  /* font-size: clamp(1rem, 2vw, 1.5rem); */
  font-size: ${(props) => `clamp(${props.titleFontSize / 4}rem, 2vw, ${props.titleFontSize / 2.6}rem)`};
  line-height: 1;
  border-bottom: 0px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  margin-bottom: -1px;
  padding-left: 5px;
`;
const Dot = styled.span`
  margin-right: 10px;
  margin-bottom: -3px;
`;
const Line = styled.div`
  background: white;
  height: 5px;
  /* border-bottom-right-radius: 10px; */
  /* border-bottom-left-radius: 10px; */
`

function DraggableTitle(props) {
  // eslint-disable-next-line react/prop-types
  const {
    title = 'sample',
    onDrag,
    position = {},
    alignBy,
    titleFontSize,
  } = props;
  return (
    <Draggable onDrag={onDrag} position={{ x: position.x, y: position.y }}>
      <AbsoluteBox alignBy={alignBy}>
        <Live titleFontSize={titleFontSize}>
          <Dot>
            <BlinkingDot />
          </Dot>
          <div>LIVE</div>
        </Live>
        <Banner titleFontSize={titleFontSize}>{title}</Banner>
        <Line />
      </AbsoluteBox>
    </Draggable>
  )
}

export default React.memo(DraggableTitle)
