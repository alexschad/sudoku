import React, { useState, useEffect } from 'react';
import './App.css';
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
    // const solved = await solvePromise(fields);
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

  return (
    <div className="App">
      <div className={isSolving ? 'container solving' : 'container'}>
      <header className="App-header">Sudoku Helper</header>
        <div className="board">
          {fields.map((f,i) => 
            <Field
              key={i}
              index={i}
              value={fields[i]}
              sudokuIndex={sudokuIndex}
              showSelector={showSelector}
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
          <button onClick={() => setShowJSON(!showJSON)}>Show JSON</button>
          <button onClick={clear}>Clear</button>
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
