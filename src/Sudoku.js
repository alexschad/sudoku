import React, { useState, useEffect, useRef } from 'react';
import './Sudoku.css';
import Field from './Field';
import NumberSelector from './NumberSelector';
import { rows, cols, squares } from './data';
import easy from './easy';
import medium from './medium';
import hard from './hard';
import { checkValid, formatTime } from './util';
import { solve } from './solve';
import NewGameDialog from './NewGameDialog';

import { styled } from '@material-ui/core/styles';
import { spacing } from '@material-ui/system';
import MuiButton from '@material-ui/core/Button';

/**
 * Applies the spacing system to the material UI Button
 */
const Button = styled(MuiButton)(spacing);

export const ACTIONS = {
  LOAD_RANDOM: 'load_random',
  LOAD: 'load',
  CLEAR: 'clear',
  RESET: 'reset',
  SOLVE: 'solve',
  SOLVE_ONE: 'solve_one',
  SET_FIELD: 'set_field',
  PAUSE_GAME: 'pause_game',
  SET_TIMER: 'set_timer',
  HISTORY_BACK: 'history_back',
};

const SUDOKUS = {
  easy,
  medium,
  hard,
};

const sudokuReducer = (state, action) => {
  const { type, fields, sudokuIndex } = state;
  switch (action.type) {
    // randomly loads one of the stored sudokus
    case ACTIONS.LOAD_RANDOM:
      let newType;
      let newIndex;
      let newFields;
      if (action.payload.type === 'random') {
        newType = ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)];
        newIndex = Math.floor(Math.random() * SUDOKUS[newType].length);
        newFields = SUDOKUS[newType][newIndex];
      } else if (action.payload.type === 'custom') {
        newType = 'custom';
        newIndex = null;
        newFields = Array(81).fill(0);
      } else {
        newType = action.payload.type;
        newIndex = Math.floor(Math.random() * SUDOKUS[newType].length);
        newFields = SUDOKUS[newType][newIndex];
      }
      const solution = solve(newFields);
      return {
        ...state,
        type: newType,
        fields: newFields,
        solution,
        sudokuIndex: newIndex,
        timer: 0,
        gameState: 'running',
        history: [],
        mistakes: 0,
      };
    // loads one of the stored sudokus
    case ACTIONS.LOAD: {
      const fields = SUDOKUS[type][action.payload.sudokuIndex];
      const solution = solve(fields);
      return {
        ...state,
        fields,
        solution,
        sudokuIndex: action.payload.sudokuIndex,
        timer: 0,
        history: [],
        mistakes: 0,
      };
    }
    // clears all user selected fields. resets to the current sudoku
    case ACTIONS.RESET:
      if (!type || type === 'custom') {
        return {
          ...state,
          type: 'custom',
          fields: Array(81).fill(0),
          sudokuIndex: null,
          timer: 0,
          history: [],
          mistakes: 0,
        };
      }
      return {
        ...state,
        fields: SUDOKUS[type][sudokuIndex],
        sudokuIndex: sudokuIndex,
        timer: 0,
        history: [],
        mistakes: 0,
      };
    // clears all fields
    case ACTIONS.CLEAR:
      return {
        ...state,
        fields: Array(81).fill(0),
        solution: [],
        sudokuIndex: null,
        timer: 0,
        history: [],
        mistakes: 0,
      };
    // solve the sudoku
    case ACTIONS.SOLVE:
      return { ...state, fields: state.solution };
    // solve one field of the sudoku
    case ACTIONS.SOLVE_ONE: {
      const history = [...state.history, fields];
      const nullIndices = fields
        .map((f, i) => i)
        .filter((i) => fields[i] === 0);
      const solIndex =
        nullIndices[Math.floor(Math.random() * nullIndices.length)];
      const sol = [solIndex, state.solution[solIndex]];
      const newFields = [...fields];
      newFields[sol[0]] = sol[1];
      return { ...state, fields: newFields, history };
    }
    // set one field with a number
    case ACTIONS.SET_FIELD: {
      const history = [...state.history, fields];
      const currentFields = [...fields];
      currentFields[action.payload.clicked] = action.payload.value;
      const mistakes =
        state.solution[action.payload.clicked] === action.payload.value
          ? state.mistakes
          : state.mistakes + 1;
      return { ...state, fields: currentFields, history, mistakes };
    }
    // pause game
    case ACTIONS.PAUSE_GAME:
      return { ...state, gameState: 'paused' };
    // resume game
    case ACTIONS.RESUME_GAME:
      return { ...state, gameState: 'running' };
    case ACTIONS.SET_TIMER:
      return { ...state, timer: action.payload.timer };
    // undo last action
    case ACTIONS.HISTORY_BACK: {
      if (state.history.length === 0) {
        return { ...state };
      }
      const fields = state.history[state.history.length - 1];
      const history = state.history.slice(0, state.history.length - 1);
      return { ...state, fields, history };
    }
    default:
      return state;
  }
};

