# Range Collection
This is a "test task" for position of Web developer.

## Task
Implement a 'Range Collection' class.
A pair of integers define a range, for example: [1, 5). This range includes integers: 1, 2, 3, and 4.
A range collection is an aggregate of these ranges: [1, 5), [10, 11), [100, 201)

## Implementaion notes

I wrote code in Node.JS compatible syntax (require instead of import, and so on). There are 2 versions of 'Range Collection' class:

#### RangeCollectionOld.js
It was a first version with array storages for Include and Exclude ranges separately. There is *getFlatRanges()* method to build current Ranges state on a request.

#### RangeCollection.js
Second version of class with single array that represent current Ranges state as is. Adding or removing of any range changes the state instantly.

## How to run?

Use **npm start** or **npm run start** to execute *RangeCollection.js* version 

Use **npm run start2** to execute *RangeCollectionOld.js* version 


## Tests
I've added *jest* to requered packages and write some test. 

Use **npm run test** script to execute all tests.
