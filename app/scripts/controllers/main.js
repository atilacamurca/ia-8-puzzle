'use strict';

angular.module('ia8PuzzleApp')
    .controller('MainCtrl', function ($scope, EightPuzzle) {
        var _8puzzle = new EightPuzzle();
        
        _8puzzle.shuffle();
        console.log(_8puzzle.toString());
        console.log(_8puzzle.solve());
    });