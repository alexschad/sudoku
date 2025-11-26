// Cross product of elements in A and elements in B.
const cross = (A, B) => {
  const res = [];
  [...A].forEach( a => {
    [...B].forEach( b => {
      res.push(a+b);
    });
  });
  return res;
}

const digits = '123456789';
const rows = 'ABCDEFGHI';
const cols = digits;
const squares = cross(rows, cols);
const colunits = [...cols].map(c => cross(rows,c));
const rowunits = [...rows].map(r => cross(r, cols));
const blockunits = [];
['ABC','DEF','GHI'].forEach( l => {
  ['123','456','789'].forEach(n => {
    blockunits.push(cross(l,n));
  })
});
const unitlist = [...colunits, ...rowunits, ...blockunits];

const units = {};
squares.forEach( s => {
  units[s] = unitlist.reduce( (acc, curr) => {
    if (curr.includes(s)) {
      acc.push(curr);
    }
    return acc;
  },[]);
});

const peers = {};
squares.forEach( s => {
  const x = new Set(units[s].flat());
  peers[s] = [...x].filter(x => x !== s);
});

const objectsEqual = (o1, o2) => 
    typeof o1 === 'object' && Object.keys(o1).length > 0 
        ? Object.keys(o1).length === Object.keys(o2).length 
            && Object.keys(o1).every(p => objectsEqual(o1[p], o2[p]))
        : o1 === o2;

