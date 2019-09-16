const obj = class {
    constructor(length, width) {
        this.length = length
        this.width = width
        this.board = createArray(length, width)
        init()
    }

    init () {
        for (var i = 0; i < this.board.length; i++) {
            for (var j = 0; j < this.board[i].length; j++) {
                this.board[i][j] = -1;
            }
        }
    }

    insert (shape) {
        
    }
}

export default obj;