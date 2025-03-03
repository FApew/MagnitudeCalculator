class option {
    constructor(name, type, defaultV, min, max, step) {
        this.name = name
        this.type = type
        this.defaultV = defaultV
        this.min = min
        this.max = max
        this.step = step
    }
}

export let options = [
    new option("RGB Mode", "cbx", 1),
    new option("K value", "num", null),
    new option("Sensibility", "rng", 30, 0, 100, 5),
    new option("Size", "rng", 15, 0, 50, 1),
]