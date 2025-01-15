//Coded by FA_pew

//CONFIG
let cellSize = 100, trgRange = 2, offset = cellSize/2
//

const bgSky = document.getElementById("bgSky")

let stars = []

window.addEventListener("load", fillSky)
window.addEventListener("resize", fillSky)

function fillSky() {
    const w = window.innerWidth, h = window.innerHeight
    const wCells = Math.floor(w/cellSize), hCells = Math.floor(h/cellSize)

    const wd = wCells*cellSize, hd = hCells*cellSize
    bgSky.style.width = `${wd}px`, bgSky.style.height = `${hd}px`

    bgSky.style.gridTemplateColumns = `repeat(${wCells},${cellSize}px)`
    bgSky.style.gridTemplateRows = `repeat(${hCells},${cellSize}px)`

    bgSky.innerHTML = ""

    for (let i = 0; i < hCells; i++) {
        stars[i] = []
        for (let j = 0; j < wCells; j++) {
            const sBox = document.createElement("div")
            sBox.classList.add("starBox")
            sBox.id = `b${i}_${j}`

            const star = document.createElement("div")
            star.classList.add("star")
            star.id = `s${i}_${j}`

            stars[i][j] = sBox
            sBox.appendChild(star)

            sBox.style.transform = `translateX(${(Math.random()*2-1)*offset}px) translateY(${(Math.random()*2-1)*offset}px) scale(${Math.random()+0.1})`

            bgSky.appendChild(sBox)
        }
    }

    bgSky.addEventListener("mouseover", (e) => {
        const target = e.target.closest(".starBox")
        console.log(target)
        if (!target) return

        const [y, x] = target.id.replace("b", "").split("_").map((a) => Math.floor(a))

        for (let i = -trgRange-2; i <= trgRange+2; i++) {
            for (let j = -trgRange-2; j <= trgRange+2; j++) {
                const cx = x+i, cy = y+j

                if ((cx >= 0 && cx < wCells) && (cy >= 0 && cy < hCells)) {
                    const star = stars[cy][cx]

                    if ((i >= -trgRange && i <= trgRange) && (j >= -trgRange && j <= trgRange)) {
                        star.classList.add("active")
                    } else {
                        star.classList.remove("active")
                    }
                }
            }
        }
    })
}