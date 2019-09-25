export default class Puzzle {
    constructor(shape, pos, rotate, flip) {
        this.shape = shape
        this.pos = pos;
        this.rotate = rotate;
        this.flip = flip
        this.id = this.getId(shape)
        this.rotates(rotate);
        this.flips(flip)
    }

    getId(shape) {
        for (var i = 0; i < shape.length; i++) {
            for (var j = 0; j < shape[i].length; j++) {
                if (shape[i][j] != 0) {
                    return shape[i][j]
                }
            }
        }
    }

    // Shape harus NxN (persegi)
    rotates(rotate) {
        var shape = deepCopy(this.shape)
        var N = shape.length
        for (var x = 0; x < rotate; x++) {
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

        this.shape = shape
    }

    flips(flip) {
        var N = this.shape.length
        var shape = deepCopy(this.shape)
        if (flip === 1) {
            for (var i = 0; i < N; i++) {
                for (var j = 0; j < N; j++) {
                    shape[j][i] = this.shape[j][N - i - 1];
                }
            }
        }

        this.shape = shape
    }

    show() {
        console.log(this.shape)
    }

}