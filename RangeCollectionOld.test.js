const RangeCollection = require('./RangeCollectionOld');
// import { RangeCollection } from './RangeCollectionOld';

describe('RangeCollection Tests', () => {
	const rc = new RangeCollection();

	it('adds range [1, 5]', () => {
		rc.add([1, 5]);
		//expect(rc.rangesInclude).toEqual([[1, 5]]);
		expect( rc.print() ).toEqual('[1, 5)');
	})

	it('adds range [10, 20]', () => {
		rc.add([10, 20]);
		//expect(rc.rangesInclude).toEqual([[1, 5], [10, 20]])
		expect( rc.print() ).toEqual('[1, 5) [10, 20)');
	})

	it('adds range [20, 20]', () => {
		rc.add([20, 20]);
		//expect(rc.rangesInclude).toEqual([1, 5], [10, 20], [20, 20])
		expect( rc.print() ).toEqual('[1, 5) [10, 20)');
	})

		it('adds range [20, 21]', () => {
		rc.add([20, 21]);
		expect( rc.print() ).toEqual('[1, 5) [10, 21)');
	})

	it('adds range [2, 4]', () => {
		rc.add([2, 4]);
		expect( rc.print() ).toEqual('[1, 5) [10, 21)');
	})

	it('adds range [3, 8]', () => {
		rc.add([3, 8]);
		expect( rc.print() ).toEqual('[1, 8) [10, 21)');
	})

	it('removes range [10, 10]', () => {
		rc.remove([10, 10]);
		expect( rc.print() ).toEqual('[1, 8) [10, 21)');
	})

	it('removes range [10, 11]', () => {
		rc.remove([10, 11]);
		expect( rc.print() ).toEqual('[1, 8) [11, 21)');
	})

	it('removes range [15, 17]', () => {
		rc.remove([15, 17]);
		expect( rc.print() ).toEqual('[1, 8) [11, 15) [17, 21)');
	})

	it('removes range [3, 19]', () => {
		rc.remove([3, 19]);
		expect( rc.print() ).toEqual('[1, 3) [19, 21)');
	})

	it('removes everything using huge range [0, 100]', () => {
		rc.remove([0, 100]);
		expect( rc.print() ).toEqual('');
	})

	it('adds some huge range [0, 9999]', () => {
		rc.add([0, 9999]);
		expect( rc.print() ).toEqual('[0, 9999)');
	})


},
)