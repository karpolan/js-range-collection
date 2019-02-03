// Task: Implement a 'Range Collection' class.
// A pair of integers define a range, for example: [1, 5). This range includes integers: 1, 2, 3, and 4.
// A range collection is an aggregate of these ranges: [1, 5), [10, 11), [100, 201)


/**
 * Returns the array of range intersection. Moved outside the RangeCollection class as a generic utility. 
 * @param {Array<number>} rangeInclude - [a1, a2] two integers that specify beginning and end of include range.
 * @param {Array<number>} rangeExclude - [b1, b2] two integers that specify beginning and end of exclude range.
 * @returns
 *   []               - fully excluded
 *   [a1, a2]         - no intersection
 *   [a1, b1, b2, a2] - splited
 *   [a1, b1]         - end is cutted
 *   [b2, a2]         - begin is cutted
 */
const intersectRanges = (rangeInclude, rangeExclude) => {
  if (rangeInclude === []) return []; // empty range
  if (rangeExclude === []) return rangeInclude; // nothing to exlude

  if (rangeInclude.length > 2) { 
    // Recursion is needed
    // Todo: Make a tail recursion or skip first 2 elements in rangeInclude and combine the result with normal flow
    const result = [];
    for (let i = 0; i < rangeInclude.length; i += 2)
      result.push(intersectRanges([rangeInclude[i], rangeInclude[i+1]], rangeExclude))
    return result; 
  }

  // We need range constrains in ASC order
  const [a1, a2] = rangeInclude.concat().sort((a, b) => a - b); 
  const [b1, b2] = rangeExclude.concat().sort((a, b) => a - b); 
  console.log('include: [%s, %s], exclude: [%s, %s]', a1, a2, b1, b2);

  if ((b1 <= a1) && (a2 <= b2)) return []; // fully excluded
  if ((a2 < b1) || (a1 > b2)) return [a1, a2]; // no intersection
  if ((a1 < b1) && (b2 < a2)) return [a1, b1, b2, a2] ; // splited
  if ((b1 <= a2) && (a2 <= b2)) return [a1, b1]; // end is cutted
  if ((b1 <= a1) && (a1 <= b2)) return [b2, a2]; // begin is cutted

  // WTF?
  console.error('intersectRanges() failed');
}



/**
 * RangeCollection class
 * NOTE: Feel free to add any extra member variables/functions you like.
 */
class RangeCollection {

  /**
   * Creates all internal props. 
   */
  constructor() {    
    this.rangesInclude = []; 
    this.rangesExclude = []; 

    this.rangesInclude  = [ [1, 5], [10, 20], [17, 21] ]; // Test
    this.rangesExclude = [ [13, 17] ]; // Test
  }

  /**
   * Returns current set of ranges as flat (single dimension) array
   */
  getFlatRanges () {
    const ranges = [];

    this.rangesInclude.forEach(rangeInclude => {
      let newRange = rangeInclude;
      for (let i = 0; i < this.rangesExclude.length; i++) {
        newRange = intersectRanges(newRange, this.rangesExclude[i]); // deduct every excluded range
      }
      if (newRange.length > 0)
      ranges.push(newRange); // rangeInclude without any excluded ranges
    });
    
    const result = ranges.reduce((acc, val) => acc.concat(val), []); // In new syntax Array.flat();
    console.log('getFlatRanges() : ', result);
    return result;

/*
    const result = this.rangesInclude.reduce((acc, val) => acc.concat(val), []); // In new syntax Array.flat();

    // return this.rangesInclude.flat();
    return this.rangesInclude.reduce((acc, val) => acc.concat(val), []);
*/    
  }

  /**
   * Adds a range to the collection
   * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
   */
  add(range) {
    // TODO: implement this
  }

  /**
   * Removes a range from the collection
   * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
   */
  remove(range) {
    // TODO: implement this
  }

  /**
   * Prints out the list of ranges in the range collection
   */
  print() {
    const flatRanges = this.getFlatRanges();
    let output = '';
    for (let i = 0; i < flatRanges.length; i += 2)
      output += `[${flatRanges[i]}, ${flatRanges[i+1]}) `; // "[a, b) "
    console.log(output);
  }
}

// Example run
const rc = new RangeCollection();

rc.add([1, 5]);
rc.print();
// Should display: [1, 5)

return;

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
