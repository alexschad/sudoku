import React, { useState, useEffect, useRef } from 'react';
import './Sudoku.css';
import Field from './Field';
import NumberSelector from './NumberSelector';
import { rows, cols, squares, sudokus } from './data';
import { solve, checkValid } from './util';

export const ACTIONS = {
  LOAD_RANDOM: 'load_random',
  LOAD: 'load',
  CLEAR: 'clear',
  RESET: 'reset',
  SOLVE: 'solve',
  SOLVE_ONE: 'solve_one',
  SET_FIELD: 'set_field',
};

const sudokuReducer = (state, action) => {
  const { fields, sudokuIndex } = state;
  switch (action.type) {
    // randomly loads one of the stored sudokus
    case ACTIONS.LOAD_RANDOM:
      const newIndex = Math.floor(Math.random() * sudokus.length);
      return {fields: sudokus[newIndex], sudokuIndex: newIndex};
    // randomly loads one of the stored sudokus
    case ACTIONS.LOAD:
      return {fields: sudokus[action.payload.sudokuIndex], sudokuIndex: action.payload.sudokuIndex};
    // clears all user selected fields. resets to the current sudoku
    case ACTIONS.RESET:
      return {fields: sudokus[sudokuIndex], sudokuIndex: sudokuIndex};
    // clears all fields
    case ACTIONS.CLEAR:
      return {fields: Array(81).fill(null), sudokuIndex: null};
    // solve the sudoku
    case ACTIONS.SOLVE:
      const solved = solve(fields, fields);
      return {...state, fields: solved};
    // solve one field of the sudoku
    case ACTIONS.SOLVE_ONE:
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
        return {...state, fields: newFields};
      } else {
        // no smart solution so we use brute force
        const solved = solve(fields, fields);
        const nullIndices = fields.map((f,i) => i).filter(i => fields[i] === null);
        const solIndex = nullIndices[Math.floor(Math.random() * nullIndices.length)];
        const sol = [solIndex, solved[solIndex]];
        const newFields = [...fields];
        newFields[sol[0]] = sol[1];
        return {...state, fields: newFields};
      }  

    // set one field with a number
    case ACTIONS.SET_FIELD:
      const newFields = [...fields];
      newFields[action.payload.clicked] = action.payload.value;
      return {...state, fields: newFields};
    default:
      return state;
  }
};

//main Module that shows the Fields, the Menu and the Number selector
function Sudoku() {
  const initialSudoku = () => {
    const sudokuIndexJSON = window.localStorage.getItem("sudokuIndex");
    const sudokuIndex = sudokuIndexJSON ? JSON.parse(sudokuIndexJSON) : Math.floor(Math.random() * sudokus.length);
    const sudokuFieldsJSON = window.localStorage.getItem("sudokuFields");
    const fields = sudokuFieldsJSON ? JSON.parse(sudokuFieldsJSON) : Array(81).fill(null);
    return {fields, sudokuIndex};
  };

  const [{fields, sudokuIndex}, dispatch] = React.useReducer(
    sudokuReducer,
    undefined,
    initialSudoku
  );
  // const [fields, setFields] = useState(initialFields);
  const [highlight, setHightlight] = useState([]);
  const [errHighlight, setErrHightlight] = useState([]);
  const [errNumber, setErrNumber] = useState([]);
  const [over, setOver] = useState();
  const [clicked, setClicked] = useState(null);
  const [selPos, setSelPos] = useState([0,0]);
  const [isSolving, setIsSolving] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  // const [sudokuIndex, setSudokuIndex] = useState(initialSudoKuIndex);
  const [showHints, setShowHints] = useState(false);

  const isFirstRenderRef = useRef(true);

  useEffect(() => window.localStorage.setItem('sudokuFields', JSON.stringify(fields)), [fields]);

  useEffect(() => {
    if (isFirstRenderRef.current) return;
    if (sudokuIndex !== null) {
      dispatch({ type: ACTIONS.LOAD, payload: { sudokuIndex }})
    } else {
      dispatch({ type: ACTIONS.CLEAR })
    }
    window.localStorage.setItem('sudokuIndex', JSON.stringify(sudokuIndex));
  }, [sudokuIndex, isFirstRenderRef]);

  useEffect(() => {
    isFirstRenderRef.current = false;
  }, []);

  // start to solve the whole sudoku
  const startSolve = async () => {
    setIsSolving(true);
  }

  useEffect(() => {
    if (isSolving === false) return;
    dispatch({ type: ACTIONS.SOLVE })
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
    dispatch({ type: ACTIONS.SET_FIELD, payload: { clicked, value }});
    setClicked(null);
  }

  // shows and places the number selector
  const showSelector = (e, index) => {
    setSelPos([e.clientX, e.clientY]);
    setClicked(index);
  }

  useEffect(() => {
    const [errn, errh] = checkValid(fields);
    setErrNumber(errn);
    setErrHightlight(errh);
  }, [fields]);

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
          <button onClick={() => dispatch({ type: ACTIONS.LOAD_RANDOM })}>Load</button>
          <button onClick={startSolve}>Start Solving</button>
          <button onClick={() => dispatch({ type: ACTIONS.SOLVE_ONE })}>Solve One</button>
          <button onClick={() => dispatch({ type: ACTIONS.CLEAR })}>Clear</button>
          <button onClick={() => dispatch({ type: ACTIONS.RESET })}>Reset</button>
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
