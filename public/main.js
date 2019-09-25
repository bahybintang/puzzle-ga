import Board from "./ga/board.js"
import Template from "./ga/template.js"

var template = Template.generateTemplate(1000)
var boards = []

for (var i = 0; i < 20; i++) {
    boards[i] = new Board(10, 10, template)
    boards[i].show()
}