//main Module that shows the Fields, the Menu and the Number selector
function Sudoku() {
  const timeOutRef = useRef(null);
  const initialSudoku = () => {
    const sudokuTypeJSON = window.localStorage.getItem('type');
    const type = sudokuTypeJSON ? JSON.parse(sudokuTypeJSON) : null;
    const sudokuIndexJSON = window.localStorage.getItem('index');
    const sudokuIndex = sudokuIndexJSON ? JSON.parse(sudokuIndexJSON) : null;
    const sudokuFieldsJSON = window.localStorage.getItem('fields');
    let fields;
    let solution;
    if (sudokuFieldsJSON) {
      fields = JSON.parse(sudokuFieldsJSON);
      solution = solve(fields);
    } else {
      fields = Array(81).fill(0);
      solution = [];
    }
    const sudokuStateJSON = window.localStorage.getItem('gameState');
    const gameState = sudokuStateJSON ? JSON.parse(sudokuStateJSON) : 'paused';
    const sudokuTimerJSON = window.localStorage.getItem('timer');
    const timer = sudokuTimerJSON ? JSON.parse(sudokuTimerJSON) : 0;
    const sudokuHistoryJSON = window.localStorage.getItem('history');
    const history = sudokuHistoryJSON ? JSON.parse(sudokuHistoryJSON) : [];
    const sudokuMistakesJSON = window.localStorage.getItem('mistakes');
    const mistakes = sudokuTimerJSON ? JSON.parse(sudokuMistakesJSON) : 0;
    return {
      type,
      fields,
      sudokuIndex,
      gameState,
      timer,
      history,
      mistakes,
      solution,
    };
  };

  const [
    {
      type,
      fields,
      sudokuIndex,
      gameState,
      timer,
      history,
      mistakes,
      solution,
    },
    dispatch,
  ] = React.useReducer(sudokuReducer, undefined, initialSudoku);
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

  useEffect(() => window.localStorage.setItem('type', JSON.stringify(type)), [
    type,
  ]);
  useEffect(
    () => window.localStorage.setItem('history', JSON.stringify(history)),
    [history],
  );
  useEffect(
    () => window.localStorage.setItem('mistakes', JSON.stringify(mistakes)),
    [mistakes],
  );
  useEffect(
    () => window.localStorage.setItem('fields', JSON.stringify(fields)),
    [fields],
  );
  useEffect(() => {
    clearTimeout(timeOutRef.current);
    window.localStorage.setItem('gameState', JSON.stringify(gameState));
  }, [gameState]);
  useEffect(() => {
    if (timer === 0) {
      clearTimeout(timeOutRef.current);
    }
    if (gameState === 'running' && !isSolved) {
      timeOutRef.current = setTimeout(() => {
        dispatch({ type: ACTIONS.SET_TIMER, payload: { timer: timer + 1 } });
        window.localStorage.setItem('timer', JSON.stringify(timer));
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
    window.localStorage.setItem('index', JSON.stringify(sudokuIndex));
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

  // if (gameState === 'paused') {
  //   return (<div className="Menu">
  //     <h3>Game Paused</h3>
  //     <button onClick={() => dispatch({ type: ACTIONS.LOAD_RANDOM })}>Random</button>
  //   </div>);
  // }

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
          <div className="infoType">{type}</div>
          <div className="infoMistakes">Mistakes: {mistakes}</div>
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
          <Button mx={1} onClick={startSolve}>
            Solve Sudoku
          </Button>
          <Button mx={1} onClick={() => dispatch({ type: ACTIONS.SOLVE_ONE })}>
            Solve One
          </Button>
          <Button mx={1} onClick={() => dispatch({ type: ACTIONS.RESET })}>
            Reset
          </Button>
          <Button
            mx={1}
            onClick={() => dispatch({ type: ACTIONS.HISTORY_BACK })}>
            Undo
          </Button>
          <Button mx={1} onClick={(e) => setShowHints(!showHints)}>
            {showHints ? 'Hide' : 'Show'} Hints
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
