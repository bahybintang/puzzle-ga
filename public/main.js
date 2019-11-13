import Population from "./ga/population.js"

// Parameters
var CROMOSOME_SIZE, POP_SIZE, MUTATION_RATE, BOARD_SIZE_X, BOARD_SIZE_Y, STOP_FITNESS

// Variables
var interval = null
var buttonNextGen = document.getElementById('inf')
var generation = document.getElementById('generation')
var gen = 0;
var population
var randomColor = []

// Params intitialization
document.getElementById('inputView').onsubmit = function (e) {
    e.preventDefault()

    // Assign params value
    BOARD_SIZE_X = document.forms["formInput"].board_height.value * 1
    BOARD_SIZE_Y = document.forms["formInput"].board_width.value * 1
    POP_SIZE = document.forms["formInput"].population_size.value * 1
    CROMOSOME_SIZE = document.forms["formInput"].puzzle_num.value * 1
    MUTATION_RATE = document.forms["formInput"].mutation_rate.value * 1
    STOP_FITNESS = BOARD_SIZE_Y * BOARD_SIZE_X
    document.getElementById("boardView").style.display = "block"

    // New population
    population = new Population(POP_SIZE, CROMOSOME_SIZE, MUTATION_RATE, BOARD_SIZE_X, BOARD_SIZE_Y)

    // Generate and save color to local storage
    for (var i = 0; i < CROMOSOME_SIZE; i++) {
        randomColor.push('#' + (Math.random() * 0xFFFFFF << 0).toString(16))
    }
    localStorage.setItem("randomColor", JSON.stringify(randomColor))

    // Show best cromosome in population
    population.showBestBoard()

    // Show indivdual puzzles
    population.showPuzzles()

    // Clear the input from window
    document.getElementById("inputView").style.display = "none"
}

// Button infinite next generation
buttonNextGen.onclick = function nextGen() {
    interval = setInterval(function () {
        var fit = population.nextGen()
        gen++
        var innerHTMLs = `<h2> Generation: ${gen} </h2>`
        generation.innerHTML = innerHTMLs
        if (fit == STOP_FITNESS || population.getBestBoard().getIncludedPuzzles().length == CROMOSOME_SIZE)
            clearInterval(interval)
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
    population.nextGen()
    gen++
    var innerHTMLs = `<h2> Generation: ${gen} </h2>`
    generation.innerHTML = innerHTMLs
}
