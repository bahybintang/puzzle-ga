// import Puzzle from "./puzzle.js";
import Board from "./board.js";
import Template from "./template.js"
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
        this.boards.sort((a,b) => {return b.fitness - a.fitness})

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
        for (var i = 0; i < Math.floor(0.2 * size); i++) {
            var tmp = this.boards[i]
            if(1 - Math.random() <= this.mutation_rate) {
                tmp.mutate(this.mutation_rate)
            }
            newPop.push(tmp)
        }

        for (var x = 0; x < size - Math.floor(0.2 * size); x++) {
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

            var pivot1 = Math.floor(0.2 * this.cromosome_size), pivot2 = Math.floor(0.4 * this.cromosome_size)
            var child = []
            for (var i = pivot1; i < pivot2; i++) {
                child[i] = p2.puzzles[i]
            }

            var i = pivot2
            while (i < this.cromosome_size) {
                for (var j = pivot2; j < this.cromosome_size; j++) {
                    if (i >= this.cromosome_size) {
                        break;
                    }
                    if (!this.isIn(p1.puzzles[j].id, child)) {
                        child[i] = p1.puzzles[j]
                        i++;
                    }
                }
                for (var j = 0; j < pivot1; j++) {
                    if (i >= this.cromosome_size) {
                        break;
                    }
                    if (!this.isIn(p1.puzzles[j].id, child)) {
                        child[i] = p1.puzzles[j]
                        i++;
                    }
                }
            }

            i = 0
            while (i < pivot1) {
                for (var j = pivot2; j < this.cromosome_size; j++) {
                    if (i >= pivot1) {
                        break;
                    }
                    if (!this.isIn(p1.puzzles[j].id, child)) {
                        child[i] = p1.puzzles[j]
                        i++;
                    }
                }
                for (var j = 0; j < pivot1; j++) {
                    if (i >= pivot1) {
                        break;
                    }
                    if (!this.isIn(p1.puzzles[j].id, child)) {
                        child[i] = p1.puzzles[j]
                        i++;
                    }
                }
            }

            var newBoard = new Board(10, 10, child, true)

            if(1 - Math.random() <= this.mutation_rate) {
                newBoard.mutate(this.mutation_rate)
            }

            newPop.push(newBoard)
        }
        this.boards = newPop
    }

    isIn(id, puzzle) {
        for (var i = 0; i < puzzle.size; i++) {
            if (id == puzzle[i].id) return true
        }
        return false
    }

    nextGen() {
        this.crossover()
        this.showBestBoard()
        console.log(this.getBestBoard().fitness)
    }
}