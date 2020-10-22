import React from 'react'
import { rows, cols, squares } from './data';

// Popup to select a number for a field. shows only the available numbers
export default function NumberSelector({clicked, setClicked, selectNumber, selPos, fields}) {
  const row = rows.find(r => r.includes(clicked));
  const col = cols.find(c => c.includes(clicked));
  const square = squares.find(s => s.includes(clicked));
  const usedIndices = (row && col && square) ? row.concat(col).concat(square) : [];
  const usedVals = usedIndices.map(ui => fields[ui]).filter(i => i !== 0 && i !== fields[clicked]);

  const nCont = document.getElementById('numberSelectorContainer');
  const height = nCont ? Math.floor(nCont.offsetHeight / 2) : 0;
  const width = nCont ? Math.floor(nCont.offsetWidth / 2) : 0;

  return (
    <div
      id="numberSelectorContainer"
      style={{
        display: clicked !== null ? 'block' : 'none',
        top: selPos[1] - height + 'px',
        left: selPos[0] - width + 'px',
      }}
    >
      <div className="numberSelector" onMouseLeave={() => setClicked(null)}>
        <div className="selectorClose" onClick={() => selectNumber(clicked, 0)}>X</div>
        {
          [1,2,3,4,5,6,7,8,9].map( n => {
            if (usedVals.includes(n)) {
              return <div key={n}></div>
            } else {
              return <div key={n} onClick={() => selectNumber(clicked, n)}>{n}</div>
            }
          })
        }
      </div>
    </div>
  )
}
