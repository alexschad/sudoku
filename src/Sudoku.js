import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@material-ui/core/styles';
import { spacing } from '@material-ui/system';
import MuiButton from '@material-ui/core/Button';

import './Sudoku.css';
import reducer, {
  withLocalStorageCache,
  initializeSudoku,
  ACTIONS,
  SUDOKUS,
} from './Reducer';
import Field from './Field';
import NumberSelector from './NumberSelector';
import { rows, cols, squares } from './data';
import { checkValid, formatTime } from './util';
import NewGameDialog from './NewGameDialog';

/**
 * Applies the spacing system to the material UI Button
 */
const Button = styled(MuiButton)(spacing);

//main Module that shows the Fields, the Menu and the Number selector
function Sudoku() {
  const timeOutRef = useRef(null);

  const [
    { type, fields, sudokuIndex, gameState, timer, mistakes, solution, hints },
    dispatch,
  ] = React.useReducer(
    withLocalStorageCache(reducer),
    undefined,
    initializeSudoku,
  );
  const [highlight, setHightlight] = useState([]);
  const [errHighlight, setErrHightlight] = useState([]);
  const [errNumber, setErrNumber] = useState([]);
  const [over, setOver] = useState();
  const [clicked, setClicked] = useState(null);
  const [selPos, setSelPos] = useState([0, 0]);
  const [isSolving, setIsSolving] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [open, setOpen] = React.useState(type === null);

  const isFirstRenderRef = useRef(true);

  useEffect(() => {
    clearTimeout(timeOutRef.current);
  }, [gameState]);
  useEffect(() => {
    if (timer === 0) {
      clearTimeout(timeOutRef.current);
    }
    if (gameState === 'running' && !isSolved) {
      timeOutRef.current = setTimeout(() => {
        dispatch({ type: ACTIONS.SET_TIMER, payload: { timer: timer + 1 } });
      }, 1000);
    }
  }, [timer, gameState, isSolved]);

  useEffect(() => {
    if (isFirstRenderRef.current) return;
    if (sudokuIndex !== null) {
      dispatch({ type: ACTIONS.LOAD, payload: { sudokuIndex } });
    } else {
      dispatch({ type: ACTIONS.CLEAR });
    }
  }, [sudokuIndex, isFirstRenderRef]);

  useEffect(() => {
    isFirstRenderRef.current = false;
  }, []);

  // start to solve the whole sudoku
  const startSolve = async () => {
    setIsSolving(true);
  };

  useEffect(() => {
    if (isSolving === false) return;
    dispatch({ type: ACTIONS.SOLVE });
    setIsSolving(false);
  }, [isSolving, fields]);

  useEffect(() => {
    const solved = fields.filter((i) => i === 0).length === 0;
    setIsSolved(solved);
  }, [fields]);

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

  // sets a number in a field called by the number selector
  const selectNumber = (clicked, value) => {
    dispatch({ type: ACTIONS.SET_FIELD, payload: { clicked, value } });
    setClicked(null);
  };

  // shows and places the number selector
  const showSelector = (e, index) => {
    setSelPos([e.clientX, e.clientY]);
    setClicked(index);
  };

  useEffect(() => {
    const [errn, errh] = checkValid(fields, solution);
    setErrNumber(errn);
    setErrHightlight(errh);
  }, [fields, solution]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    dispatch({ type: ACTIONS.LOAD_RANDOM, payload: { type: value } });
    setOpen(false);
  };

  return (
    <div className="Sudoku">
      <div className={isSolving ? 'container solving' : 'container'}>
        <header className="Sudoku-header">Sudoku</header>
        {isSolved ? (
          <div className="success" onClick={() => setIsSolved(false)}>
            Congratulations you solved the sudoku!
          </div>
        ) : null}
        <div className="info">
          <div className="infoScore">
            <p>Mistakes: {mistakes}</p>
            <p>Hints: {hints}</p>
          </div>
          <div className="infoType">{type}</div>
          <div className="timerContainer">
            <p className="timer">{formatTime(timer)}</p>
            {gameState === 'running' ? (
              <div
                className="pause"
                onClick={() => dispatch({ type: ACTIONS.PAUSE_GAME })}
              />
            ) : (
              <div
                className="resume"
                onClick={() => dispatch({ type: ACTIONS.RESUME_GAME })}
              />
            )}
          </div>
        </div>

        {gameState === 'paused' ? (
          <div
            className="pausedBoard"
            onClick={() => dispatch({ type: ACTIONS.RESUME_GAME })}>
            {Array(81)
              .fill(0)
              .map((f, i) => (
                <Field
                  key={i}
                  index={i}
                  fields={Array(81).fill(0)}
                  sudoku={null}
                  showSelector={() => {}}
                  showHints={false}
                  mouseEnter={() => {}}
                  mouseLeave={() => {}}
                />
              ))}
          </div>
        ) : (
          <div className="board">
            {fields.map((f, i) => (
              <Field
                key={i}
                index={i}
                fields={fields}
                sudoku={
                  type !== null && sudokuIndex !== null
                    ? SUDOKUS[type][sudokuIndex]
                    : null
                }
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
          </div>
        )}
        <NewGameDialog open={open} onClose={handleClose} />
        <div className="menu">
          <Button mx={1} onClick={handleClickOpen}>
            New Game
          </Button>
          <Button mx={1} onClick={() => dispatch({ type: ACTIONS.SOLVE_ONE })}>
            Hint
          </Button>
          <Button
            mx={1}
            onClick={() => dispatch({ type: ACTIONS.HISTORY_BACK })}>
            Undo
          </Button>
          <Button mx={1} onClick={() => dispatch({ type: ACTIONS.RESET })}>
            Reset
          </Button>
          <Button mx={1} onClick={startSolve}>
            Solve Sudoku
          </Button>
          <Button mx={1} onClick={(e) => setShowHints(!showHints)}>
            {showHints ? 'Hide' : 'Show'} Help
          </Button>
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
