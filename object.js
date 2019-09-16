const obj = class {
    constructor(pos, rotate, shape) {
        this.pos = pos;
        this.rotate = rotate;
        // this.shape = rotate(shape, rotate);
        this.shape = shape;
    }

    rotate(shape, rotate) {
        var newShape = new Array(shape.length)
        createArray(3, 3);
        while (rotate--) {
            for (var i = 0; i < shape.length; i++) {
                for (var j = 0; j < shape[i].length; j++) {
                    newShape[j][i] = shape[i][j]
                }
            }
        }
        return newShape;
    }

}

export default obj