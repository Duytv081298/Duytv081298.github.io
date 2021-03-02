$(document).ready(init);

var width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

var height = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;
var heightCV = height,
    widthCV = height / 1.7
var supportsPassive = false; pressMove = false
var canvas, stage, update = true

var queue, game = {
    levels: 1,
    indexBubbleInlocal: null,
    map: [],
    location: {
        x: 0,
        y: 0,
        existing: false,
        bubble: null,
        color: null,
        checked: false,
        checkAlone: false
    },
    bubble: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        color: null
    }
}
var player = {
    bubble: null,
    color: [],
    currentColor: null
}





var containerMain = new createjs.Container();

// Hàm khởi tạo
async function init() {
    setStage()
    getData()


    createjs.Ticker.framerate = 60
    createjs.Ticker.addEventListener("tick", tick);
}













function setStage() {
    canvas = document.getElementById("myCanvas");
    canvas.height = height
    canvas.width = height / 1.7

    stage = new createjs.Stage(canvas);
    stage.mouseMoveOutside = true;
    if (detectMobile()) {
        canvas.addEventListener("touchstart", onMouseDown, supportsPassive ? { passive: true } : false);
        canvas.addEventListener("touchmove", onPressMove, supportsPassive ? { passive: true } : false);
        canvas.addEventListener("touchend", onMouseUp, supportsPassive ? { passive: true } : false);
    } else {
        canvas.addEventListener("mousedown", onMouseDown);
        canvas.addEventListener("mousemove", onPressMove);
        canvas.addEventListener("mouseup", onMouseUp);
    }
}
async function getData() {
    game.indexBubbleInlocal = await getLevel()
    console.log(game.indexBubbleInlocal);
    // locationArr = setLocationXY()
    await loadImage()
}
// đọc file levels map
async function getLevel() {
    var map
    await $.getJSON("../data/levels/level_0.json", function (data) {
        map = data.bubbles
    });
    return map
}
//khởi tạo map rỗng
function setMap() {
    var locationArr = []
    for (let i = 0; i < stage.canvas.height / (heightB / 2.5); i++) {
        var x = (stage.canvas.width - (widthB / 2) * 9) / 10
        var y = i * heightB / 2.5
        var arr = []
        for (let j = 0; j < 11; j++) {
            x = (stage.canvas.width - (widthB / 2.5) * 9) / 10
            i % 2 == 0 ? x += (widthB / 4 - 5) : x += 0
            x += j * widthB / 2.3
            arr.push({ x: x, y: y, existing: false, bubble: null, color: null, checked: false, checkAlone: false })
        }
        locationArr.push(arr)
    }
    return locationArr
}



//load tất cả các image được sử dụng 
async function loadImage() {
    queue = new createjs.LoadQueue(true, '../data/images/');
    var manifest = [
        { src: 'B_Blue.png', id: 'B_Blue' },
        { src: 'B_Red.png', id: 'B_Red' },
        { src: 'B_Yellow.png', id: 'B_Yellow' },
        { src: 'B_Green.png', id: 'B_Green' },
        { src: 'B_Pink.png', id: 'B_Pink' },
        { src: 'B_Purple.png', id: 'B_Purple' },
        { src: 'B_Cyan.png', id: 'B_Cyan' },
        { src: 'bg1.png', id: 'bg' },
        { src: 'dinosaur.png', id: 'dinosaur' },
        { src: 'owl.png', id: 'owl' },
        { src: 'star.png', id: 'star' }
    ]
    queue.on("fileload", handleFileLoad);
    queue.on("complete", handleComplete);
    queue.loadManifest(manifest);
}
function handleFileLoad() { }
function handleComplete() {
    // bubble.b_Blue = queue.getResult("B_Blue");
    // bubble.b_Red = queue.getResult("B_Red");
    // bubble.b_Yellow = queue.getResult("B_Yellow");
    // bubble.b_Green = queue.getResult("B_Green");
    // bubble.b_Pink = queue.getResult("B_Pink");
    // bubble.b_Purple = queue.getResult("B_Purple");
    // bubble.b_Cyan = queue.getResult("B_Cyan");
    setBackground()
    // setDinosaursAndBird()
    // renderBubble()
    // setStartLocation()
    setPlayer()
    // setDinosaursAndBird()

}
//conver từ id đối tượng ra hình ảnh
function convertIdtoBubble(id) {
    switch (id) {
        case 0:
            return queue.getResult("B_Blue");
        case 1:
            return queue.getResult("B_Red");
        case 2:
            return queue.getResult("B_Yellow");
        case 3:
            return queue.getResult("B_Green");
        case 4:
            return queue.getResult("B_Pink");
        case 5:
            return queue.getResult("B_Purple");
        case 6:
            return queue.getResult("B_Cyan");
        default:
            return null;
    }

}

function setBackground() {
    var image = new Image();
    image = queue.getResult("bg");
    var bg = new createjs.Bitmap(image);
    bg.scaleX = stage.canvas.width / image.width;
    bg.scaleY = stage.canvas.height / image.height;
    stage.addChild(bg);
    stage.update();
}
function setPlayer() {
    var image = new Image();
    updateColor()
    var id = colorPlayers[Math.floor(Math.random() * colorPlayers.length)]
    var image = convertIdtoBubble(id)
    bubbleBitmap = new createjs.Bitmap(image);

    bubbleBitmap.scaleX = 0.5;
    bubbleBitmap.scaleY = 0.5;

    bubbleBitmap.x = stage.canvas.width / 2 - (widthB / 4)
    bubbleBitmap.y = stage.canvas.height * 9 / 10 - 100 - (heightB / 4)
    bublesPlayers.push({ bubble: bubbleBitmap, color: id })

    stage.addChild(bubbleBitmap);
}

function updateColor() {
    var arColor = []
    player.color = []
    locationArr.forEach(element => {
        element.forEach(bubble => {
            if (bubble.color) arColor.push(bubble.color)
        });
    });
    for (var i = 0; i < arColor.length; i++) {
        var color = arColor[i]
        if (colorPlayers.indexOf(color) === -1) {
            if (color == 0 || color == 1 || color == 2 || color == 3 || color == 4 || color == 5 || color == 6 || color == 7) colorPlayers.push(arColor[i])
        }
    }
    player.color = player.color.sort()
}




function detectMobile() {
    try {
        var opts = Object.defineProperty({}, 'passive', {
            get: function () {
                supportsPassive = true;
            }
        });
        window.addEventListener("testPassive", null, opts);
        window.removeEventListener("testPassive", null, opts);
    } catch (e) { }
    var iOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false);
    if (iOS) {
        return true;
    }
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    if (isAndroid) {
        return true;
    }
    return false;
}
function onMouseDown(evt) {
    pressMove = true
    console.log(evt.type);
}
function onPressMove(evt) {
    if (pressMove) console.log(evt.type);

}
function onMouseUp(evt) {
    pressMove = false
    console.log(evt.type);
}
// update stage
function tick(event) {
    if (update) {
        update = false;
        stage.update(event);
    }
}

