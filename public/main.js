import Board from "./ga/board.js"
import Template from "./ga/template.js"

var template = Template.generateTemplate(100)
var board = new Board(10, 10, template)

board.show()

