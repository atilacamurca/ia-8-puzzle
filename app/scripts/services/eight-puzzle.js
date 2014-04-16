'use strict';

// https://gist.github.com/flatline/838202
angular.module('ia8PuzzleApp')
    .factory('EightPuzzle', function () {
        var goal = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];

        // save a reference to the core implementation
        var indexOfValue = _.indexOf;

        // using .mixin allows both wrapped and unwrapped calls:
        // _(array).indexOf(...) and _.indexOf(array, ...)
        _.mixin({
            // return the index of the first array element passing a test
            indexOf: function (array, test) {
                // delegate to standard indexOf if the test isn't a function
                if (!_.isFunction(test)) return indexOfValue(array, test);
                // otherwise, look for the index
                for (var x = 0; x < array.length; x++) {
                    if (test(array[x])) return x;
                }
                // not found, return fail value
                return -1;
            }
        });

        // construtor
        function EightPuzzle() {
            // valor da heuristica
            this.hval = 0;
            // profudindade da busca
            this.depth = 0;
            // nó pai do caminho
            this.parent = null;
            // tabuleiro
            this.matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];
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
                var openset = [this];
                var closedset = [];
                var move_count = 0;
                var limit = 0;

                while (openset.length > 0 && limit < 1000) {
                    var obj = openset.shift();
                    move_count++;

                    // se tiver resolvido, retorna
                    if (EightPuzzle.isSolved(obj)) {
                        console.log("resolved with %d moves ...", move_count);
                        return obj.generateSolutionPath([]);
                    } else {
                        console.log("not resolved yet...");
                        //console.log(obj.toString());
                    }

                    var successors = obj.generateMoves();
                    //EightPuzzle.showMoves(successors);
                    
                    var idx_open = -1;
                    var idx_closed = -1;
                    for (var i = 0; i < successors.length; i++) {
                        var move = successors[i];
                        // have we already seen this node?
                        idx_open = _.indexOf(openset, function (obj) { return EightPuzzle.equals(obj.matrix, move.matrix); });
                        idx_closed = _.indexOf(closedset, function (obj) { return EightPuzzle.equals(obj.matrix, move.matrix); });
                        var hval = EightPuzzle.manhattanDistance(move);
                        var fval = hval + move.depth;
                        
                        if (idx_closed === -1 && idx_open === -1) {
                            move.hval = hval;
                            openset.push(move);
                        } else if (idx_open > -1) {
                            var copy = openset[idx_open];
                            if (fval < copy.hval + copy.depth) {
                                // copia os valores do movimento para a cópia
                                copy.hval = hval;
                                copy.parent = move.parent;
                                copy.depth = move.depth;
                            }
                        } else if (idx_closed > -1) {
                            var copy = closedset[idx_closed];
                            if (fval < copy.hval + copy.depth) {
                                move.hval = hval;
                                closedset.splice(idx_closed, 1);
                                openset.push(move);
                            }
                        }
                    }
                    
                    closedset.push(obj);
                    openset = _.sortBy(openset, function (obj) {
                        return obj.hval + obj.depth;
                    });
                    limit++;
                }
                
                // retorna null em caso de falha
                return null;
            },
            /**
             * Encontra a linha e a coluna do elemento 0.
             * retorna {row: i, col: j}
             */
            findEmpty: function () {
                for (var i = 0; i < this.matrix.length; i++) {
                    for (var j = 0; j < this.matrix.length; j++) {
                        if (this.matrix[i][j] === 0) {
                            return {
                                row: i,
                                col: j
                            };
                        }
                    }
                }
                return null;
            },
            getLegalMoves: function (empty) {
                empty = empty || this.findEmpty();
                var free = [];
                if (empty.row > 0) {
                    free.push({
                        row: empty.row - 1,
                        col: empty.col
                    });
                }
                if (empty.col > 0) {
                    free.push({
                        row: empty.row,
                        col: empty.col - 1
                    });
                }
                if (empty.row < 2) {
                    free.push({
                        row: empty.row + 1,
                        col: empty.col
                    })
                }
                if (empty.col < 2) {
                    free.push({
                        row: empty.row,
                        col: empty.col + 1
                    });
                }

                return free;
            },
            swap: function (from, to) {
                var aux = this.matrix[from.row][from.col];
                this.matrix[from.row][from.col] = this.matrix[to.row][to.col];
                this.matrix[to.row][to.col] = aux;
            },
            clone: function () {
                // return JSON.parse(JSON.stringify(this));
                // realiza cópia completa do objeto.
                var _8puzzle = new EightPuzzle();
                var len = this.matrix.length;
                for (var i = 0; i < len; i++) {
                    for (var j = 0; j < len; j++) {
                        _8puzzle.matrix[i][j] = this.matrix[i][j];
                    }
                }
                return _8puzzle;
            },
            generateMoves: function () {
                var empty = this.findEmpty();
                var free = this.getLegalMoves(empty);

                var moves = [];
                for (var i = 0; i < free.length; i++) {
                    moves.push(this.swapAndClone(empty, free[i]));
                }
                return moves;
            },
            swapAndClone: function(from, to) {
                    var clone = this.clone();
                    clone.swap(from, to);
                    clone.depth = this.depth + 1;
                    clone.parent = this;
                    return clone;
            },
            generateSolutionPath: function (path) {
                if (this.parent === null) {
                    return path;
                } else {
                    path.push(this);
                    return this.parent.generateSolutionPath(path);
                }
            },
            toString: function () {
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

        // static methods
        
        EightPuzzle.isSolved = function (_8puzzle) {
            return EightPuzzle.equals(_8puzzle.matrix, goal);
        };
        
        EightPuzzle.equals = function (matrixA, matrixB) {
            var len = matrixA.length;
            var expected = len * len;
            var eq_values = 0;
            for (var i = 0; i < len; i++) {
                for (var j = 0; j < len; j++) {
                    if (matrixA[i][j] === matrixB[i][j]) {
                        eq_values++;
                    }
                }
            }
            //console.log("expected: %d, eq_values: %d", expected, eq_values);
            return expected === eq_values;
        };
        
        EightPuzzle.manhattanDistance = function (_8puzzle) {
            var result = 0;
            var len = _8puzzle.matrix.length;
            for (var i = 0; i < len; i++) {
                for (var j = 0; j < len; j++) {
                    var value = _8puzzle.matrix[i][j] - 1;
                    var target_col = value % 3;
                    var target_row = Math.floor(value / 3);

                    // tratar 0 (zero) como casa em branco na linha 2
                    if (target_row < 0) {
                        target_row = 2;
                    }

                    result += Math.abs(target_row - i) + Math.abs(target_col - j);
                }
            }
            return result;
        };

        EightPuzzle.showMoves = function (moves) {
            var len = moves.length;
            for (var i = 0; i < len; i++) {
                console.log(moves[i].toString());
            }
        };

        return (EightPuzzle);
    });