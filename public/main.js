import Population from "./ga/population.js"

// Default parameters
const CROMOSOME_SIZE = 50, POP_SIZE = 100, MUTATION_RATE = 0.05
const BOARD_SIZE_X = 10, BOARD_SIZE_Y = 10
const STOP_FITNESS = 100

var interval = null
var buttonNextGen = document.getElementById('inf')
var generation = document.getElementById('generation')
// var popSizeHTML = document.getElementById('pop-size')
var gen = 0;

var randomColor = []

// Population intitialization
var population = new Population(POP_SIZE, CROMOSOME_SIZE, MUTATION_RATE, BOARD_SIZE_X, BOARD_SIZE_Y)

// Generate and save color to local storage
for (var i = 0; i < CROMOSOME_SIZE; i++) {
    randomColor.push('#' + (Math.random() * 0xFFFFFF << 0).toString(16))
}
localStorage.setItem("randomColor", JSON.stringify(randomColor))

// Show best cromosome in population
population.showBestBoard()

// Button infinite next generation
buttonNextGen.onclick = function nextGen() {
    interval = setInterval(function () {
        var fit = population.nextGen()
        gen++
        var innerHTMLs = `<h2> Generation: ${gen} </h2>`
        generation.innerHTML = innerHTMLs
        if (fit == STOP_FITNESS) return;
    }, 1);
}

// Button stop
var stopBTN = document.getElementById('stop')
stopBTN.onclick = function () {
    clearInterval(interval);
};

// Button next generation
var buttonNextGen = document.getElementById('nextgen')
buttonNextGen.onclick = function nextGen() {
    population.nextGen(), 1000
}

