'use strict';

describe('Service: eightPuzzle', function () {

  // load the service's module
  beforeEach(module('ia8PuzzleApp'));

  // instantiate service
  var eightPuzzle;
  beforeEach(inject(function (_eightPuzzle_) {
    eightPuzzle = _eightPuzzle_;
  }));

  it('should do something', function () {
    expect(!!eightPuzzle).toBe(true);
  });

});
