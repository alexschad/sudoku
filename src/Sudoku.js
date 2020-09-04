import React, { useState, useEffect } from 'react';
import './Sudoku.css';
import Field from './Field';
import NumberSelector from './NumberSelector';
import { rows, cols, squares, sudokus } from './data';
import { solve, checkValid } from './util';


//main Module that shows the Fields, the Menu and the Number selector
function Sudoku() {
  const [fields, setFields] = useState(Array(81).fill(null));
  const [highlight, setHightlight] = useState([]);
  const [errHighlight, setErrHightlight] = useState([]);
  const [errNumber, setErrNumber] = useState([]);
  const [over, setOver] = useState();
  const [clicked, setClicked] = useState(null);
  const [selPos, setSelPos] = useState([0,0]);
  const [isSolving, setIsSolving] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [sudokuIndex, setSudokuIndex] = useState(null);
  const [showHints, setShowHints] = useState(false);

  // clears all fields
  const clear = () => {
    setFields(Array(81).fill(null));
  }

  // clears all user selected fields. resets to the current sudoku
  const reset = () => {
    setFields(sudokus[sudokuIndex]);
  }

  // randomly loads one of the stored sudokus
  const load = () => {
    setSudokuIndex(Math.floor(Math.random() * sudokus.length));
  }

  useEffect(() => {
    if (sudokuIndex !== null) {
      setFields(sudokus[sudokuIndex]);
    } else {
      clear();
    }
  }, [sudokuIndex]);

  // start to solve the whole sudoku
  const startSolve = async () => {
    setIsSolving(true);
  }

  useEffect(() => {
    if (isSolving === false) return;
    const solved = solve(fields, fields);
    setFields(solved);
    setIsSolving(false);
  }, [isSolving, fields]);

  useEffect(() => {
    const solved = fields.filter(i => i === null).length === 0;
    setIsSolved(solved);
  }, [fields]);

  // set the row, column and block highlights on mouseover
  const mouseEnter = (index) => {
    const newHighlight = [
      ...rows.find(r => r.includes(index)),
      ...cols.find(r => r.includes(index)),
      ...squares.find(r => r.includes(index)),
    ];
    setHightlight(newHighlight);
    setOver(index);
  };
  
  // resets the highlights
  const mouseLeave = () => {
    setHightlight([]);
    setOver(null);
  };

  // sets a number in a field called by the number selector
  const selectNumber = (clicked, value) => {
    const newFields = [...fields];
    newFields[clicked] = value;
    setFields(newFields);
    setClicked(null);
  }

  // shows and places the number selector
  const showSelector = (e, index) => {
    setClicked(index);
    setSelPos([e.clientX, e.clientY]);
  }

  useEffect(() => {
    const [errn, errh] = checkValid(fields);
    setErrNumber(errn);
    setErrHightlight(errh);
  }, [fields]);

  // solve only one field
  const solveOne = () => {
    const ones = fields.map((field,index) => {
      const row = rows.find(r => r.includes(index));
      const col = cols.find(c => c.includes(index));
      const square = squares.find(s => s.includes(index));
      const usedIndices = (row && col && square) ? row.concat(col).concat(square) : [];
      let usedVals = usedIndices.map(ui => fields[ui]).filter(i => i !== null);
      usedVals = new Set(usedVals);  
      usedVals = [...usedVals];
      return ([index, usedVals]);
    }).filter(
      (o) => {
        return o[1].length === 8 && fields[o[0]] === null;    
      }
    );
    if (ones.length > 0) {
      // try a smart solution
      const sol = ones[Math.floor(Math.random() * ones.length)];
      sol[1] = [1,2,3,4,5,6,7,8,9].filter(x => !sol[1].includes(x))[0];
      const newFields = [...fields];
      newFields[sol[0]] = sol[1];
      setFields(newFields);
    } else {
      // no smart solution so we use brute force
      const solved = solve(fields, fields);
      const nullIndices = fields.map((f,i) => i).filter(i => fields[i] === null);
      const solIndex = nullIndices[Math.floor(Math.random() * nullIndices.length)];
      const sol = [solIndex, solved[solIndex]];
      const newFields = [...fields];
      newFields[sol[0]] = sol[1];
      setFields(newFields);
    }
  }

  return (
    <div className="Sudoku">
      <div className={isSolving ? 'container solving' : 'container'}>
      <header className="Sudoku-header">Sudoku Helper</header>
      {isSolved ? <div className="success" onClick={() => setIsSolved(false)}>Congratulations you solved the sudoku!</div> : null}
        <div className="board">
          {fields.map((f,i) => 
            <Field
              key={i}
              index={i}
              fields={fields}
              sudokuIndex={sudokuIndex}
              showSelector={showSelector}
              showHints={showHints}
              mouseEnter={mouseEnter}
              mouseLeave={mouseLeave}
              highlight={highlight.includes(i)}
              errHighlight={errHighlight.includes(i)}
              errNumber={errNumber.includes(i)}
              over={over === i}
            />
          )}
        </div>
        <div className="menu">
          <button onClick={load}>Load</button>
          <button onClick={startSolve}>Start Solving</button>
          <button onClick={solveOne}>Solve One</button>
          <button onClick={clear}>Clear</button>
          <button onClick={reset}>Reset</button>
          <button onClick={(e) => setShowHints(!showHints)}>{showHints ? 'Hide' : 'Show'} Hints</button>
        </div>
        <NumberSelector
          selectNumber={selectNumber}
          clicked={clicked}
          setClicked={setClicked}
          selPos={selPos}
          fields={fields}
        />
      </div>
    </div>
  );
}

export default Sudoku;
