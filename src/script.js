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
            let ctx = cnv.getContext("2d")
            let img = imgs[cnv.id]
            let args = getImgArgs(img)
            ctx.drawImage(img, args[0], args[1], args[2], args[3])
        }
    })
})

cancButtons.forEach((canc) => {
    canc.addEventListener("click", () => {
        let idx = canc.id

        imgs[idx] = null
        boxArr[idx].style.visibility = "hidden"
    })
})

function insertImg(idx) {
    let cnv = cnvArr[idx]
    let box = boxArr[idx]
    let ctx = cnv.getContext("2d")
    let img = imgs[idx]

    box.style.visibility = "visible"
    
    ctx.fillStyle = "#0c0d25"
    ctx.fillRect(0,0,cnv.width,cnv.height)
    let args = getImgArgs(img)
    ctx.drawImage(img, args[0], args[1], args[2], args[3])
}

function getImgArgs(img) {
    let box = cnvBoxes[0]

    let boxAR = box.clientWidth/box.clientHeight
    let imgAR = img.width/img.height

    let w, h, ox = 0, oy = 0

    if (boxAR > imgAR) {
        h = box.clientHeight
        w = h*imgAR
        ox = box.clientWidth/2-w/2
    } else {
        w = box.clientWidth
        h = w/imgAR
        oy = box.clientHeight/2-h/2
    }

    return [ox, oy, w, h]
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
            oIn.type = "checkbox"
            oInBox.classList.add("oCbxBox")
            oIn.classList.add("oCbx")

            oInBox.appendChild(oIn)

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
            oIn.type = "range"
            oInBox.classList.add("oRngBox")
            oIn.classList.add("oRng")
            
            oInBox.appendChild(oIn)

            break
        }
    }

    oInBox.classList.add("oInBox")
    oBox.classList.add("oBox")
    oTxt.classList.add("oTxt")

    temp += "50px "

    oBox.appendChild(oTxt)
    oBox.appendChild(oInBox)

    optBox.appendChild(oBox)
})

optBox.style.gridTemplateRows = temp

/* ------------------------------- //!SECTION ------------------------------- */