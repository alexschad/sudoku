import { rows, cols, squares } from './data';

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

export const checkValid = (boardsState, solution) => {
  const filledRows = rows.map(r => r.map(ri => boardsState[ri]));
  const filledCols = cols.map(c => c.map(ci => boardsState[ci]));
  const filledSquares = squares.map(s => s.map(si => boardsState[si]));

  const errRows = filledRows.map((fr, i) => {
    const duplicates = dupes(fr.filter(it => it !== 0));
    const duplicateIndices = fr.map((a,i2) => duplicates.includes(a?.toString()) ? rows[i][i2] : 0).filter(j => j !== 0);
    return [duplicateIndices, i];
  }).filter(fr => fr[0].length > 0);

  const errCols = filledCols.map((fr, i) => {
    const duplicates = dupes(fr.filter(it => it !== 0));
    const duplicateIndices = fr.map((a,i2) => duplicates.includes(a?.toString()) ? cols[i][i2] : 0).filter(j => j !== 0);
    return [duplicateIndices, i];
  }).filter(fr => fr[0].length > 0);

  const errSquares = filledSquares.map((fr, i) => {
    const duplicates = dupes(fr.filter(it => it !== 0));
    const duplicateIndices = fr.map((a,i2) => duplicates.includes(a?.toString()) ? squares[i][i2] : 0).filter(j => j !== 0);
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

  boardsState.forEach((v, i) => {
    if (solution.length === 81 && v !== 0 && v !== solution[i]) {
      errNumber = [...errNumber, i]
    }
  })

  return [errNumber, errHighlight];
};

export const formatTime = (duration) => {
  const nonPaddedIntl = Intl.NumberFormat('en-us', { minimumIntegerDigits: 1 });
  const paddedIntl = Intl.NumberFormat('en-us', { minimumIntegerDigits: 2 })

  const [delimiter] = new Date().toLocaleTimeString('en-us').match(/\b[:.]\b/);
  // const duration = 49_500; // input in seconds
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor(duration / 60) % 60;
  const seconds = duration % 60;
  const indexToPad = hours ? 0 : 1;
  const timeFormat =
    [hours, minutes, seconds]
    .map((val, i) => {
      return (val < 10 && i > indexToPad) ? paddedIntl.format(val) : nonPaddedIntl.format(val);
    })
    .filter((val, i) => {
      if (i === 0) {
          return !(val === '00' || val === '0');
      }

      return true;
    })
    .join(delimiter); // 4:32
    return timeFormat;
}