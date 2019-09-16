const obj = class {
    constructor(length, width) {
        this.length = length
        this.width = width
        this.board = createArray(length, width)
        this.fitness = 0;
        init()
    }

    init() {
        for (var i = 0; i < this.board.length; i++) {
            for (var j = 0; j < this.board[i].length; j++) {
                this.board[i][j] = -1;
            }
        }
    }

    insert(shape) {
        var newBoard = this.board
        for (var i = 0; i < shape.length; i++) {
            for (var j = 0; j < shape[i].length; j++) {
                if (newBoard[i + shape.pos.x][j + shape.pos.y] == -1) {
                    newBoard[i + shape.pos.x][j + shape.pos.y] = shape[i][j]
                } else if (newBoard[i + shape.pos.x][j + shape.pos.y] != -1 && shape[i][j] != -1) {
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
}

export default obj;