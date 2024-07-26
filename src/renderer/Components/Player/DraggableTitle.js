/* eslint-disable react/prop-types */
import React from 'react';
import Draggable from 'react-draggable';
import styled from 'styled-components';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import colors from '../../lib/colors';
import BlinkingDot from '../../BlinkingDot';

const AbsoluteBox = styled.div`
  position: absolute;
  right: ${(props) => props.alignBy === 'right' && '10px'};
  left: ${(props) => props.alignBy === 'left' && '10px'};
  bottom: 100px;
  opacity: ${(props) => props.titleOpacity};
  min-width: 20vw;
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
  text-align: left;
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
  position: relative;
  background: white;
  height: 5px;
`
const Progress = styled(Line)`
  position: absolute;
  background: ${colors.banner[500]};
  width: 0;
  /* width: ${(props) => props.isActive && '100%'}; */
`

function DraggableTitle(props) {
  // eslint-disable-next-line react/prop-types
  const {
    title = 'sample',
    onDrag,
    position = {},
    alignBy,
    titleFontSize,
    titleOpacity = 0.9,
    isActive,
    autoInterval,
    autoPlay,
  } = props;
  const progressRef = React.useRef(null);
  console.log(isActive, autoPlay)
  useGSAP(
    () => {
      if (isActive && autoPlay) {
        // gsap.to(progressRef.current, { width: '100%', duration: autoInterval });
        gsap.to('.progress', { width: '100%', duration: autoInterval });
      }
    },
    {
      dependencies: [isActive, autoInterval, autoPlay],
      revertOnUpdate: true,
    },
  );
  return (
    <Draggable onDrag={onDrag} position={{ x: position.x, y: position.y }}>
      <AbsoluteBox alignBy={alignBy} titleOpacity={titleOpacity}>
        <Live titleFontSize={titleFontSize}>
          <Dot>
            <BlinkingDot />
          </Dot>
          <div>LIVE</div>
        </Live>
        <Banner titleFontSize={titleFontSize}>{title}</Banner>
        <Line>
          <Progress className='progress' ref={progressRef} isActive={isActive} />
        </Line>
      </AbsoluteBox>
    </Draggable>
  )
}

export default React.memo(DraggableTitle)
