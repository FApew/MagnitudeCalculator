/* -------------------------------------------------------------------------- */
/*                          Coded by F.Aiello 02/2025                         */
/* -------------------------------------------------------------------------- */

/* ------------------------ //SECTION - Image Upload ------------------------ */
const imgArr = document.querySelectorAll(".upTxt")
const uplArr = document.querySelectorAll(".inUpl")

let imgs = [], starPos = []

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
    cnvs.forEach((cnv, idx) => {
        cnv.width = cnvBoxes[0].clientWidth
        cnv.height = cnvBoxes[0].clientHeight

        if (imgs[idx]) {
            let img = imgs[idx]

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
    let ctx = cnv.getContext("2d", { willReadFrequently: true })
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
    elm.style.backgroundPosition = `-${(elm.value-elm.min)/(elm.max-elm.min)*70 + 15}%`
    let display = elm.parentElement.querySelector(".oRngDisplay")
    display.innerHTML = `${Math.round(elm.value)}`
    display.style.left = `calc(${((elm.value-elm.min)/(elm.max-elm.min)*70 + 15)}% - 13px)`
}

/* ------------------------------- //!SECTION ------------------------------- */

/* ---------------------- //SECTION - Image Processing ---------------------- */

const submit = document.getElementById("submit")
submit.addEventListener("click", () => {
    if(imgs[0]/* && imgs[1] && imgs[2]*/) {
        imgs.forEach((img, idx) => {

        })
        let idx = 0, img = imgs[0]
        starPos[idx]=getStarArr(img, idx)
        drawStars(img, idx)
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
    let imgCtx = imgCnv.getContext("2d", { willReadFrequently: true })
    imgCtx.drawImage(img, 0, 0, w, h)

    let pixels = imgCtx.getImageData(0, 0, w, h).data*/

    let args = getImgArgs(img)
    //let ox = args[0], oy = args[1]
    let pixels = ctx.getImageData(args[0], args[1], args[2], args[3]).data

    let sens = parseFloat(document.getElementById("sens").value)/100
    let dist = parseFloat(document.getElementById("dist").value)
    let sens2 = parseFloat(document.getElementById("cent").value)/10

    let steps = 2

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            let minLum = 255*(1-sens)
            if (rgbToLum(pxVal(x, y)) > minLum && search(x, y)) {
                let midY = y, midX = x
                for (let i = 0; i < steps; i++) {
                    let endsY = getEnds(midX, midY, 1, minLum)
                    midY = Math.floor(endsY.reduce((a, b) => a + b)/2)

                    let endsX = getEnds(midX, midY, 0, minLum)
                    midX = Math.floor(endsX.reduce((a, b) => a + b)/2)

                    minLum = rgbToLum(pxVal(midX, midY))*sens2
                }

                let endsX = getEnds(midX, midY, 0, minLum)
                let dx = Math.abs(endsX.reduce((a, b) => a - b))
                let endsY = getEnds(midX, midY, 1, minLum)
                let dy = Math.abs(endsY.reduce((a, b) => a - b))

                /*ctx.strokeStyle = "#ff0000a6"
                ctx.beginPath()
                ctx.moveTo(endsX[0]+ox, midY+oy)
                ctx.lineTo(endsX[1]+ox, midY+oy)
                ctx.stroke()

                ctx.strokeStyle = "#00ff00a6"
                ctx.beginPath()
                ctx.moveTo(midX+ox, endsY[0]+oy)
                ctx.lineTo(midX+ox, endsY[1]+oy)
                ctx.stroke()*/

                if(search(midX, midY)) starsArr.push([midX, midY, Math.floor((dx+dy)/2)])
            }
        }
    }

    return starsArr

    function getEnds(x, y, dir, minLum) {
        let end = []
        let test = dir ? y : x
        do {
            test--
        } while (rgbToLum(pxVal(dir ? x : test, dir ? test : y)) > minLum);
        end.push(test)

        test = dir ? y : x
        do {
            test++
        } while (rgbToLum(pxVal(dir ? x : test, dir ? test : y)) > minLum);
        end.push(test)

        return end
    }

    function pxVal(x, y) {
        return [pixels[(y*w+x)*4], pixels[(y*w+x)*4+1], pixels[(y*w+x)*4+2]]
    }

    function rgbToLum(rgb) {
        return 0.2126*rgb[0] + 0.7152*rgb[1] + 0.0722*rgb[2]
    }

    function search(x, y) {
        for (let star of starsArr) {
            if (Math.hypot(x-star[0], y-star[1]) < dist+star[2]){
                return false
            }
        }
        return true
    }
}

function drawStars(img, idx) {
    starPos[idx].forEach((star) => {
        let ctx = cnvArr[idx].getContext("2d", { willReadFrequently: true })
        let x = star[0], y = star[1]

        let dist = parseFloat(document.getElementById("dist").value)
        let args = getImgArgs(img)
        let ox = args[0], oy = args[1]

        ctx.fillStyle = "#00f"
        ctx.fillRect(x+ox, y+oy, 1, 1)

        ctx.strokeStyle = "#a00"
        ctx.beginPath()
        if (dist != 0) ctx.arc(x+ox, y+oy, dist+star[2]/2, 0, 2*Math.PI)
        ctx.stroke()

        ctx.strokeStyle = "#a17fff"
        ctx.beginPath()
        ctx.arc(x+ox, y+oy, star[2]/2, 0, 2*Math.PI)
        ctx.stroke()

        console.log(star)
    })
    console.log("StarNum: " + starPos[0].length)
}

/* ------------------------------- //!SECTION ------------------------------- */