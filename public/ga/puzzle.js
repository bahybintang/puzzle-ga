export default class Puzzle {
    // Constructor
    constructor(shape, pos, rotate, flip) {
        this.shape = shape
        this.pos = pos;
        this.rotate = rotate;
        this.flip = flip
        this.id = this.getId(shape)
    }

    // Get id of shape
    getId(shape) {
        for (var i = 0; i < shape.length; i++) {
            for (var j = 0; j < shape[i].length; j++) {
                if (shape[i][j] != 0) {
                    return shape[i][j]
                }
            }
        }
    }

    // Shape must be NxN
    // rotate the puzzles
    rotates() {
        var shape = deepCopy(this.shape)
        var N = shape.length
        for (var x = 0; x < this.rotate; x++) {
            for (var i = 0; i < Math.floor(N / 2); i++) {
                for (var j = 0; j < N - i - 1; j++) {
                    var temp = shape[i][j];
                    shape[i][j] = shape[N - 1 - j][i];
                    shape[N - 1 - j][i] = shape[N - 1 - i][N - 1 - j]
                    shape[N - 1 - i][N - 1 - j] = shape[j][N - 1 - i]
                    shape[j][N - 1 - i] = temp
                }
            }
        }

        return shape
    }

    // Flip the puzzle
    flips(input) {
        var N = input.length
        var shape = deepCopy(input)
        if (this.flip === 1) {
            for (var i = 0; i < N; i++) {
                for (var j = 0; j < N; j++) {
                    shape[j][i] = this.shape[j][N - i - 1];
                }
            }
        }

        return shape
    }

    // Get shape of puzzle after flip and rotate
    getShape() {
        return this.flips(this.rotates())
    }

    // Show shape in console
    show() {
        console.log(this.shape)
    }

}