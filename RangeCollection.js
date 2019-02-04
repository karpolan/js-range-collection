// Task: Implement a 'Range Collection' class.
// A pair of integers define a range, for example: [1, 5). This range includes integers: 1, 2, 3, and 4.
// A range collection is an aggregate of these ranges: [1, 5), [10, 11), [100, 201)


/**
 * Utility doesn't allow to add the same Range twice.
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

/**
 * RangeCollection class
 * NOTE: Feel free to add any extra member variables/functions you like.
 */
class RangeCollection {

  /**
   * Creates internal properties
   */
  constructor() {
    this.rangesInclude = [];
    this.rangesExclude = [];
  }

  /**
   * Returns current set of ranges as flat (single dimension) array.
   * "Combined" ranges flat array is built form 'this.rangesInclude' property.
   * If 'this.rangesExclude' property is not empty, we filter "Combined" ranges as follow:
   * 1. "Excluded" ranges flat array is built in the same way as "Combined" one.
   * 2. We transform every "Combined" range by all "Excluded" ranges at once. 
   * 3. All transformed ranges are stored into the "Filtred" array.
   * @return {Array<number>} - [a1, a2, b1, b2...] "Combined" or "Filtred" ranges as flat array.
   */
  getFlatRanges() {
    const combined = [], excluded = [], filtred = []; 
    let first = undefined, last = undefined;
 
    // Get flat array of "Combined" ranges
    this.rangesInclude.sort((a, b) => a[0] - b[0]); // Sort ASC
    first = this.rangesInclude[0][0];
    last  = this.rangesInclude[0][1];
    for (let i = 0; i < this.rangesInclude.length - 1; i++) {
      const a = this.rangesInclude[i];
      const b = this.rangesInclude[i + 1];
      if (last < b[0]) {
        // No intersection
        combined.push(first, last); // Save previous range
        first = b[0];
        last = b[1];
      } else {
        // Ranges overlap
        if (first === undefined) first = a[0];
        if (last === undefined) last = a[1];
        last = Math.max(a[1], last);
        last = Math.max(b[1], last);
      }
    } // for
    combined.push(first, last); // Save latest range

    // If there are no "Excluded" ranges return "Combined" ranges as is
    if (this.rangesExclude.length < 1) return combined;

    // Get "Excluded" ranges as flat array
    this.rangesExclude.sort((a, b) => a[0] - b[0]); // Sort ASC
    first = this.rangesExclude[0][0];
    last  = this.rangesExclude[0][1];
    for (let i = 0; i < this.rangesExclude.length - 1; i++) {
      const a = this.rangesExclude[i];
      const b = this.rangesExclude[i + 1];
      if (last < b[0]) {
        // No intersection
        excluded.push(first, last); // Save previous range
        first = b[0];
        last = b[1];
      } else {
        // Ranges overlap
        if (first === undefined) first = a[0];
        if (last === undefined) last = a[1];
        last = Math.max(a[1], last);
        last = Math.max(b[1], last);
      }
    } // for
    excluded.push(first, last); // Save latest range
  
    // Filter every "Combined" range (a) by all "Excluded" ranges (b)  
    for (let i = 0; i < combined.length - 1; i += 2) {
      let a = [combined[i], combined[i + 1]];

      for (let j = 0; j < excluded.length - 1; j += 2) {
        const b = [excluded[j], excluded[j + 1]];

        if ((a[1] < b[0]) || (a[0] > b[1])) {
          // No intersection - Do nothing
        } else 
        if ((a[0] < b[0]) && (b[1] < a[1])) {
          // Range is splited
          addUniqueRange(filtred, [a[0], b[0]]); // Save "left" part 
          a[0] = b[1]; // Continue with "right" part only
        } else 
        if ((b[0] <= a[1]) && (a[1] <= b[1])) {
          // Cut at the end
          a[1] = b[0];
        } else 
        if ((b[0] <= a[0]) && (a[0] <= b[1]))  {
          // Cut at the begin
          a[0] = b[1];
        }
      } // for j

      addUniqueRange(filtred, [a[0], a[1]]);  // Save the "filterd" part
    } // for i   
  
    return filtred;
  } // getFlatRanges()

  /**
   * Adds a range to the collection
   * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
   */
  add(range) {
    this.rangesInclude.push(range);
    return this.rangesInclude; // Could be useful
  }

  /**
   * Removes a range from the collection
   * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
   */
  remove(range) {
    this.rangesExclude.push(range);
    return this.rangesExclude; // Could be useful
  }

  /**
   * Prints out the list of ranges in the range collection
   */
  print() {
    const flatRanges = this.getFlatRanges();
    let output = '';
    for (let i = 0; i < flatRanges.length; i += 2) {
      output += `[${flatRanges[i]}, ${flatRanges[i + 1]}) `; // "[a, b) "
    }
    output = output.trim();
    console.log(output);
    return output;
  }

} // class RangeCollection


/**
 * Example run
 */
const runExample = () => {
  const rc = new RangeCollection();

  rc.add([1, 5]);
  rc.print();
  // Should display: [1, 5)

  rc.add([10, 20]);
  rc.print();
  // Should display: [1, 5) [10, 20)

  rc.add([20, 20]);
  rc.print();
  // Should display: [1, 5) [10, 20)

  rc.add([20, 21]);
  rc.print();
  // Should display: [1, 5) [10, 21)

  rc.add([2, 4]);
  rc.print();
  // Should display: [1, 5) [10, 21)

  rc.add([3, 8]);
  rc.print();
  // Should display: [1, 8) [10, 21)
 
  rc.remove([10, 10]);
  rc.print();
  // Should display: [1, 8) [10, 21)

  rc.remove([10, 11]);
  rc.print();
  // Should display: [1, 8) [11, 21)

  rc.remove([15, 17]);
  rc.print();
  // Should display: [1, 8) [11, 15) [17, 21)

  rc.remove([3, 19]);
  rc.print();
  // Should display: [1, 3) [19, 21)
}
runExample();


//export { RangeCollection };
module.exports = RangeCollection;
