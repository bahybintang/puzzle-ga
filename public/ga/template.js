export default {
    generateTemplate(count) {
        var pattern = [
            [
                [0, 0, 0],
                [0, 1, 1],
                [0, 1, 1]
            ],
            [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 1]
            ],
            [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 0]
            ],
            [
                [0, 1, 0],
                [1, 1, 1],
                [0, 1, 0]
            ],
            [
                [0, 1, 0],
                [0, 1, 1],
                [0, 1, 0]
            ],
            [
                [0, 0, 0],
                [0, 1, 1],
                [1, 1, 0]
            ],
            [
                [0, 0, 0],
                [0, 1, 0],
                [0, 0, 0]
            ],
            [
                [0, 1, 0],
                [0, 1, 1],
                [0, 0, 0]
            ]
        ]

        // Init empty template
        var template = []
        for (var i = 0; i < count; i++) {
            // Get random pattern in pattern template
            var gotPattern = deepCopy(pattern[getRandomInt(0, pattern.length - 1)])
            for (var x = 0; x < gotPattern.length; x++) {
                for (var y = 0; y < gotPattern[x].length; y++) {
                    if (gotPattern[x][y] != 0) {
                        gotPattern[x][y] = i + 1
                    }
                }
            }
            // Push pattern to template
            template.push(gotPattern)
        }
        return template
    }
}