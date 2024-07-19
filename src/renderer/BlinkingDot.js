import React from 'react';
import './BlinkingDot.css';

function BlinkingDot() {
  return (
    <svg height="20" width="20" className="blinking">
      <circle cx="10" cy="10" r="7" fill="red" />
      Sorry, your browser does not support inline SVG.
    </svg>
  )
}

export default React.memo(BlinkingDot);
