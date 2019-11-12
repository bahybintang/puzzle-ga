import Puzzle from "./puzzle.js"

export default class Board {
    // Constructor
    constructor(height, width, template, isChild) {
        this.height = height
        this.width = width
        this.board = createArray(height, width)
        this.fitness = 0
        this.puzzles = []
        this.emptyCell = []
        if (isChild == undefined) this.init(template)
        else this.initChild(template)
    }

    // Init for "real" new board
    init(template) {
        // Init board with 0 (not filled)
        for (var i = 0; i < this.board.length; i++) {
            for (var j = 0; j < this.board[i].length; j++) {
                this.board[i][j] = 0
            }
        }

        // Shuffle the template so every new Board is
        // different
        var temp = deepCopy(template)
        temp = shuffle(temp)

        // Make new puzzle from template, this also
        // generate random position, rotation, and flip
        if (template != undefined) {
            temp.forEach((tmp, i) => {
                var puzzle = new Puzzle(tmp, { x: getRandomInt(0, this.height - 1), y: getRandomInt(0, this.width - 1) }, getRandomInt(0, 3), getRandomInt(0, 1))
                this.puzzles.push(puzzle)
                this.insert(puzzle)
            });
        }
        this.calculateFitness()
    }

    // Init board with premade puzzles
    initChild(puzzles) {
        for (var i = 0; i < this.board.length; i++) {
            for (var j = 0; j < this.board[i].length; j++) {
                this.board[i][j] = 0
            }
        }

        // Insert to board
        if (puzzles != undefined) {
            puzzles.forEach(puzzle => {
                this.puzzles.push(puzzle)
                this.insert(puzzle)
            })
        }
        this.calculateFitness()
    }

    // Insert puzzles to board
    insert(puzzle) {
        var newBoard = deepCopy(this.board)

        for (var i = 0; i < puzzle.getShape().length; i++) {
            for (var j = 0; j < puzzle.getShape()[i].length; j++) {
                if (puzzle.getShape()[i][j] != 0) {
                    if (i + puzzle.pos.x - 1 < 0 || j + puzzle.pos.y - 1 < 0 || i + puzzle.pos.x - 1 >= this.height || j + puzzle.pos.y - 1 >= this.width) {
                        return false;
                    }
                    else if (newBoard[i + puzzle.pos.x - 1][j + puzzle.pos.y - 1] == 0) {
                        newBoard[i + puzzle.pos.x - 1][j + puzzle.pos.y - 1] = puzzle.getShape()[i][j]
                    }
                    else if (newBoard[i + puzzle.pos.x - 1][j + puzzle.pos.y - 1] != 0) {
                        return false;
                    }
                }
            }
        }
        this.board = newBoard
        return true;
    }

    // Calculate fitness of the board
    // fitness is how much filled block
    // on board
    calculateFitness() {
        var fitness = 0
        var tmp = []
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                if (this.board[i][j] != 0) {

                    fitness++;
                }
                else {
                    tmp.push({
                        x: i,
                        y: j
                    })
                }
            }
        }
        this.emptyCell = tmp
        this.fitness = fitness
        return fitness
    }

    // Show board to web page
    showBoard() {
        var htmlBoard = document.getElementById('board')
        var randomColor = JSON.parse(localStorage.getItem("randomColor"))

        var innerHTMLs = ""

        innerHTMLs += `<table class="center" width='${Math.floor((this.width / this.height) * 550)}' height='550'>`
        for (var i = 0; i < this.height; i++) {
            innerHTMLs += "<tr>"
            for (var j = 0; j < this.width; j++) {
                if (this.board[i][j] != 0) {
                    innerHTMLs += `<td bgcolor='${randomColor[this.board[i][j]]}'></td>`
                }
                else {
                    innerHTMLs += "<td bgcolor='#EFF0F1'></td>"
                }
            }
            innerHTMLs += "</tr>"
        }
        innerHTMLs += "</table>"
        htmlBoard.innerHTML = innerHTMLs
    }

    // Show fitness to web page
    showFitness() {
        var fitnessHTML = document.getElementById("fitness")
        var innerHTMLs = `<h2> Fitness: ${this.fitness} </h2>`
        fitnessHTML.innerHTML = innerHTMLs
    }

    // Mutation based on mutation rate
    mutate(mutation_rate) {
        const mod = (x, n) => (x % n + n) % n
        for (var i = 0; i < this.puzzles.length; i++) {
            if (Math.random() < mutation_rate) {
                // Mutate the rotation by +90 degree or -90 degree
                if (Math.random() > 0.5) {
                    var plus = Math.random() > 0.5 ? 1 : -1
                    this.puzzles[i].rotate = mod(this.puzzles[i].rotate + plus, 4)
                }

                // Mutate the x location by moving +1 or -1
                if (Math.random() > 0.5) {
                    var plus = Math.random() > 0.5 ? 1 : -1
                    this.puzzles[i].pos.x = mod(this.puzzles[i].pos.x + plus, this.height)
                }
                
                // Mutate the y location by moving +1 or -1
                if (Math.random() > 0.5) {
                    var plus = Math.random() > 0.5 ? 1 : -1
                    this.puzzles[i].pos.y = mod(this.puzzles[i].pos.y + plus, this.width)
                }

                // Mutate the permutation, swap the position of
                // two random puzzles
                if (Math.random() > 0.5) {
                    var idxEmpty = getRandomInt(0, this.emptyCell.length - 1)
                    var idxPuzzle = getRandomInt(0, this.puzzles.length - 1)
                    this.puzzles[idxPuzzle].pos = { ...this.emptyCell[idxEmpty] }
                }

                // Mutate the flip
                this.puzzles[i].flip = getRandomInt(0, 1)
            }
        }

        // Swap the position of two puzzles p1 and p2
        // p1 index between 0 - (puzzles.length - 1) / 2
        // p2 index between between (puzzle.length - 1) / 2 + 1
        // and puzzles.length - 1
        var idx = getRandomInt(0, Math.floor((this.puzzles.length - 1) / 2))
        var idx2 = getRandomInt(Math.floor((this.puzzles.length - 1) / 2) + 1, this.puzzles.length - 1)
        var temp = this.puzzles[idx]
        this.puzzles[idx2].pos = { ...temp.pos }
        this.puzzles[idx] = this.puzzles[idx2];
        this.puzzles[idx2] = temp

        // Re insert and calculate fitness
        this.mutateReInit()
    }

    // Re insert and calculate fitness after mutation
    mutateReInit() {
        for (var i = 0; i < this.board.length; i++) {
            for (var j = 0; j < this.board[i].length; j++) {
                this.board[i][j] = 0
            }
        }

        // Insert to board
        if (this.puzzles != undefined) {
            this.puzzles.forEach(puzzle => {
                this.insert(puzzle)
            })
        }
        this.calculateFitness()
    }

    // Get puzzle by ID
    getById(id) {
        for (var i of this.puzzles) {
            if (i.id == id) return i
        }
    }

    // Show fitness and board to web page
    show() {
        console.log(this.puzzles)
        console.log(this.board)
        console.log("fitness: " + this.fitness)

        this.showFitness()
        this.showBoard()
    }
}