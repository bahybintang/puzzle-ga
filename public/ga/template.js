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
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0]
            ]
        ]

        var template = []
        while (count--) {
            template.push(pattern[getRandomInt(0, 4)])
        }
        return template
    }
}