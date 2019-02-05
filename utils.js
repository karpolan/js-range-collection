/**
 * Merges A and B ranges 
 */
const rangeMerge = (a, b) => {
  return [
    Math.min(a[0], b[0]), // most "left"
    Math.max(a[1], b[1])  // most "right"
  ];
}

/**
 * Cuts the one range by another 
 */
const rangeCut = (a, b) => {
  return [
    a[0] <= b[0] ? a[1] : b[0],
    a[1] < b[1] ? b[1] : a[0]
  ];
}

/**
 * Splits one range by another
 */
const rangeSplit = (a, b) => {
  return [
    [b[0], a[0]], // "left" part 
    [a[1], b[1]]  // "right" part
  ];
}

/**
 * Utility doesn't allow adding the same Range twice.
 * @param {Array<number>} arr - [a1, a2, b1, b2...] array of ranges.
 * @param {Array<number>} range - [b1, b2] array with new range to add.
 */
const addUniqueRange = (arr, range) => {
  for (let i = 0; i < arr.length - 1; i += 2) {
    if ((arr[i] === range[0]) && (arr[i + 1] === range[1])) return arr; // this range is already added 
  }
  arr.push(range[0], range[1]);
  return arr;
}


module.exports = {
  rangeMerge,
  rangeCut,
  rangeSplit,
  addUniqueRange
}