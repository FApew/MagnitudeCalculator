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
    new option("Sensibility", "rng", 50, 0, 100, 5),
    new option("Distance", "rng", 10, 0, 50, 1),
    new option("Steps", "rng", 5, 1, 10, 1),
    new option("CenterSens", "rng", 7.5, 0, 10, 0.5)
]