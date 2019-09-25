import Population from "./ga/population.js"

var population = new Population(100, 200, 0.1)

population.showBestBoard()

var buttonNextGen = document.getElementById('nextgen')
buttonNextGen.onclick = function nextGen() {
    while (1) setTimeout(population.nextGen(), 1000) 
}

