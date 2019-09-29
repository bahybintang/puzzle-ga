// import Puzzle from "./puzzle.js";
import Board from "./board.js";
import Template from "./template.js"
import Puzzle from "./puzzle.js";
export default class Population {
    constructor(size, cromosome_size, mutation_rate) {
        this.mutation_rate = mutation_rate
        this.size = size
        this.cromosome_size = cromosome_size
        this.boards = []
        this.init()
    }

    init() {
        var template = Template.generateTemplate(this.cromosome_size)

        for (var i = 0; i < this.size; i++) {
            this.boards.push(new Board(10, 10, template))
        }
    }

    getBestBoard() {
        var max = {
            fitness: 0
        }

        this.boards.forEach((item, idx) => {
            if (item.fitness > max.fitness) {
                max = item
            }
        })

        return max
    }

    showBestBoard() {
        var bestBoard = this.getBestBoard()
        bestBoard.showBoard()
        bestBoard.showFitness()
    }

    crossover() {
        var size = this.size
        this.boards.sort((a, b) => { return b.fitness - a.fitness })

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

        var newPop = []
        for (var i = 0; i < Math.floor(0.1 * size); i++) {
            // newPop[i] = (this.copyBoard(this.boards[i]))
            newPop[i] = this.boards[i]
        }

        for (var x = 0; x < Math.floor(0.8 * size); x++) {
            var p1 = 1 - Math.random(), found1 = false
            var p2 = 1 - Math.random(), found2 = false

            for (var i = 0; i < size; i++) {
                if (cumprob[i] >= p1 && !found1) {
                    // p1 = this.copyBoard(this.boards[i])
                    p1 = this.boards[i]
                    found1 = true
                }
                if (cumprob[i] >= p2 && !found2) {
                    // p2 = this.copyBoard(this.boards[i])
                    p2 = this.boards[i]
                    found2 = true
                }
                if (found1 && found2) break;
            }

            var pivot1 = Math.floor(0.2 * this.cromosome_size), pivot2 = Math.floor(0.4 * this.cromosome_size)
            var child = []
            for (var i = pivot1; i < pivot2; i++) {
                child[i] = this.copyPuzzle(p2.puzzles[i])
            }

            var i = pivot2
            for (var j = pivot2; j < this.cromosome_size; j++) {
                if (i >= this.cromosome_size) {
                    break;
                }
                if (!this.isIn(p1.puzzles[j].id, child)) {
                    child[i] = this.crossGen(this.copyPuzzle(p1.puzzles[j]), p1, p2)
                    i++;
                }
            }

            for (var j = 0; j < pivot2; j++) {
                if (i >= this.cromosome_size) {
                    break;
                }
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

            var newBoard = new Board(10, 10, child, true)

            if (1 - Math.random() <= this.mutation_rate) {
                newBoard.mutate(this.mutation_rate)
            }
            // console.log(newPop)
            newPop.push(newBoard)
            // console.log(newPop)
        }

        for (var j = size - 1; j >= Math.floor(0.9 * size); j--) {
            // var tmp = this.copyBoard(this.boards[j])
            var tmp = this.boards[j]
            if (1 - Math.random() <= this.mutation_rate) {
                tmp.mutate(this.mutation_rate)
            }
            // newPop.push(this.copyBoard(tmp))
            newPop.push(tmp)
        }

        // console.log(newPop)
        this.boards = newPop
    }

    crossGen(puzz, p1, p2) {
        var puzz1 = this.copyPuzzle(p1.getById(puzz.id))
        var puzz2 = this.copyPuzzle(p2.getById(puzz.id))
        var child = this.copyPuzzle(puzz)
        var totFit = p1.fitness + p2.fitness
        var keys = Object.keys(puzz1)
        for (var key of keys) {
            var yesOrNo = Math.random() <= p1.fitness / totFit
            if (key != 'shape' && key != 'id') {
                if (yesOrNo) {
                    child[key] = { ...puzz1[key] }
                }
                else {
                    child[key] = { ...puzz2[key] }
                }
            }
        }
        return child
    }

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