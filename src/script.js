/* -------------------------------------------------------------------------- */
/*                          Coded by F.Aiello 02/2025                         */
/* -------------------------------------------------------------------------- */

/* ------------------------ //SECTION - Image Upload ------------------------ */
const imgArr = document.querySelectorAll(".upTxt")
const uplArr = document.querySelectorAll(".inUpl")

let imgs = []

imgArr.forEach((txt) => {
    txt.addEventListener("click", () => {
        document.getElementById(`inUpl${txt.id}`).click()
    })
})

uplArr.forEach((upl) => {
    upl.addEventListener("change", (event) => {
        let file = event.target.files[0]
        
        let idx = event.target.id.replace("inUpl", "")

        if (file && file.type.startsWith("image/")) {
            
            const reader = new FileReader()
            reader.readAsDataURL(file);

            reader.onload = (e) => {
                let imgObj = new Image()
                imgObj.src = e.target.result

                imgObj.onload = () => {
                    imgs[idx] = imgObj

                    insertImg(idx)
                }
            }
        }
    })
})

/* ------------------------------- //!SECTION ------------------------------- */

/* ------------------------ //SECTION - Canvas Update ----------------------- */
const cnvs = document.querySelectorAll(".cnv")
const cnvBoxes = document.querySelectorAll(".cnvBox")
const cancButtons = document.querySelectorAll(".cancel")
let cnvArr = [], boxArr = []

cnvs.forEach((cnv) => {
    cnvArr[cnv.id] = cnv

    cnv.width = cnvBoxes[0].clientWidth;
    cnv.height = cnvBoxes[0].clientHeight;
})

cnvBoxes.forEach((box) => {
    boxArr[box.id] = box
})

window.addEventListener("resize", () => {
    cnvs.forEach((cnv) => {
        cnv.width = cnvBoxes[0].clientWidth
        cnv.height = cnvBoxes[0].clientHeight

        if (imgs[cnv.id]) {
            let img = imgs[cnv.id]

            drawImage(cnv, img)
        }
    })
})

cancButtons.forEach((canc) => {
    canc.addEventListener("click", () => {
        let idx = canc.id

        imgs[idx] = null
        boxArr[idx].style.visibility = "hidden"
        document.getElementById(`inUpl${idx}`).files = new DataTransfer().files
    })
})

function insertImg(idx) {
    let cnv = cnvArr[idx]
    let box = boxArr[idx]
    let img = imgs[idx]

    box.style.visibility = "visible"
    
    drawImage(cnv, img)
}

function getImgArgs(img) {
    let box = cnvBoxes[0]

    let boxAR = box.clientWidth/box.clientHeight
    let imgAR = img.width/img.height

    let w, h, ox = 0, oy = 0

    if (boxAR > imgAR) {
        h = box.clientHeight
        w = Math.floor(h*imgAR)
        ox = Math.floor(box.clientWidth/2-w/2)
    } else {
        w = box.clientWidth
        h = Math.floor(w/imgAR)
        oy = Math.floor(box.clientHeight/2-h/2)
    }

    return [ox, oy, w, h]
}

function drawImage(cnv, img) {
    let ctx = cnv.getContext("2d")
    ctx.fillStyle = "#0c0d25"
    ctx.fillRect(0,0,cnv.width,cnv.height)

    let args = getImgArgs(img)
    
    ctx.drawImage(img, args[0], args[1], args[2], args[3])
}

/* ------------------------------- //!SECTION ------------------------------- */

/* ------------------------- //SECTION - Img Slider ------------------------- */
const aL = document.getElementById("imgAl")
const aR = document.getElementById("imgAr")
const imgSlider = document.getElementById("imgSlider")

let selImg = 0

aL.addEventListener("click", () => {
    if (selImg > 0 ) selImg-=1
    imgSlider.style.transform = `translateX(${-selImg*1/3*100}%)`
    
})
aR.addEventListener("click", () => {
    if (selImg < 2) selImg+=1
    imgSlider.style.transform = `translateX(${-selImg*1/3*100}%)`
})
/* ------------------------------- //!SECTION ------------------------------- */

/* --------------------------- //SECTION - Options -------------------------- */
import { options } from "./data.js"
const optBox = document.getElementById("mainOptions")

let temp = ""

