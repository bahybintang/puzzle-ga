import Population from "./ga/population.js"

var population = new Population(100, 50, 0.1)

population.showBestBoard()

var buttonNextGen = document.getElementById('nextgen')
buttonNextGen.onclick = function nextGen() {
    while (1) population.nextGen(), 1000 
}

