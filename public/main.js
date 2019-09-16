import Board from "./board.js"
import Puzzle from "./puzzle.js"

var board = new Board(5, 5)
var puzzle = new Puzzle( 
    [
        [-1, -1, -1],
        [-1, 2, 2],
        [-1, 2, 2]
    ], 
    { x: 0, y: 0 },
    0, 1)

puzzle.show()
board.show()

if (board.insert(puzzle)) {
    board.show()
}

