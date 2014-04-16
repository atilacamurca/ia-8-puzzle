'use strict';

angular.module('ia8PuzzleApp')
    .controller('MainCtrl', function ($scope, EightPuzzle, $timeout) {
        var _8puzzle = new EightPuzzle();
        
        $scope.shuffle = function () {
            _8puzzle.shuffle();
            $scope.setTiles(_8puzzle.matrix);
            $("#fry-woo").hide();
            $("#fry-horror").hide();
            $("#steps").html("Steps: x0");
        };
        
        $scope.solve = function () {
            var solution = _8puzzle.solve();
            if (solution == null) {
                $("#fry-horror").slideDown();
                return;
            }
            
            var i = solution.length - 1;
            var step = 0;
            (function print(solution, i) {
                if (i > 0) {
                    //console.log(i);
                    $timeout(function () {
                        $scope.setTiles(solution[i].matrix);
                        $("#steps").html("Steps: x" + step);
                        print(solution, i);
                    }, 1000);
                } else {
                    $("#fry-woo").slideDown();
                }
                i--;
                step++;
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