options.forEach((opt) => {
    let oBox = document.createElement("div")
    let oTxt = document.createElement("div")
    let oInBox = document.createElement("div")
    let oIn = document.createElement("input")

    oTxt.innerHTML = opt.name + ": ";

    switch (opt.type) {
        case "cbx": {
            let oCbxSwitch = document.createElement("div")

            oIn.type = "checkbox"
            oInBox.classList.add("oCbxBox")
            oIn.classList.add("oCbx")
            oCbxSwitch.classList.add("oCbxSwitch")

            if (opt.defaultV) oIn.checked = true

            oInBox.appendChild(oIn)
            oInBox.appendChild(oCbxSwitch)

            break
        }
        case "num": {
            oIn.type = "text"
            oInBox.classList.add("oNumBox")
            oIn.classList.add("oNum")
            oIn.placeholder = .1
            
            oInBox.appendChild(oIn)

            break
        }
        case "rng": {
            const oRngDisplay = document.createElement("div")

            oIn.type = "range"
            oInBox.classList.add("oRngBox")
            oIn.classList.add("oRng")
            oRngDisplay.classList.add("oRngDisplay")

            oIn.min = opt.min
            oIn.max = opt.max
            oIn.step = opt.step

            oIn.value = opt.defaultV

            oIn.addEventListener("input", (e) => {
                refreshSlider(e.target)
            })

            oInBox.appendChild(oIn)
            oInBox.appendChild(oRngDisplay)

            refreshSlider(oIn)

            break
        }
    }

    oIn.id = Array.from(opt.name.toLowerCase()).map((a, idx, arr) => {if (a == " ") {a = ""; arr[idx + 1] = arr[idx + 1].toUpperCase()} return a}).join("").slice(0, 4)

    oInBox.classList.add("oInBox")
    oBox.classList.add("oBox")
    oTxt.classList.add("oTxt")

    temp += "50px "

    oBox.appendChild(oTxt)
    oBox.appendChild(oInBox)

    optBox.appendChild(oBox)
})

optBox.style.gridTemplateRows = temp

function refreshSlider(elm) {
    elm.style.backgroundPosition = `-${elm.value/elm.max*70 + 15}%`
    let display = elm.parentElement.querySelector(".oRngDisplay")
    display.innerHTML = `${Math.round(elm.value)}`
    display.style.left = `calc(${(elm.value/elm.max*70 + 15)}% - 13px)`
}

/* ------------------------------- //!SECTION ------------------------------- */

/* ---------------------- //SECTION - Image Processing ---------------------- */

const submit = document.getElementById("submit")
submit.addEventListener("click", () => {
    if(imgs[0]/* && imgs[1] && imgs[2]*/) {
        imgs.forEach((img, idx) => {

        })
        let idx = 0, img = imgs[0]
        getStarArr(img, idx)
    }
})

function getStarArr(img, idx) {
    let cnv = cnvArr[idx]
    let ctx = cnv.getContext("2d", { willReadFrequently: true })
    drawImage(cnv, img)

    let w = cnv.width, h = cnv.height

    let starsArr = []
    
    /*let imgCnv = document.createElement("canvas")
    imgCnv.width = w
    imgCnv.height = h
    let imgCtx = imgCnv.getContext("2d")
    imgCtx.drawImage(img, 0, 0, w, h)

    let pixels = imgCtx.getImageData(0, 0, w, h).data*/

    let args = getImgArgs(img)
    let ox = args[0], oy = args[1]
    let pixels = ctx.getImageData(args[0], args[1], args[2], args[3]).data

    let sens = parseFloat(document.getElementById("sens").value)/100, size = parseFloat(document.getElementById("size").value), sens2 = .98

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            if (rgbToLum(pxVal(x, y)) > 255*(1-sens) && search(x, y)) {
                let lum = rgbToLum(pxVal(x, y))
                let leftX = x, rightX = x
                do {
                    leftX--
                } while (rgbToLum(pxVal(leftX, y)) > 255*(1-sens));

                do {
                    rightX++
                } while (rgbToLum(pxVal(rightX, y)) > 255*(1-sens));

                let midX = Math.floor((leftX+rightX)/2)
                
                let topY = y, botY = y

                do {
                    topY--
                } while (rgbToLum(pxVal(midX, topY)) > 255*(1-sens));

                do {
                    botY++
                } while (rgbToLum(pxVal(midX, botY)) > 255*(1-sens));

                let midY = Math.floor((botY + topY)/2)

                topY = midY, botY = midY
                lum = rgbToLum(pxVal(midX, midY)) 

                do {
                    topY--
                } while (rgbToLum(pxVal(midX, topY)) > lum*sens2);

                do {
                    botY++
                } while (rgbToLum(pxVal(midX, botY)) > lum*sens2);

                starsArr.push([midX, midY, Math.abs(topY-botY)])
            }
        }
    }

    starsArr.forEach((star) => {
        let x = star[0], y = star [1]

        ctx.strokeStyle = "#aa00007f"
        ctx.beginPath()
        ctx.arc(x+ox, y+oy, size, 0, 2*Math.PI)
        ctx.stroke()

        ctx.strokeStyle = "#a17fffaf"
        ctx.beginPath()
        ctx.arc(x+ox, y+oy, star[2], 0, 2*Math.PI)
        ctx.stroke()

        console.log(star)
    })

    return starsArr

    function pxVal(x, y) {
        return [pixels[(y*w+x)*4], pixels[(y*w+x)*4+1], pixels[(y*w+x)*4+2]]
    }

    function rgbToLum(rgb) {
        return 0.2126*rgb[0] + 0.7152*rgb[1] + 0.0722*rgb[2]
    }

    function search(x, y) {
        for (let star of starsArr) {
            if (Math.hypot(x-star[0], y-star[1]) < size+star[2]){
                return false
            }
        }
        return true
    }
}

/* ------------------------------- //!SECTION ------------------------------- */