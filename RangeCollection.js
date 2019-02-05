// Task: Implement a 'Range Collection' class.
// A pair of integers define a range, for example: [1, 5). This range includes integers: 1, 2, 3, and 4.
// A range collection is an aggregate of these ranges: [1, 5), [10, 11), [100, 201)

// import { rangeMerge, rangeCut, rangeSplit } from './utils';
const utils = require('./utils');

const OPERATION_ADD     = 1; 
const OPERATION_REMOVE  = 2; 

const ACTION_NONE       = 0; 
const ACTION_ADD        = 1; 
const ACTION_INSIDE     = 2; 
const ACTION_MERGE      = 3; 
const ACTION_DELETE     = 4; 
const ACTION_CUT        = 5; 
const ACTION_SPLIT      = 6; 

/**
 * RangeCollection class
 * Second variant of Range Collection with single array as a storage
 */
class RangeCollection {
  /**
   * Creates internal properties
   */
  constructor() {
    this.ranges = [];
  }

  /**
   * Returns the "adding action" depending on disposition of given Ranges
   * @param {Array<number>} a - Range A as array of 2 numbers, a[0] <= a[1]
   * @param {Array<number>} b - Range B as array of 2 numbers, b[0] <= b[1]
   * @returns {number} - One of ACTION_NONE, ACTION_ADD, ACTION_INSIDE, ACTION_MERGE
   */
   getActionAdd(a, b) {
    // Range B after A
    if (a[1] < b[0]) return ACTION_ADD;
 
    // Range B before A. Skip now, we will compare it later
    if (b[1] < a[0]) return ACTION_NONE;
  
    // Range A inside B
    if (b[0] <= a[0] && a[1] <= b[1]) return ACTION_INSIDE;

    // Partialy overlap
    return ACTION_MERGE;
 }

  /**
   * Returns the "removing action" depending on disposition of given Ranges
   * @param {Array<number>} a - Range A as array of 2 numbers, a[0] <= a[1]
   * @param {Array<number>} b - Range B as array of 2 numbers, b[0] <= b[1]
   * @returns {number} - One of ACTION_NONE, ACTION_DELETE, ACTION_CUT, ACTION_SPLIT 
   */
  getActionRemove(a, b) {
    // Range A inside B
    if (b[0] < a[0] && a[1] < b[1]) return ACTION_SPLIT;

    // Range B inside A
    if (a[0] <= b[0] && b[1] <= a[1]) return ACTION_DELETE;
  
    // Cut at End
    if (a[0] <= b[0] && a[1] <= b[1]) return ACTION_CUT;
  
    // Cut at Begin
    if (b[0] <= a[0] && a[0] <= b[1] && b[1] <= a[1]) return ACTION_CUT;
  
    // Not overlaped
    return ACTION_NONE;
  }

  /**
   * Mutates the internal 'this.ranges' array by perforing specific Operation with given Range. 
   * @param {number} operation - One of OPERATION_ADD, OPERATION_REMOVE
   * @param {Array<number>} range - Range as array of 2 numbers, range[0] <= range[1]
   */
  mutateRanges(operation, range) {
    let result = [];
    let finish = false; // Used in reduce functions

    const _reduceOnAdd = (acc, value, index, arr) => {
      if (finish) return [...acc, value];
      //if (!Array.isArray(acc)) acc = [acc]; // fix to use ...acc in spreads
      let a = range;
      let b = value;
      //console.log('switch',this.getActionAdd(a, b), a, b);
      switch (this.getActionAdd(a, b)) {
        case ACTION_NONE: {
          if (index === arr.length - 1) {
            // We reach the last element
            finish = true;
            return [...acc, b, a]; // Add range A to the end
          }
          return [...acc, b]; // Just add B and follow to the next element
        }
        case ACTION_ADD: {
          finish = true;
          return [...acc, a, b]; // Add both ranges
        }
        case ACTION_INSIDE: {
          finish = true;
          return [...acc, b]; // Range A inside B, add only B
        }
        case ACTION_MERGE: {
          finish = true;
          return [...acc, utils.rangeMerge(a, b)] // Add merged ranges
        }
        /* default: {
          // Todo: Do we need this?
          console.warn('_reduceOnAdd() default case')
          finish = true;
          return [...acc, b];
        } */
      } 
    } // _reduceOnAdd()

    const _reduceOnRemove = (acc, value, index, arr) => {
      if (finish) return [...acc, value];
      //if (!Array.isArray(acc)) acc = [acc]; // fix to use ...acc in spreads
      let a = range;
      let b = value;
      //console.log('switch',this.getActionRemove(a, b), a, b);
      switch (this.getActionRemove(a, b)) {
        case ACTION_NONE: {
          return [...acc, b]; // Just add B and follow to the next element
        }
        case ACTION_DELETE: {
          return acc;
        }
        case ACTION_CUT: {
          return [...acc, utils.rangeCut(a, b)];
        }
        case ACTION_SPLIT: {
          return [...acc, ...utils.rangeSplit(a, b)]; // Note: spread for rangeSplit() is a must
        }
        /* default: {
          // Todo: Do we need this?
          console.warn('_reduceOnRemove() default case')
          finish = true;
          return [...acc, b];
        } */
      } 
    } // _reduceOnRemove()

    // Reduce Ranges array depending on Operation
    if (operation === OPERATION_ADD)
      result = this.ranges.reduce(_reduceOnAdd, []);
    else
      result = this.ranges.reduce(_reduceOnRemove, []);
  
    return result;
  } // mutateRanges()

  /**
   * Adds a range to the collection
   * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
   */
  add(range) {
    let a = range;
    if (a[1] < a[0]) a.reverse();

    if (this.ranges.length < 1)
      this.ranges.push(a); // There are no other ranges, just add new one
    else
      this.ranges = this.mutateRanges(OPERATION_ADD, a);

    return this.ranges; // Could be useful
  }

  /**
   * Removes a range from the collection
   * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
   */
  remove(range) {
    let a = range;
    if (a[1] < a[0]) a.reverse();

    this.ranges = this.mutateRanges(OPERATION_REMOVE, a);
    return this.ranges; // Could be useful
  }

  /**
   * Prints out the list of ranges in the range collection
   */
  print() {
    let output = '';
    output = this.ranges.map(a => `[${a[0]}, ${a[1]})`).join(' ').trim();
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

  rc.add([10, 20]);
  rc.print();
  // Should display: [1, 3) [10, 21)

  rc.add([0, 100]);
  rc.print();
  // Should display: [0, 100);

}
runExample();


//export { RangeCollection };
module.exports = RangeCollection;
