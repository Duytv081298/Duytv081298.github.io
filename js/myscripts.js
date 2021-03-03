$(document).ready(init);

var isMobile = detectMobile()
var height = $(window).height()
var width = isMobile ? $(window).width() : height / 1.7

var supportsPassive = false; pressMove = false
var canvas, stage, update = true

var containerLine = new createjs.Container();

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
        width: 110,
        height: 110,
        currentWidth: width / 10,
        currentHeight: width / 10,
        scale: (width / 10) / 110,
        color: null
    }
}
var player = {
    x: 0,
    y: 0,
    angle: 0,
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
    canvas.width = width
    console.log(width + ' : ' + canvas.width);
    console.log(height + ' : ' + canvas.height);

    stage = new createjs.Stage(canvas);
    stage.mouseMoveOutside = true;
    if (isMobile) {
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
    game.map = setMap()
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
    for (let i = 0; i < stage.canvas.height / game.bubble.currentHeight; i++) {
        var x = game.bubble.currentWidth * 0.9,
            y = i * game.bubble.currentHeight * 0.78
        var arr = []
        for (let j = 0; j < 11; j++) {
            var xb = j * x
            if (i % 2 == 0 && y > 1) xb += x / 2
            arr.push({ x: xb, y: y, existing: false, bubble: null, color: null, checked: false, checkAlone: false })
        }
        locationArr.push(arr)
    }
    console.log(locationArr);
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
    setBackground()
    // setDinosaursAndBird()
    renderBubble()
    setStartLocation()
    setPlayer()
    setDinosaursAndBird()
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
function setDinosaursAndBird() {
    var image = new Image();
    image = queue.getResult("dinosaur");
    var dinosaur = new createjs.Bitmap(image);
    dinosaur.scaleX = (width / 3.5) / image.width;
    dinosaur.scaleY = (width / 3.5) / image.width;
    dinosaur.x = stage.canvas.width / 2 - (dinosaur.image.width * dinosaur.scaleX) * 1.4
    dinosaur.y = stage.canvas.height - dinosaur.image.height * dinosaur.scaleX - stage.canvas.height / 14;

    image = queue.getResult("owl");
    var bird = new createjs.Bitmap(image);
    bird.scaleX = (width / 4.5) / image.width;
    bird.scaleY = (width / 4.5) / image.width;
    bird.x = stage.canvas.width / 2 + (dinosaur.image.width * bird.scaleX) * 0.4
    bird.y = stage.canvas.height - bird.image.height * bird.scaleX - stage.canvas.height / 14
    stage.addChild(dinosaur, bird);
    stage.update();
}
function setStartLocation() {
    var circlel = new createjs.Shape();
    circlel.graphics.beginFill("red").drawCircle(0, 0, (width) / 11);

    var circlem = new createjs.Shape();
    circlem.graphics.beginFill("rgba(0,0,0, 0.8)").drawCircle(0, 0, (width) / 11 - 5);


    var container = new createjs.Container();
    container.addChild(circlel, circlem);
    container.x = stage.canvas.width / 2
    container.y = stage.canvas.height * 9 / 10 - (width) / 15

    stage.addChild(container);
}
// khởi tạo bubbles mặc định
function renderBubble() {
    game.indexBubbleInlocal.forEach(locationBubble => {
        var image = new Image();
        image = convertIdtoBubble(locationBubble.id)
        var bubble = new createjs.Bitmap(image);
        bubble.scaleX = game.bubble.scale;
        bubble.scaleY = game.bubble.scale;
        var a = game.map[locationBubble.y][locationBubble.x]
        bubble.x = a.x
        bubble.y = a.y
        containerMain.addChild(bubble)
        game.map[locationBubble.y][locationBubble.x] = { x: a.x, y: a.y, existing: true, bubble: bubble, color: locationBubble.id, checked: false, checkAlone: false, vibration: false }
    });
    stage.addChild(containerMain)
    updateColor()
}

//khởi tạo player
function setPlayer() {
    var image = new Image();
    updateColor()
    var id = player.color[Math.floor(Math.random() * player.color.length)]
    image = convertIdtoBubble(id)
    var bubble = new createjs.Bitmap(image);

    bubble.scaleX = game.bubble.scale;
    bubble.scaleY = game.bubble.scale;

    bubble.x = stage.canvas.width / 2 - (game.bubble.currentWidth / 2)
    bubble.y = stage.canvas.height * 9 / 10 - game.bubble.currentWidth * 2

    player.x = stage.canvas.width / 2
    player.y = stage.canvas.height * 9 / 10 - game.bubble.currentWidth * 1.5
    player.currentColor = id
    player.bubble = bubble
    stage.addChild(bubble);
}
function updateColor() {
    var arColor = []
    player.color = []
    game.map.forEach(element => {
        element.forEach(bubble => {
            if (bubble.color) arColor.push(bubble.color)
        });
    });
    for (var i = 0; i < arColor.length; i++) {
        var color = arColor[i]
        if (player.color.indexOf(color) === -1) {
            if (color == 0 || color == 1 || color == 2 || color == 3 || color == 4 || color == 5 || color == 6 || color == 7) player.color.push(arColor[i])
        }
    }
    player.color = player.color.sort()
}

// định hướng
function radToDeg(angle) {
    return angle * 180 / Math.PI;
}

function degToRad(angle) {
    return angle * (Math.PI / 180);
}
function getTanAngle(angle) {
    return Math.tan(angle * Math.PI / 180);
}
function renderDotLine() {
    if (containerLine) {
        stage.removeChild(containerLine)
        containerLine = new createjs.Container();
    }
    var dotLineArr = []
    var sideK = player.x
    // console.log(player.angle);

    var tanAngle = getTanAngle(player.angle)
    var sideD = sideK * tanAngle
    console.log(sideD);

    var sideH = sideD / Math.asin(player.angle)
    console.log(player.angle);
    console.log(Math.asin(player.angle));

    if (player.angle < 90) {
        // drawDotLeft(sideK, tanAngle)
    }


    function drawDotLeft(sideK, tanAngle) {
        for (var i = 0; i < sideH + 30; i += 30) {
            if (i > sideH) i = sideH
            console.log('Huyền: ' + i);

            var j = cosAngle * i
            console.log('kề: ' + j);
            var sideD = (j) * tanAngle

            console.log('đối: ' + sideD);
            dotLineArr.push({ x: j, y: player.y - sideD })
        }
    }
    dotLineArr.forEach(dot => {
        drawDot(dot.x, dot.y)
    });
    stage.addChild(containerLine)
    // console.log(dotLineArr);

}
function drawDot(x, y) {
    var image = new Image();
    image = convertIdtoBubble(player.currentColor)
    var dot = new createjs.Bitmap(image);

    dot.scaleX = game.bubble.scale;
    dot.scaleY = game.bubble.scale;

    dot.scaleX = (stage.canvas.width / 50) / game.bubble.width;
    dot.scaleY = (stage.canvas.width / 50) / game.bubble.width;

    dot.x = x
    dot.y = y


    containerLine.addChild(dot);
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
    var location = currentMouse(evt)
    
    var a = radToDeg(Math.atan2(player.y- location.y, location.x - player.x))
    console.log(a);
    // console.log(radToDeg(Math.atan2(location.y - player.y, location.x - player.x)) + 180);
    // player.angle = limitAngle(radToDeg(Math.atan2(location.y - player.y, location.x - player.x)) + 180)
    // console.log(player.angle);
    // renderDotLine()



    // console.log(player.angle);
    // console.log(limitAngle(mouseangle));
}
function onPressMove(evt) {
    if (pressMove) {
        var location = currentMouse(evt)
        // var a = radToDeg(Math.atan2(player.y- location.y, location.x - player.x))
        // console.log(a);

        player.angle = limitAngle(radToDeg(Math.atan2(location.y - player.y, location.x - player.x)) + 180)
        // console.log(player.angle);

        // console.log(player.angle);

    }
}
function onMouseUp(evt) {
    pressMove = false
    var location = currentMouse(evt)
    // player.angle = limitAngle(radToDeg(Math.atan2(location.y - player.y, location.x - player.x)) + 180)
    // console.log(player.angle);

}
// update stage
function tick(event) {
    if (update) {
        // update = false;
        stage.update(event);
    }
}

function currentMouse(evt) {
    return isMobile ? { x: evt.changedTouches[0].clientX, y: evt.changedTouches[0].clientY } : { x: evt.clientX, y: evt.clientY }
}
function limitAngle(mouseangle) {
    var lbound = 8;
    var ubound = 172;
    if (mouseangle > ubound && mouseangle < 270) mouseangle = ubound
    if (mouseangle < lbound || mouseangle >= 270) mouseangle = lbound
    return mouseangle
}

