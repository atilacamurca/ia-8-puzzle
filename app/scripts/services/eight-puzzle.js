'use strict';

// https://gist.github.com/flatline/838202
angular.module('ia8PuzzleApp')
    .factory('EightPuzzle', function () {

        // construtor
        function EightPuzzle() {
            // valor da heuristica
            this.hval = 0;
            // profudindade da busca
            this.depth = 0;
            // nó pai do caminho
            this.parent = null;
            // tabuleiro
            this.matrix = this.goal = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];
        }

        // metodos
        EightPuzzle.prototype = {
            shuffle: function (step_count) {
                step_count = step_count || 20;
                for (var i = 0; i < step_count; i++) {
                    var empty = this.findEmpty();
                    var free = this.getLegalMoves(empty);
                    var rand = Math.floor((Math.random() * free.length));
                    var choice = free[rand];
                    this.swap(empty, choice);
                    empty = choice;
                }
            },
            solve: function (heuristic) {
                
            },
            /**
             * Encontra a linha e a coluna do elemento 0.
             * retorna {row: i, col: j}
             */
            findEmpty: function () {
                for (var i = 0; i < this.matrix.length; i++) {
                    for (var j = 0; j < this.matrix.length; j++) {
                        if (this.matrix[i][j] === 0) {
                            return {row: i, col: j};
                        }
                    }
                }
                return null;
            },
            getLegalMoves: function (empty) {
                empty = empty || this.findEmpty();
                var free  = [];
                if (empty.row > 0) {
                    free.push({row: empty.row - 1, col: empty.col});
                }
                if (empty.col > 0) {
                    free.push({row: empty.row, col: empty.col - 1});
                }
                if (empty.row < 2) {
                    free.push({row: empty.row + 1, col: empty.col})
                }
                if (empty.col < 2) {
                    free.push({row: empty.row, col: empty.col + 1});
                }
                
                return free;
            },
            swap: function (from, to) {
                var aux = this.matrix[from.row][from.col];
                this.matrix[from.row][from.col] = this.matrix[to.row][to.col];
                this.matrix[to.row][to.col] = aux;
            },
            toString: function() {
                var res = '';
                for (var i = 0; i < this.matrix.length; i++) {
                    res += '|';
                    res += this.matrix[i].join('|');
                    res += '|\n';
                }
                //res += '\n';
                return res;
            }
        };

        return (EightPuzzle);
    });