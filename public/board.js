export default class Board {
    constructor(length, width) {
        this.length = length
        this.width = width
        this.board = createArray(length, width)
        this.fitness = 0;
        this.init()
    }

    init() {
        for (var i = 0; i < this.board.length; i++) {
            for (var j = 0; j < this.board[i].length; j++) {
                this.board[i][j] = -1;
            }
        }
    }

    insert(puzzle) {
        var newBoard = this.board
        for (var i = 0; i < puzzle.length; i++) {
            for (var j = 0; j < puzzle[i].length; j++) {
                if (newBoard[i + puzzle.pos.x][j + puzzle.pos.y] == -1) {
                    newBoard[i + puzzle.pos.x][j + puzzle.pos.y] = puzzle[i][j]
                } else if (newBoard[i + puzzle.pos.x][j + puzzle.pos.y] != -1 && puzzle[i][j] != -1) {
                    return false;
                }
            }
        }

        this.board = newBoard
        calculateFitness()
        return true;
    }

    calculateFitness() {
        var fitness = 0
        for (var i = 0; i < this.board.length; i++) {
            for (var j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] != -1) {
                    fitness++;
                }
            }
        }
        this.fitness = fitness
        return fitness
    }

    show () {
        console.log(this.board)
    }
}