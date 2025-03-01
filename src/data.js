class option {
    constructor(name, type, defaultV) {
        this.name = name
        this.type = type
        this.defaultV = defaultV
    }
}

export let options = [
    new option("Mode", "cbx", 0),
    new option("K value", "num", null),
    new option("Sensibility", "rng", 30),
]