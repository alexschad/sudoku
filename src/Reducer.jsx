import easy from './easy';
import medium from './medium';
import hard from './hard';
import { solve } from './solve';

export const ACTIONS = {
  LOAD_RANDOM: 'load_random',
  LOAD_CUSTOM: 'load_custom',
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
  let data;
  const JSONData = localStorage.getItem('data');
  if (JSONData) {
    data = JSON.parse(JSONData);
  } else {
    data = {
      type: null,
      fields: Array(81).fill(0),
      solution: [],
      sudoku: null,
      gameState: 'paused',
      timer: 0,
      history: [],
      mistakes: 0,
      hints: 0,
      createCustomBoard: false,
    };
  }
  return data;
};

const reducer = (state, action) => {
  const { type, fields, sudoku } = state;
  switch (action.type) {
    // randomly loads one of the stored sudokus
    case ACTIONS.LOAD_RANDOM:
      let newType;
      let newIndex;
      let newFields;
      let solution;
      let createCustomBoard = false;
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
        createCustomBoard = true;
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
        sudoku: newFields,
        timer: 0,
        gameState: 'running',
        history: [],
        mistakes: 0,
        hints: 0,
        createCustomBoard,
      };
    // loads one of the stored sudokus
    case ACTIONS.LOAD_CUSTOM: {
      return {
        ...state,
        type: 'custom',
        fields: action.payload.fields,
        solution: action.payload.solution,
        sudoku: action.payload.fields,
        timer: 0,
        history: [],
        mistakes: 0,
        hints: 0,
        createCustomBoard: false,
      };
    }
    // loads one of the stored sudokus
    case ACTIONS.LOAD: {
      const fields = action.payload.sudoku;
      const solution = solve(fields);
      return {
        ...state,
        fields,
        solution,
        sudoku: fields,
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
          sudoku: null,
          timer: 0,
          history: [],
          mistakes: 0,
          hints: 0,
        };
      }
      return {
        ...state,
        fields: sudoku,
        sudoku: sudoku,
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
        sudoku: null,
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

export const withLocalStorageCache = (reducer) => {
  return (state, action) => {
    const newState = reducer(state, action);
    localStorage.setItem('data', JSON.stringify(newState));
    return newState;
  };
};

export default reducer;
