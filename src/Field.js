import React, { useMemo } from 'react'
import { sudokus } from './data';

const top = [0,1,2,3,4,5,6,7,8,
  27,28,29,30,31,32,33,34,35,
  54,55,56,57,58,59,60,61,62];
const bottom = [72,73,74,75,76,77,78,79,80];
const left = [0,3,6,9,12,15,18,
  21,24,27,30,33,36,39,42,45,
  48,51,54,57,60,63,66,69,72,75,78];
const right = [8,17,26,35,44,53,62,71,80];

const getFieldClass = (index, isFixed, over, highlight, errHighlight, errNumber) => {
  const classes = ['field'];
  if (over) classes.push('over');
  if (highlight) classes.push('highlight');
  if (errHighlight) classes.push('errHighlight');
  if (errNumber) classes.push('errNumber');

  if (top.includes(index)) {
    if (left.includes(index)) {
      classes.push('topleft')
    } else if (right.includes(index)) {
      classes.push('topright');
    } else {
      classes.push('top');
    }
  }

  if (bottom.includes(index)) {
    if (left.includes(index)) {
      classes.push('bottomleft')
    } else if (right.includes(index)) {
      classes.push('bottomright');
    } else {
      classes.push('bottom');
    }
  }

  if (left.includes(index) &&
    !top.includes(index) &&
    !bottom.includes(index)) classes.push('left');

  if (right.includes(index) &&
    !top.includes(index) &&
    !bottom.includes(index)) classes.push('right');
  if (isFixed) classes.push('fixed');
  return classes.join(' ');
};

export default function Field({index, value, sudokuIndex, showSelector, mouseEnter, mouseLeave, over, highlight=false, errHighlight=false, errNumber=false}) {

  const isFixed = sudokuIndex !== null ? sudokus[sudokuIndex][index] !== null : false;

  const cssClass = useMemo(() => getFieldClass(index, isFixed, over, highlight, errHighlight, errNumber),
  [index, isFixed, over, highlight, errHighlight, errNumber]);

  return (
    <div className={cssClass}
      onMouseEnter={() => mouseEnter(index)}
      onMouseLeave={() => mouseLeave()}
      onClick={isFixed ? () => {} : (e) => showSelector(e, index)}>
      {value}
    </div>
  )
}


