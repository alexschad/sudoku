import easy from './easy';
import medium from './medium';
import hard from './hard';
import { solve } from './solve';

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

export const SUDOKUS = {
  easy,
  medium,
  hard,
};

export const initializeSudoku = () => {
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
  const sudokuHintsJSON = window.localStorage.getItem('hints');
  const hints = sudokuTimerJSON ? JSON.parse(sudokuHintsJSON) : 0;
  return {
    type,
    fields,
    sudokuIndex,
    gameState,
    timer,
    history,
    mistakes,
    solution,
    hints,
  };
};

const reducer = (state, action) => {
  const { type, fields, sudokuIndex } = state;
  switch (action.type) {
    // randomly loads one of the stored sudokus
    case ACTIONS.LOAD_RANDOM:
      let newType;
      let newIndex;
      let newFields;
      let solution;
      if (action.payload.type === 'random') {
        newType = ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)];
        newIndex = Math.floor(Math.random() * SUDOKUS[newType].length);
        newFields = SUDOKUS[newType][newIndex];
        solution = solve(newFields);
      } else if (action.payload.type === 'custom') {
        newType = 'custom';
        newIndex = null;
        newFields = Array(81).fill(0);
        solution = Array(81).fill(0);
      } else {
        newType = action.payload.type;
        newIndex = Math.floor(Math.random() * SUDOKUS[newType].length);
        newFields = SUDOKUS[newType][newIndex];
        solution = solve(newFields);
      }
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
        hints: 0,
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
        hints: 0,
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
          hints: 0,
        };
      }
      return {
        ...state,
        fields: SUDOKUS[type][sudokuIndex],
        sudokuIndex: sudokuIndex,
        timer: 0,
        history: [],
        mistakes: 0,
        hints: 0,
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
        hints: 0,
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
      const hints = state.hints + 1;
      return { ...state, fields: newFields, history, hints };
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

export default reducer;
