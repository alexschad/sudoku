import React, { useState } from 'react';
import { styled } from '@material-ui/core/styles';
import { spacing } from '@material-ui/system';
import MuiButton from '@material-ui/core/Button';
import { ACTIONS } from './Reducer';

import { solve } from './solve';
import Board from './Board';

const Button = styled(MuiButton)(spacing);

const CustomSudoku = ({ dispatch }) => {
  const [fields, setFields] = useState(Array(81).fill(0));

  // sets a number in a field called by the number selector
  const selectNumber = (clicked, value) => {
    const currentFields = [...fields];
    currentFields[clicked] = value;
    setFields(currentFields);
  };

  const testAndPlay = () => {
    const solution = solve(fields);
    if (isNaN(solution[0])) {
      alert('This is not a valid Sudoku. Please fix it and try again.');
      return;
    }
    dispatch({ type: ACTIONS.LOAD_CUSTOM, payload: { fields, solution } });
    setFields(solution);
  };

  const clear = () => {
    setFields(Array(81).fill(0));
  };

  return (
    <div>
      <Board fields={fields} selectNumber={selectNumber} />
      <div className="menu">
        <Button mx={1} onClick={clear}>
          Clear
        </Button>
        <Button mx={1} onClick={testAndPlay}>
          Play the Sudoku
        </Button>
      </div>
    </div>
  );
};
export default CustomSudoku;
