import { rows, cols, squares } from './data';

const tco = (f) => {
  /**
  Takes `f` function and returns wrapper in return, that may be
  used for tail recursive algorithms. Note that returned funciton
  is not side effect free and should not be called from anywhere
  else during tail recursion. In other words if
  `var f = tco(function foo() { ... bar() ... })`, then `bar`
  should never call `f`. It is ok though for `bar` to call `tco(foo)`
  instead.
  ## Examples
  var sum = tco(function(x, y) {
    return y > 0 ? sum(x + 1, y - 1) :
           y < 0 ? sum(x - 1, y + 1) :
           x
  })
  sum(20, 100000) // => 100020
  **/

  let value, active = false;
  const accumulated = [];
  return function accumulator() {
    // Every time accumulator is called, given set of parameters
    // are accumulated.
    accumulated.push(arguments);
    // If accumulator is inactive (is not in the process of
    // tail recursion) activate and start accumulating parameters.
    if (!active) {
      active = true;
      // If wrapped `f` performs tail call, then new set of parameters will
      // be accumulated causing new iteration in the loop. If `f` does not
      // performs tail call then accumulation is finished and `value` will
      // be returned. 
      while (accumulated.length) value = f.apply(this, accumulated.shift());
      active = false;
      return value;
    }
  }
}

const dupes = (arr) => {
  // return a list of the duplicates in a list
  const count = arr =>
    arr.reduce((a, b) => ({ ...a,
      [b]: (a[b] || 0) + 1
    }), {});

  const duplicates = dict =>
    Object.keys(dict).filter((a) => dict[a] > 1);

  return duplicates(count(arr));
}

export const checkValid = boardsState => {
  const filledRows = rows.map(r => r.map(ri => boardsState[ri]));
  const filledCols = cols.map(c => c.map(ci => boardsState[ci]));
  const filledSquares = squares.map(s => s.map(si => boardsState[si]));

  const errRows = filledRows.map((fr, i) => {
    const duplicates = dupes(fr.filter(it => it !== null));
    const duplicateIndices = fr.map((a,i2) => duplicates.includes(a !== null && a.toString()) ? rows[i][i2] : null).filter(j => j !== null);
    return [duplicateIndices, i];
  }).filter(fr => fr[0].length > 0);

  const errCols = filledCols.map((fr, i) => {
    const duplicates = dupes(fr.filter(it => it !== null));
    const duplicateIndices = fr.map((a,i2) => duplicates.includes(a !== null && a.toString()) ? cols[i][i2] : null).filter(j => j !== null);
    return [duplicateIndices, i];
  }).filter(fr => fr[0].length > 0);

  const errSquares = filledSquares.map((fr, i) => {
    const duplicates = dupes(fr.filter(it => it !== null));
    const duplicateIndices = fr.map((a,i2) => duplicates.includes(a !== null && a.toString()) ? squares[i][i2] : null).filter(j => j !== null);
    return [duplicateIndices, i];
  }).filter(fr => fr[0].length > 0);

  let errHighlight = [];
  let errNumber = [];

  errRows.forEach(e => {
    errNumber = [...errNumber, ...e[0]];
    errHighlight = [...errHighlight, ...rows[e[1]]];
  });

  errCols.forEach(e => {
    errNumber = [...errNumber, ...e[0]];
    errHighlight = [...errHighlight, ...cols[e[1]]];
  });

  errSquares.forEach(e => {
    errNumber = [...errNumber, ...e[0]];
    errHighlight = [...errHighlight, ...squares[e[1]]];
  });

  return [errNumber, errHighlight];
};

const solveTCO = (arr, origArray, index = null) => {
  if (arr.indexOf(null) === -1 && index === null) return arr;
  const workIndex = index === null ? arr.indexOf(null) : index;
  const val = arr[workIndex] === null ? 1 : arr[workIndex] + 1;
  const newArr = [...arr];
  if (val > 9) {
    newArr[workIndex] = null;
    // find last field worked on
    let lastIndex = 0;
    for (var x = workIndex-1; x >= 0; x--) {
      lastIndex = x;
      if (origArray[x] === null) {
        break;
      }
    }
    return solve(newArr, origArray, lastIndex);
  }
  newArr[workIndex] = val;
  const [errNumber, ] = checkValid(newArr);
  if (errNumber.length > 0) {
    return solve(newArr, origArray, workIndex);
  } else {
    return solve(newArr, origArray);
  }
};

export const solve = tco(solveTCO);
