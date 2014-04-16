'use strict';

angular.module('ia8PuzzleApp')
    .controller('MainCtrl', function ($scope, EightPuzzle, $timeout) {
        var _8puzzle = new EightPuzzle();
        
        $scope.shuffle = function () {
            _8puzzle.shuffle();
            $scope.setTiles(_8puzzle.matrix);
            $("#fry").hide();
        };
        
        $scope.solve = function () {
            /*var solution = _8puzzle.solve();
            for (var i = solution.length - 1; i >= 0; i--) {
                console.log(solution[i]);
                (function (matrix) {
                    $timeout(function() {
                        $scope.setTiles(matrix);
                    }, 5000);
                })(solution[i].matrix);
            }*/
            
            var solution = _8puzzle.solve();
            var i = solution.length - 1;
            (function print(solution, i) {
                if (i > 0) {
                    console.log(i);
                    $timeout(function () {
                        $scope.setTiles(solution[i].matrix);
                        print(solution, i);
                    }, 1000);
                } else {
                    $("#fry").slideDown();
                }
                i--;
            })(solution, i);
        };
        
        $scope.setTiles = function (matrix) {
            var len = matrix.length;
            for (var i = 0; i < len; i++) {
                for (var j = 0; j < len; j++) {
                    var value = matrix[i][j];
                    if (value === 0) value = "";
                    $("#pc-" + i + "-" + j).html(value);
                }
            }
        };
    });