const test = () => {
    // A set of unit tests.
    console.assert(squares.length === 81, 'Square length not 81');
    console.assert(unitlist.length === 27, 'Unitlist length not 27');
    squares.forEach(s => {
      console.assert(units[s].length === 3, `${s} units length not 3`);
      console.assert(peers[s].length === 20, `${s} peers length not 20`);
    })
    console.assert(objectsEqual(units['C2'], [['A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2', 'I2'],
                           ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9'],
                           ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3']]), 'C2 units wrong');

    console.assert(objectsEqual(peers['C2'], ['A2', 'B2', 'D2', 'E2', 'F2', 'G2', 'H2', 'I2',
                               'C1', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9',
                               'A1', 'A3', 'B1', 'B3']), 'C2 peers wrong');
    console.log('All tests pass.')
}

test();
// const zip = rows=>rows[0].map((_,c)=>rows.map(row=>row[c]));

const grid_values = (grid) => {
  // Convert grid into a dict of {square: char} with '0' or '.' for empties.
  const grid_vals = {};
  const chars = [...grid].filter( c => [...digits].includes(c) || ['0', '.'].includes(c));
  console.assert(chars.length === 81, 'GRID_VALUES: chars.lentgh not 81');
  squares.forEach((s,i) => {
    grid_vals[s] = chars[i];
  });
  return grid_vals;
};


const eliminate = (values, s, d) => {
  // Eliminate d from values[s]; propagate when values or places <= 2.
  // Return values, except return False if a contradiction is detected.
  if (![...values[s]].includes(d)) {
    return values; //Already eliminated
  }
  values[s] = values[s].replace(d,'');
  // (1) If a square s is reduced to one value d2, then eliminate d2 from the peers.
  if (values[s].length === 0) {
    return false // Contradiction: removed last value
  } else if (values[s].length === 1) {
    const d2 = values[s];
    if (!peers[s].every( s2 => eliminate(values, s2, d2))) {
      return false;
    }
  }
  // (2) If a unit u is reduced to only one place for a value d, then put it there.
  let dplaces;
  units[s].forEach( u => {
    dplaces = u.reduce((acc, curr) => {
      if (values[curr].includes(d)) {
        acc.push(curr);
      }
      return acc;
    },[]);
  });
  if (dplaces.length === 0) {
    return false;
  } else if (dplaces.length === 1) {
    // d can only be in one place in unit; assign it there
    if (!assign(values, dplaces[0], d)) {
      return false;
    }
  }
  return values;
}


const assign = (values, s, d) => {
  // Eliminate all the other values (except d) from values[s] and propagate.
  // Return values, except return False if a contradiction is detected.
  const other_values = values[s].replace(d, '');
  const elmap = [...other_values].map( d2 => eliminate(values, s, d2));
  if (elmap.every( em => em)) {
    return values;
  } else {
    return false;
  }
};

const parse_grid = (grid) => {
  // Convert grid to a dict of possible values, {square: digits}, or
  // return False if a contradiction is detected.
  // To start, every square can be any digit; then assign values from the grid.
  const values = {};
  squares.forEach( s => values[s] = digits);

  for (const [s, d] of Object.entries(grid_values(grid))) {
    if ([...digits].includes(d) && !assign(values, s, d)) {
      return false;
    }
  };
  return values;
};


const search = values => {
  // Using depth-first search and propagation, try all possible values.
  if (!values) return false; // failed earlier
  if (squares.every(s => values[s].length === 1)) return values; // SOLVED!

  // Chose the unfilled square s with the fewest possibilities
  const sorted = squares.filter( s => values[s].length > 1).sort( (a, b) => values[a].length - values[b].length);
  const fewest = sorted[0];

  let res = false;
  for (const d of [...values[fewest]]) {
    res = search(assign({...values}, fewest, d));
    if (res) {
      break;
    }
  }
  return res;
}

const format = grid => {
  // display(grid);
  // console.log(squares.map(s => parseInt(grid[s], 10)));
  return squares.map(s => parseInt(grid[s], 10));
}
export const solve = grid => format(search(parse_grid(grid.join())));

// const center = (txt, lgt, chr=' ') => {
//   let txtcopy = txt;
//   if (txt.length >= lgt) return txt;
//   let pos = 'back';
//   while (txtcopy.length < lgt) {
//     if (pos === 'front') {
//       txtcopy = chr + txtcopy;
//       pos = 'back';
//     } else {
//       txtcopy = txtcopy + chr;
//       pos = 'front';
//     }
//   }
//   return txtcopy;
// };

// const display = values => {
//   // Display these values as a 2-D grid.
//   const width = 1 + Math.max(...squares.map( s=> values[s].length));
//   const line = new Array(3).fill('-'.repeat(width*3)).join('+');
//   [...rows].forEach(r => {
//     let s = [...cols].map(c => {
//       let x = center(values[r+c], width);
//       if (['3','6'].includes(c)) x += '|';
//       return x;
//     });
//     console.log(s.join(''));
//     if (['C', 'F'].includes(r)) console.log(line);
//   });
// }

// (async function() {
//   await fs.readFile('easy.json', 'utf8', (err, data) => {
//     if (err) throw err;
//     const parsed = JSON.parse(data);
//     // console.log(parsed);
//     const sudoku1 = parsed[0].join('')
//     // console.log(sudoku1);
//     // const parsed2 = parse_grid(sudoku1)
//     // console.log(parsed2);
//     display(grid_values(sudoku1));
//     console.log('-----------------------------------');
//     display(solve(sudoku1));
//     // const solution = solve(parsed[0], parsed[0]);
//     // console.log(solution);
//   });

// })();



// def parse_grid(grid):
//     """Convert grid to a dict of possible values, {square: digits}, or
//     return False if a contradiction is detected."""
//     ## To start, every square can be any digit; then assign values from the grid.
//     values = dict((s, digits) for s in squares)
//     for s,d in grid_values(grid).items():
//         if d in digits and not assign(values, s, d):
//             return False ## (Fail if we can't assign d to square s.)
//     return values

// def grid_values(grid):
//     "Convert grid into a dict of {square: char} with '0' or '.' for empties."
//     chars = [c for c in grid if c in digits or c in '0.']
//     assert len(chars) == 81
//     return dict(zip(squares, chars))

// def assign(values, s, d):
//     """Eliminate all the other values (except d) from values[s] and propagate.
//     Return values, except return False if a contradiction is detected."""
//     other_values = values[s].replace(d, '')
//     if all(eliminate(values, s, d2) for d2 in other_values):
//         return values
//     else:
//         return False

// def eliminate(values, s, d):
//     """Eliminate d from values[s]; propagate when values or places <= 2.
//     Return values, except return False if a contradiction is detected."""
//     if d not in values[s]:
//         return values ## Already eliminated
//     values[s] = values[s].replace(d,'')
//     ## (1) If a square s is reduced to one value d2, then eliminate d2 from the peers.
//     if len(values[s]) == 0:
//         return False ## Contradiction: removed last value
//     elif len(values[s]) == 1:
//         d2 = values[s]
//         if not all(eliminate(values, s2, d2) for s2 in peers[s]):
//             return False
//     ## (2) If a unit u is reduced to only one place for a value d, then put it there.
//     for u in units[s]:
//         dplaces = [s for s in u if d in values[s]]
//     if len(dplaces) == 0:
//         return False ## Contradiction: no place for this value
//     elif len(dplaces) == 1:
//         # d can only be in one place in unit; assign it there
//         if not assign(values, dplaces[0], d):
//             return False
//     return values

// def display(values):
//     "Display these values as a 2-D grid."
//     width = 1+max(len(values[s]) for s in squares)
//     line = '+'.join(['-'*(width*3)]*3)
//     for r in rows:
//         print (''.join(values[r+c].center(width)+('|' if c in '36' else '') for c in cols))
//         if r in 'CF': print (line)
//     print

// def search(values):
//     "Using depth-first search and propagation, try all possible values."
//     if values is False:
//         return False ## Failed earlier
//     if all(len(values[s]) == 1 for s in squares): 
//         return values ## Solved!
//     ## Chose the unfilled square s with the fewest possibilities
//     _, s = min((len(values[s]), s) for s in squares if len(values[s]) > 1)
//     return some(search(assign(values.copy(), s, d)) 
// 		for d in values[s])

// def some(seq):
//     "Return some element of seq that is true."
//     for e in seq:
//         if e: return e
//     return False

// def solve(grid):
//     return search(parse_grid(grid))
