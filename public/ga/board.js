import Puzzle from "./puzzle.js"

export default class Board {
    constructor(height, width, template) {
        this.height = height
        this.width = width
        this.board = createArray(height, width)
        this.fitness = 0
        this.puzzles = []
        this.init(template)
    }

    init(template) {
        for (var i = 0; i < this.board.length; i++) {
            for (var j = 0; j < this.board[i].length; j++) {
                this.board[i][j] = 0
            }
        }

        if (template != undefined) {
            template.forEach((tmp, i) => {
                var puzzle = new Puzzle(tmp, { x: getRandomInt(0, this.height - 1), y: getRandomInt(0, this.width - 1) }, getRandomInt(0, 3), getRandomInt(0, 1))
                this.puzzles.push(puzzle)
                this.insert(puzzle)
            });
        }
    }

    insert(puzzle) {
        var newBoard = deepCopy(this.board)

        for (var i = 0; i < puzzle.shape.length; i++) {
            for (var j = 0; j < puzzle.shape[i].length; j++) {
                if (puzzle.shape[i][j] != 0) {
                    if (i + puzzle.pos.x - 1 < 0 || j + puzzle.pos.y - 1 < 0 || i + puzzle.pos.x - 1 >= this.height || j + puzzle.pos.y - 1 >= this.width) {
                        return false;
                    }
                    else if (newBoard[i + puzzle.pos.x - 1][j + puzzle.pos.y - 1] == 0) {
                        newBoard[i + puzzle.pos.x - 1][j + puzzle.pos.y - 1] = puzzle.shape[i][j]
                    }
                    else if (newBoard[i + puzzle.pos.x - 1][j + puzzle.pos.y - 1] != 0) {
                        return false;
                    }
                }
            }
        }
        this.board = newBoard
        this.calculateFitness()
        return true;
    }

    calculateFitness() {
        var fitness = 0
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                if (this.board[i][j] != 0) {
                    fitness++;
                }
            }
        }
        this.fitness = fitness
        return fitness
    }

    show() {
        console.log(this.board)
        console.log(this.fitness)
    }
}