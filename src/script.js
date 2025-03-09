/* -------------------------------------------------------------------------- */
/*                          Coded by F.Aiello 02/2025                         */
/* -------------------------------------------------------------------------- */

/* ------------------------ //SECTION - Image Upload ------------------------ */
const imgArr = document.querySelectorAll(".upTxt")
const uplArr = document.querySelectorAll(".inUpl")

let imgs = [], starPos = []

//NOTE - UploadButton
imgArr.forEach((txt) => {
    txt.addEventListener("click", () => {
        document.getElementById(`inUpl${txt.id}`).click()
    })
})

//NOTE - LoadImg
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

//NOTE - CreateCnv
cnvs.forEach((cnv) => {
    cnvArr[cnv.id] = cnv

    cnv.width = cnvBoxes[0].clientWidth;
    cnv.height = cnvBoxes[0].clientHeight;
})

cnvBoxes.forEach((box) => {
    boxArr[box.id] = box
})

//NOTE - ResizeListener
window.addEventListener("resize", () => {
    cnvs.forEach((cnv, idx) => {
        cnv.width = cnvBoxes[0].clientWidth
        cnv.height = cnvBoxes[0].clientHeight

        if (imgs[idx]) {
            let img = imgs[idx]

            drawImage(cnv, img)

            if (starPos[idx]) {
                starPos[idx]=getStarArr(img, idx)
                drawStars(img, idx)
            }
        }
    })
})

//NOTE - CancButton
cancButtons.forEach((canc) => {
    canc.addEventListener("click", () => {
        let idx = canc.id

        imgs[idx] = null
        starPos[idx] = null
        document.querySelector(`.listBox.${"rgb"[idx]}`).children[1].children[0].innerHTML = ""
        boxArr[idx].style.visibility = "hidden"
        Array.from(cnvBoxes[idx].children).filter(elm => elm.classList.contains("starMark")).forEach((elm) => elm.outerHTML = "")
        document.getElementById(`inUpl${idx}`).files = new DataTransfer().files
    })
})

//NOTE - InsertImgFunction
function insertImg(idx) {
    let cnv = cnvArr[idx]
    let box = boxArr[idx]
    let img = imgs[idx]

    box.style.visibility = "visible"
    
    drawImage(cnv, img)
}

//NOTE - ImgArgsFunction
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

//NOTE - CnvDrawImg
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
const listSlider = document.getElementById("listSlider")

let selImg = 0

//NOTE - Arrows
aL.addEventListener("click", () => {
    if (selImg > 0 ) selImg-=1
    imgSlider.style.transform = `translateX(${-selImg*1/3*100}%)`
    listSlider.style.transform = `translateX(${-selImg*1/3*100}%)`
})
aR.addEventListener("click", () => {
    if (selImg < 2) selImg+=1
    imgSlider.style.transform = `translateX(${-selImg*1/3*100}%)`
    listSlider.style.transform = `translateX(${-selImg*1/3*100}%)`
})
/* ------------------------------- //!SECTION ------------------------------- */

/* --------------------------- //SECTION - Options -------------------------- */
import { options } from "./data.js"
const optBox = document.getElementById("mainOptions")

let temp = ""

//NOTE - OptionObjsCreator
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

//NOTE - SliderEngine
function refreshSlider(elm) {
    elm.style.backgroundPosition = `-${(elm.value-elm.min)/(elm.max-elm.min)*70 + 15}%`
    let display = elm.parentElement.querySelector(".oRngDisplay")
    display.innerHTML = `${elm.value}`
    display.style.left = `calc(${((elm.value-elm.min)/(elm.max-elm.min)*70 + 15)}% - 13px)`
}

/* ------------------------------- //!SECTION ------------------------------- */

/* ------------------------- //SECTION - StarHandler ------------------------ */

class Star {
    constructor(center, radius) {
        this.center = center
        this.radius = radius
        this.magnitude = null
    }
}

//NOTE - StarSubmitButton
const starSubmit = document.getElementById("starSubmit")
starSubmit.addEventListener("click", () => {
    if(imgs[0]/* && imgs[1] && imgs[2]*/) {
        imgs.forEach((img, idx) => {

        })
        let idx = 0, img = imgs[0]
        starPos[idx]=getStarArr(img, idx)

        drawStars(img, idx)

        listStars(idx)
    }
})

