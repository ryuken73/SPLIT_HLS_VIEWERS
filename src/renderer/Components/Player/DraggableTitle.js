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
  /* opacity: ${(props) => props.titleOpacity}; */
  min-width: 20vw;
`

const Banner = styled.div`
  background: ${(props) => `rgba(55, 2, 115, ${props.titleOpacity})`};
  color: ${colors.banner[200]};
  padding: 10px;
  cursor: move;
  z-index: 99;
  font-size: ${(props) => `clamp(${props.titleFontSize / 2}rem, 4vw, ${props.titleFontSize}rem)`};
  padding-left: 20px;
  padding-right: 20px;
  border-top-right-radius: 10px;
  border-top-left-radius: 0;
  opacity: 1;
  font-weight: bold;
  text-align: left;
  backdrop-filter: ${(props) => `blur(${props.titleBlur}px)`};
`
const Live = styled(Banner)`
  display: flex;
  align-items: center;
  width: fit-content;
  background: ${(props) => `rgba(55, 2, 115, ${props.titleOpacity})`};
  font-size: 1.2rem;
  line-height: 1;
  border-bottom: 0px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  margin-bottom: 0px;
  padding-left: 5px;
  padding-bottom: 5px;
`;
const Dot = styled.span`
  margin-right: 10px;
  margin-bottom: -3px;
`;
const Line = styled.div`
  position: relative;
  background: white;
  /* background: ${(props) => `rgba(255, 255, 255, ${props.titleOpacity})`}; */
  height: 5px;
`
const Progress = styled(Line)`
  position: absolute;
  /* background: ${colors.banner[500]}; */
  background: ${(props) => `rgba(150, 67, 255, ${props.titleOpacity + 0.5})`};
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
    titleBlur,
    isActive,
    autoInterval,
    autoPlay,
    showProgress,
  } = props;
  const progressRef = React.useRef(null);
  useGSAP(
    () => {
      if (isActive && autoPlay && showProgress) {
        gsap.to(progressRef.current, { width: '100%', duration: autoInterval });
      }
    },
    {
      dependencies: [isActive, autoInterval, autoPlay, showProgress],
      revertOnUpdate: true,
    },
  );
  return (
    <Draggable onDrag={onDrag} position={{ x: position.x, y: position.y }}>
      <AbsoluteBox alignBy={alignBy} titleOpacity={titleOpacity}>
        <Live
          titleFontSize={titleFontSize}
          titleOpacity={titleOpacity}
          titleBlur={titleBlur}
        >
          <Dot>
            <BlinkingDot />
          </Dot>
          <div>LIVE</div>
        </Live>
        <Banner
          titleFontSize={titleFontSize}
          titleOpacity={titleOpacity}
          titleBlur={titleBlur}
        >
          {title}
        </Banner>
        <Line titleOpacity={titleOpacity}>
          <Progress
            ref={progressRef}
            titleOpacity={titleOpacity}
            isActive={isActive}
          />
        </Line>
      </AbsoluteBox>
    </Draggable>
  )
}

export default React.memo(DraggableTitle)
