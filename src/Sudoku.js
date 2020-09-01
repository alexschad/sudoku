import React, { useState, useEffect } from 'react';
import './Sudoku.css';
import Field from './Field';
import NumberSelector from './NumberSelector';
import { rows, cols, squares, sudokus } from './data';
import { solve, checkValid } from './util';


function App() {
  const [fields, setFields] = useState(Array(81).fill(null));
  const [highlight, setHightlight] = useState([]);
  const [errHighlight, setErrHightlight] = useState([]);
  const [errNumber, setErrNumber] = useState([]);
  const [over, setOver] = useState();
  const [clicked, setClicked] = useState(null);
  const [selPos, setSelPos] = useState([0,0]);
  const [showJSON, setShowJSON] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [sudokuIndex, setSudokuIndex] = useState(null);
  const [showHints, setShowHints] = useState(false);

  const clear = () => {
    setFields(Array(81).fill(null));
  }

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

  const startSolve = async () => {
    setIsSolving(true);
  }

  useEffect(() => {
    if (isSolving === false) return;
    const solved = solve(fields, fields);
    setFields(solved);
    setIsSolving(false);
  }, [isSolving, fields]);

  const mouseEnter = (index) => {
    const newHighlight = [
      ...rows.find(r => r.includes(index)),
      ...cols.find(r => r.includes(index)),
      ...squares.find(r => r.includes(index)),
    ];
    setHightlight(newHighlight);
    setOver(index);
  };
  
  const mouseLeave = () => {
    setHightlight([]);
    setOver(null);
  };

  const selectNumber = (clicked, value) => {
    const newFields = [...fields];
    newFields[clicked] = value;
    setFields(newFields);
    setClicked(null);
  }

  const showSelector = (e, index) => {
    setClicked(index);
    setSelPos([e.clientX, e.clientY]);
  }

  useEffect(() => {
    const [errn, errh] = checkValid(fields);
    setErrNumber(errn);
    setErrHightlight(errh);
  }, [fields]);

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
    <div className="App">
      <div className={isSolving ? 'container solving' : 'container'}>
      <header className="App-header">Sudoku Helper</header>
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
          <button onClick={() => setShowJSON(!showJSON)}>Show JSON</button>
          <button onClick={clear}>Clear</button>
          <input type="checkbox" name="showHint" id="showHint" checked={showHints}
            onChange={(e) => setShowHints(e.target.checked)}
            />
        </div>
          <div className={showJSON ? 'code' : 'gone'}>{JSON.stringify(fields)}</div>
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

export default App;