//NOTE - StarArray
function getStarArr(img) {
    let cnv = document.createElement("canvas")
    let w = img.width, h = img.height

    cnv.width = w; cnv.height = h
    
    let ctx = cnv.getContext("2d", { willReadFrequently: true })
    ctx.drawImage(img, 0, 0, w, h)

    let starsArr = []
    let pixels = ctx.getImageData(0, 0, w, h).data

    let sens = parseFloat(document.getElementById("sens").value)/100
    let dist = parseFloat(document.getElementById("dist").value)
    let steps = parseFloat(document.getElementById("step").value)
    let sens2 = parseFloat(document.getElementById("ctrs").value)/10

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            let minLum = 255*(1-sens)
            if (rgbToLum(pxVal(x, y)) > minLum && search(x, y)) {
                let midY = y, midX = x
                let mids = [[],[]]
                for (let i = 0; i < steps; i++) {
                    let endsY = getEnds(midX, midY, 1, minLum)
                    mids[1][i] = endsY.reduce((a, b) => a + b)/2
                    midY = Math.floor(mids[1][i])

                    let endsX = getEnds(midX, midY, 0, minLum)
                    mids[0][i] = endsX.reduce((a, b) => a + b)/2
                    midX = Math.floor(mids[0][i])

                    minLum = rgbToLum(pxVal(midX, midY))*sens2
                }

                let avgX = mids[0].reduce((a, b) => a + b)/mids[0].length
                let avgY = mids[1].reduce((a, b) => a + b)/mids[1].length

                let endsX = getEnds(Math.floor(avgX), Math.floor(avgY), 0, minLum)
                let dx = Math.abs(endsX.reduce((a, b) => a - b))
                let endsY = getEnds(Math.floor(avgX), Math.floor(avgY), 1, minLum)
                let dy = Math.abs(endsY.reduce((a, b) => a - b))

                if(search(avgX, avgY)) starsArr.push(new Star([avgX, avgY], Math.ceil((dx+dy)/4)))
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
        test++
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
            if (Math.hypot(x-star.center[0], y-star.center[1]) < dist+star.radius*2){
                return false
            }
        }
        return true
    }
}

//NOTE - StarDrawer
function drawStars(img, idx) {
    Array.from(cnvBoxes[idx].children).filter(elm => elm.classList.contains("starMark")).forEach((elm) => elm.outerHTML = "")
    let args = getImgArgs(img)
    let scale = args[1] ? args[2]/img.width : args[3]/img.height

    starPos[idx].forEach((star, i) => {
        
        let elm = document.createElement("div")
        elm.classList.add("starMark")
        elm.id = "s" + i
        let w = star.radius*2*scale+10
        elm.style.width = `${w}px`

        elm.style.left = `${args[0]+star.center[0]*scale-w/2}px`
        elm.style.top = `${args[1]+star.center[1]*scale-w/2}px`

        elm.addEventListener("click", async () => {
            await new Promise(resolve => setTimeout(resolve, 0))
            starSelector(0, i, 0, idx)
            await new Promise(resolve => setTimeout(resolve, 800))
            starSelector(0, i, 1, idx)
            await new Promise(resolve => setTimeout(resolve, 300))
            starSelector(0, i, 0, idx)
        })

        cnvBoxes[idx].appendChild(elm)
    })
    console.log("StarNum: " + starPos[0].length)
}

//NOTE - ListUpdater
function listStars(idx) {
    let listBox = document.querySelector(`.listBox.${"rgb"[idx]}`).children[1].children[0]

    starPos[idx].forEach((star, i) => {
        let lEBox = document.createElement("div")
        lEBox.classList.add("lEBox")
        lEBox.id = "s" + i

        let lNum = document.createElement("div")
        lNum.classList.add("lNum")
        let lRad = document.createElement("div")
        lRad.classList.add("lRad")

        lNum.innerHTML = i
        lRad.innerHTML = star.radius

        lEBox.appendChild(lNum)
        lEBox.appendChild(lRad)

        lEBox.addEventListener("mouseenter", () => {
            starSelector(1, i, 1, idx)
        })

        lEBox.addEventListener("mouseleave", () => {
            starSelector(1, i, 0, idx)
        })

        listBox.appendChild(lEBox)
    })

    listBox.style.gridTemplateRows = `repeat(${starPos[idx].length}, 50px)`
}

function starSelector(dir, idx, b, rgb) {
    let listBox = document.querySelector(`.listBox.${"rgb"[rgb]}`).children[1]
    let listElm = document.querySelector(`.lEBox#s${idx}`)
    let starElm = document.querySelector(`.starMark#s${idx}`)

    console.log(idx)

    if(!dir) {
        listBox.scrollTo({ top: listElm.offsetTop, behavior: "smooth"})
        if (b) {
            listElm.classList.add("hover")
        } else {
            listElm.classList.remove("hover")
        }

    } else {
        if (b) {
            starElm.classList.add("hover")
        } else {
            starElm.classList.remove("hover")
        }
    }
}

/* ------------------------------- //!SECTION ------------------------------- */

/* --------------------- //SECTION - MagnitudeCalculator -------------------- */



/* ------------------------------- //!SECTION ------------------------------- */