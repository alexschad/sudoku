import React, { useRef, useState, useEffect } from 'react';

// Popup to select a number for a field.
export default function NumberSelector({
  clicked,
  setClicked,
  selectNumber,
  selPos,
}) {
  const containerRef = useRef(null);
  const nCont = containerRef.current;
  const height = nCont ? Math.floor(nCont.offsetHeight / 2) : 0;
  const width = nCont ? Math.floor(nCont.offsetWidth / 2) : 0;

  const [style, setStyle] = useState({
    visibility: 'hidden',
    top: selPos[1] - height + 'px',
    left: selPos[0] - width + 'px',
  });

  useEffect(() => {
    const height = nCont ? Math.floor(nCont.offsetHeight / 2) : 0;
    const width = nCont ? Math.floor(nCont.offsetWidth / 2) : 0;
    const newStyle = {
      visibility: clicked !== null ? 'visible' : 'hidden',
      top: selPos[1] - height + 'px',
      left: selPos[0] - width + 'px',
    };
    setStyle(newStyle);
  }, [nCont, clicked, selPos]);

  return (
    <div ref={containerRef} className="numberSelectorContainer" style={style}>
      <div className="numberSelector" onMouseLeave={() => setClicked(null)}>
        <div className="selectorClose" onClick={() => selectNumber(clicked, 0)}>
          X
        </div>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
          return (
            <div key={n} onClick={() => selectNumber(clicked, n)}>
              {n}
            </div>
          );
        })}
      </div>
    </div>
  );
}
