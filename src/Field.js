import React, { useState, useEffect, useMemo } from 'react';
import { rows, cols, squares } from './data';

// prettier-ignore
const top = [0,1,2,3,4,5,6,7,8,
  27,28,29,30,31,32,33,34,35,
  54,55,56,57,58,59,60,61,62];
const bottom = [72, 73, 74, 75, 76, 77, 78, 79, 80];
// prettier-ignore
const left = [0,3,6,9,12,15,18,
  21,24,27,30,33,36,39,42,45,
  48,51,54,57,60,63,66,69,72,75,78];
const right = [8, 17, 26, 35, 44, 53, 62, 71, 80];

const getFieldClass = (
  index,
  isFixed,
  over,
  highlight,
  errHighlight,
  errNumber,
) => {
  // computes the css class for the fields to color it correctly and show the correct borders to create the grid
  const classes = ['field'];
  if (over) classes.push('over');
  if (highlight) classes.push('highlight');
  if (errHighlight) classes.push('errHighlight');
  if (errNumber) classes.push('errNumber');

  if (top.includes(index)) {
    if (left.includes(index)) {
      classes.push('topleft');
    } else if (right.includes(index)) {
      classes.push('topright');
    } else {
      classes.push('top');
    }
  }

  if (bottom.includes(index)) {
    if (left.includes(index)) {
      classes.push('bottomleft');
    } else if (right.includes(index)) {
      classes.push('bottomright');
    } else {
      classes.push('bottom');
    }
  }

  if (left.includes(index) && !top.includes(index) && !bottom.includes(index))
    classes.push('left');

  if (right.includes(index) && !top.includes(index) && !bottom.includes(index))
    classes.push('right');
  if (isFixed) classes.push('fixed');
  return classes.join(' ');
};

// a single field of the sudoku
export default function Field({
  index,
  fields,
  sudoku,
  showSelector,
  showHints,
  mouseEnter,
  mouseLeave,
  over,
  highlight = false,
  errHighlight = false,
  errNumber = false,
}) {
  const [usedVals, setUsedVals] = useState([]);
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    setIsFixed(sudoku !== null ? sudoku[index] !== 0 : false);
  }, [sudoku, index]);

  // the getFieldClass function is quite expensive so we memo it
  const cssClass = useMemo(
    () =>
      getFieldClass(index, isFixed, over, highlight, errHighlight, errNumber),
    [index, isFixed, over, highlight, errHighlight, errNumber],
  );

  useEffect(() => {
    const row = rows.find((r) => r.includes(index));
    const col = cols.find((c) => c.includes(index));
    const square = squares.find((s) => s.includes(index));
    const usedIndices =
      row && col && square ? row.concat(col).concat(square) : [];
    let usedVals = usedIndices.map((ui) => fields[ui]).filter((i) => i !== 0);
    usedVals = new Set(usedVals);
    usedVals = [...usedVals];
    setUsedVals(usedVals);
  }, [index, fields]);

  return (
    <div
      className={cssClass}
      onMouseEnter={() => mouseEnter(index)}
      onMouseLeave={() => mouseLeave()}
      onClick={isFixed ? () => {} : (e) => showSelector(e, index)}>
      {fields[index] !== 0 ? fields[index] : null}
      {!isFixed && showHints && fields[index] === 0 ? (
        <div className="hint">{9 - usedVals.length}</div>
      ) : (
        ''
      )}
    </div>
  );
}
