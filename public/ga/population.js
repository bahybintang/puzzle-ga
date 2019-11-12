// import Puzzle from "./puzzle.js";
import Board from "./board.js";
import Template from "./template.js"
import Puzzle from "./puzzle.js";
export default class Population {
    // Constructor
    constructor(population_size, cromosome_size, mutation_rate, board_x, board_y) {
        this.mutation_rate = mutation_rate
        this.size = population_size
        this.cromosome_size = cromosome_size
        this.boards = []
        this.boardsize = {
            x: board_x,
            y: board_y
        }
        this.init()
    }

    // Generate initial puzzle and push make new board then push to population
    init() {
        var template = Template.generateTemplate(this.cromosome_size)

        for (var i = 0; i < this.size; i++) {
            this.boards.push(new Board(this.boardsize.x, this.boardsize.y, template))
        }
    }

    // Get best board in current generation
    getBestBoard() {
        // Sort board for picking best board, and sort
        // for next generation
        this.boards.sort((a, b) => { return b.fitness - a.fitness })

        // If best board number 0 fitness is the same as
        // best board number 1, we choose best board 1
        // to get better visualization
        if (this.boards[1].fitness == this.boards[0].fitness) return this.boards[1]
        else return this.boards[0]
    }

    // Show best board
    showBestBoard() {
        var bestBoard = this.getBestBoard()
        bestBoard.showBoard()
        bestBoard.showFitness()
    }

    crossover() {
        var size = this.size

        // Generate cumulative probability
        var totalFitness = 0
        this.boards.forEach(item => {
            totalFitness += item.fitness
        })

        var cumprob = []
        for (var i = 0; i < size; i++) {
            if (i == 0) {
                cumprob.push(this.boards[i].fitness / totalFitness)
            }
            else {
                cumprob.push(this.boards[i].fitness / totalFitness + cumprob[i - 1])
            }
        }

        // Initialize new population
        var newPop = []

        // Get 10% best board based on fitness
        for (var i = 0; i < Math.floor(0.1 * size); i++) {
            var tmp = this.boards[i]

            // Mutation for the "good" board
            if (1 - Math.random() < this.mutation_rate && i > 0) {
                tmp.mutate(this.mutation_rate)
            }
            newPop[i] = tmp
        }

        // Get 80% of new population from crossover
        for (var x = 0; x < Math.floor(0.8 * size); x++) {
            // Get random cumprob for 2 parents
            var p1 = 1 - Math.random(), found1 = false
            var p2 = 1 - Math.random(), found2 = false

            // Roulette wheel choose parents
            for (var i = 0; i < size; i++) {
                if (cumprob[i] >= p1 && !found1) {
                    p1 = this.boards[i]
                    found1 = true
                }
                if (cumprob[i] >= p2 && !found2) {
                    p2 = this.boards[i]
                    found2 = true
                }
                if (found1 && found2) break;
            }

            // Get pivot for two point permutation crossover
            var pivot1 = Math.floor(getRandomInt(0, this.cromosome_size - 2))
            var pivot2 = Math.floor(getRandomInt(pivot1 + 1, this.cromosome_size - 1))

            // Initialize new child
            var child = []

            // SECTION
            // [ first | second | third ]
            // <-- 80% cromosome size -->


            // Get second section from parent 2
            for (var i = pivot1; i < pivot2; i++) {
                child[i] = this.crossGen(this.copyPuzzle(p2.puzzles[i]), p1, p2)
            }

            // Get third section from parent 1
            var i = pivot2
            for (var j = pivot2; j < this.cromosome_size; j++) {
                if (i >= this.cromosome_size) {
                    break;
                }
                // Push to child if not in child
                if (!this.isIn(p1.puzzles[j].id, child)) {
                    child[i] = this.crossGen(this.copyPuzzle(p1.puzzles[j]), p1, p2)
                    i++;
                }
            }

            // Get first section from the rest of parent 1 and 2
            for (var j = 0; j < pivot2; j++) {
                if (i >= this.cromosome_size) {
                    break;
                }
                // Push to child if not in child
                if (!this.isIn(p1.puzzles[j].id, child)) {
                    child[i] = this.crossGen(this.copyPuzzle(p1.puzzles[j]), p1, p2)
                    i++;
                }
            }

            i = 0
            for (var j = pivot2; j < this.cromosome_size; j++) {
                if (i >= pivot1) {
                    break;
                }
                // Push to child if not in child
                if (!this.isIn(p1.puzzles[j].id, child)) {
                    child[i] = this.crossGen(this.copyPuzzle(p1.puzzles[j]), p1, p2)
                    i++;
                }
            }

            for (var j = 0; j < pivot2; j++) {
                if (i >= pivot1) {
                    break;
                }
                if (!this.isIn(p1.puzzles[j].id, child)) {
                    child[i] = this.crossGen(this.copyPuzzle(p1.puzzles[j]), p1, p2)
                    i++;
                }
            }
            
            // Generate new Board from child
            var newBoard = new Board(this.boardsize.x, this.boardsize.y, child, true)

            // Mutate the new board
            if (1 - Math.random() <= this.mutation_rate) {
                newBoard.mutate(this.mutation_rate)
            }

            // Push the newBoard to newPop
            newPop.push(newBoard)
        }

        // Push 10% worst board to newPop
        for (var j = size - 1; j >= Math.floor(0.9 * size); j--) {
            var tmp = this.boards[j]
            // Mutate the board
            if (1 - Math.random() <= this.mutation_rate) {
                tmp.mutate(this.mutation_rate)
            }
            newPop.push(tmp)
        }

        // Set popuation to new population
        this.boards = newPop
    }

    // Cross puzzle from parent 1 and 2
    crossGen(puzz, p1, p2) {
        var puzz1 = this.copyPuzzle(p1.getById(puzz.id))
        var puzz2 = this.copyPuzzle(p2.getById(puzz.id))
        var child = this.copyPuzzle(puzz)
        var totFit = p1.fitness + p2.fitness
        var keys = Object.keys(puzz1)

        // Cross the property of puzzle based parents fitness
        for (var key of keys) {
            var yesOrNo = Math.random() <= p1.fitness / totFit
            if (key != 'shape' && key != 'id') {
                if (yesOrNo) {
                    if(typeof(child[key]) == 'object') child[key] = { ...puzz1[key] }
                    else child[key] = puzz1[key]
                }
                else {
                    if(typeof(child[key]) == 'object') child[key] = { ...puzz2[key] }
                    else child[key] = puzz2[key]
                }
            }
        }
        return child
    }

    // Check if puzzle is in child array (array of puzzles)
    isIn(id, puzzles) {
        for (var i of puzzles) {
            if (i != undefined && i.id == id) {
                return true
            }
        }
        return false
    }

    copyPuzzle(p) {
        return new Puzzle(p.shape, p.pos, p.rotate, p.flip)
    }

    copyBoard(b) {
        return new Board(b.height, b.width, b.puzzles, 1)
    }

    nextGen() {
        this.crossover()
        this.showBestBoard()
        var bestFit = this.getBestBoard().fitness
        console.log(bestFit)
        return bestFit
    }
}