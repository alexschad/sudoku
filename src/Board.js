import React, { useState } from 'react';
import Field from './Field';
import NumberSelector from './NumberSelector';
import { rows, cols, squares } from './data';

const Board = ({
  fields,
  sudoku,
  showHints,
  selectNumber,
  errHighlight,
  errNumber,
}) => {
  const [selPos, setSelPos] = useState([0, 0]);
  const [highlight, setHightlight] = useState([]);
  const [over, setOver] = useState();
  const [clicked, setClicked] = useState(null);

  // shows and places the number selector
  const showSelector = (e, index) => {
    setSelPos([e.clientX, e.clientY]);
    setClicked(index);
  };

  // set the row, column and block highlights on mouseover
  const mouseEnter = (index) => {
    const newHighlight = [
      ...rows.find((r) => r.includes(index)),
      ...cols.find((r) => r.includes(index)),
      ...squares.find((r) => r.includes(index)),
    ];
    setHightlight(newHighlight);
    setOver(index);
  };

  // resets the highlights
  const mouseLeave = () => {
    setHightlight([]);
    setOver(null);
  };

  const selectBoardNumber = (clicked, value) => {
    selectNumber(clicked, value);
    setClicked(null);
  };
  return (
    <div className="board">
      {fields.map((f, i) => (
        <Field
          key={i}
          index={i}
          fields={fields}
          sudoku={sudoku}
          showSelector={showSelector}
          showHints={showHints}
          mouseEnter={mouseEnter}
          mouseLeave={mouseLeave}
          highlight={highlight.includes(i)}
          errHighlight={errHighlight.includes(i)}
          errNumber={errNumber.includes(i)}
          over={over === i}
        />
      ))}
      <NumberSelector
        selectNumber={selectBoardNumber}
        clicked={clicked}
        setClicked={setClicked}
        selPos={selPos}
        fields={fields}
      />
    </div>
  );
};

export default Board;
