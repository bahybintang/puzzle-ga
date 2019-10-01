// import Puzzle from "./puzzle.js";
import Board from "./board.js";
import Template from "./template.js"
import Puzzle from "./puzzle.js";
export default class Population {
    constructor(size, cromosome_size, mutation_rate, bx, by) {
        this.mutation_rate = mutation_rate
        this.size = size
        this.cromosome_size = cromosome_size
        this.boards = []
        this.boardsize = {
            x: bx,
            y: by
        }
        this.init()
    }

    init() {
        var template = Template.generateTemplate(this.cromosome_size)

        for (var i = 0; i < this.size; i++) {
            this.boards.push(new Board(this.boardsize.x, this.boardsize.y, template))
        }
    }

    getBestBoard() {
        this.boards.sort((a, b) => { return b.fitness - a.fitness })
        if (this.boards[1].fitness == this.boards[0].fitness) return this.boards[1]
        else return this.boards[0]
    }

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

        var newPop = []
        for (var i = 0; i < Math.floor(0.1 * size); i++) {
            var tmp = this.boards[i]
            if (1 - Math.random() < this.mutation_rate && i > 0) {
                tmp.mutate(this.mutation_rate)
            }
            newPop[i] = tmp
        }

        // The real crossover
        for (var x = 0; x < Math.floor(0.8 * size); x++) {
            var p1 = 1 - Math.random(), found1 = false
            var p2 = 1 - Math.random(), found2 = false

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

            var pivot1 = Math.floor(getRandomInt(0, this.cromosome_size - 2))
            var pivot2 = Math.floor(getRandomInt(pivot1 + 1, this.cromosome_size - 1))
            var child = []
            for (var i = pivot1; i < pivot2; i++) {
                child[i] = this.crossGen(this.copyPuzzle(p2.puzzles[i]), p1, p2)
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

            var newBoard = new Board(this.boardsize.x, this.boardsize.y, child, true)

            if (1 - Math.random() <= this.mutation_rate) {
                newBoard.mutate(this.mutation_rate)
            }
            newPop.push(newBoard)
        }

        for (var j = size - 1; j >= Math.floor(0.9 * size); j--) {
            var tmp = this.boards[j]
            if (1 - Math.random() <= this.mutation_rate) {
                tmp.mutate(this.mutation_rate)
            }
            newPop.push(tmp)
        }
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