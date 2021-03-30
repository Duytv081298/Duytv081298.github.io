$(document).ready(init);

var isMobile = detectMobile()
var height = $(window).height()
var width = isMobile ? $(window).width() : height / 1.7

var supportsPassive = false, pressMove = false
var canvas, stage, update = true

var containerLine = new createjs.Container();

var spriteBubbles
var queue, game = {
    levels: 1,
    indexBubbleInlocal: null,
    map: [],
    bubble: {
        width: 110,
        height: 110,
        currentWidth: 0,
        currentHeight: 0,
        leftoverX: 0,
        leftoverY: 0,
        scale: 0,
        color: null
    },
    surplus: 0,
}
var player = {
    x: 0,
    y: 0,
    angle: 0,
    bubble: null,
    color: [],
    currentColor: null
}
var destinations = [], bubbleRemove = []
var containerMain = new createjs.Container();
var nInName = 0

// Hàm khởi tạo
async function init() {
    await setStage()
    game.map = setMap()
    loadAnimations()
    getData()
    createjs.Ticker.framerate = 60
    createjs.Ticker.addEventListener("tick", tick);
}

function setStage() {
    canvas = document.getElementById("myCanvas");
    canvas.height = height
    canvas.width = width


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

    console.log(width + ' : ' + stage.canvas.width);
    console.log(height + ' : ' + stage.canvas.height);
    game.bubble.currentWidth = stage.canvas.width / 11
    game.bubble.currentHeight = stage.canvas.width / 11
    game.bubble.scale = (stage.canvas.width / 11) / 110 * 1.1
}
function loadAnimations() {
    spriteBubbles = new createjs.SpriteSheet({
        framerate: 15,
        "images": ["../data/images/dino.png"],
        "frames": { "regX": 0, "height": 93, "count": 70, "regY": 0, "width": 93 },
        "animations": {
            "run_blue": [-1, 9, false],
            "run_red": [50, 59, false],
            "run_yellow": [60, 69, false],
            "run-green": [20, 29, false],
            "run_pink": [30, 39, false],
            "run_purple": [40, 49, false],
            "run_cyan": [10, 19, false],
        }
    });
}
function convertAnimations(color) {
    switch (color) {
        case 0:
            return "run_blue"
        case 1:
            return "run_red"
        case 2:
            return "run_yellow"
        case 3:
            return "run-green"
        case 4:
            return "run_pink"
        case 5:
            return "run_purple"
        case 6:
            return "run_cyan"
        default:
            return null;
    }
}
async function getData() {
    game.indexBubbleInlocal = await getLevel()
    await loadImage()
}
// đọc file levels map
async function getLevel() {
    var map
    await $.getJSON("../data/levels/level_5.json", function (data) {
        map = data.bubbles
    });
    return map
}
//khởi tạo map rỗng
function setMap() {
    game.bubble.leftoverX = (game.bubble.width * game.bubble.scale - game.bubble.currentWidth) / 2
    game.bubble.leftoverY = (game.bubble.width * game.bubble.scale - game.bubble.currentHeight * 0.87) / 2
    var locationArr = []
    for (let i = 0; i < stage.canvas.height / game.bubble.currentHeight; i++) {
        var x = game.bubble.currentWidth,
            y = i * game.bubble.currentHeight * 0.87
        var arr = []

        if (i == 0 || i > 0 && i % 2 != 0) {
            for (let j = 0; j < 11; j++) {
                var xb = j * x
                arr.push({ x: xb, y: y, existing: false, bubble: null, color: null, checked: false, checkAlone: false })
            }
        } else {
            for (let j = 0; j < 10; j++) {
                var xb = j * x
                xb += x / 2
                arr.push({ x: xb, y: y, existing: false, bubble: null, color: null, checked: false, checkAlone: false })
            }
        }

        locationArr.push(arr)
    }
    game.surplus = (game.bubble.currentWidth) / 2
    game.bubble.currentWidth = game.bubble.width * game.bubble.scale - game.bubble.leftoverX * 2
    game.bubble.currentHeight = game.bubble.height * game.bubble.scale - game.bubble.leftoverY * 2
    return locationArr
}
function lToIndex(x, y) {
    var estimateY = Math.floor(y / (game.bubble.currentHeight))
    if (estimateY % 2 == 0 && estimateY > 1) x -= game.surplus
    if (estimateY > 25) estimateY = 25
    var estimateX = Math.floor(x / (game.bubble.currentWidth) + 0.00000000000001)
    if (estimateX < 0) estimateX = 0
    if (estimateX > 10) estimateX = 10
    if (estimateY % 2 == 0 && estimateY > 1 && estimateX > 9) estimateX = 9
    return ({ x: estimateX, y: estimateY })
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
}
function setDinosaursAndBird() {
    var image = new Image();
    image = queue.getResult("dinosaur");
    var dinosaur = new createjs.Bitmap(image);
    dinosaur.scaleX = (stage.canvas.width / 3.5) / image.width;
    dinosaur.scaleY = (stage.canvas.width / 3.5) / image.width;
    dinosaur.x = stage.canvas.width / 2 - (dinosaur.image.width * dinosaur.scaleX) * 1.4
    dinosaur.y = stage.canvas.height - dinosaur.image.height * dinosaur.scaleX - stage.canvas.height / 14;

    image = queue.getResult("owl");
    var bird = new createjs.Bitmap(image);
    bird.scaleX = (stage.canvas.width / 4.5) / image.width;
    bird.scaleY = (stage.canvas.width / 4.5) / image.width;
    bird.x = stage.canvas.width / 2 + (dinosaur.image.width * bird.scaleX) * 0.4
    bird.y = stage.canvas.height - bird.image.height * bird.scaleX - stage.canvas.height / 14
    stage.addChild(dinosaur, bird);
    stage.update();
}
function setStartLocation() {
    var circlel = new createjs.Shape();
    circlel.graphics.beginFill("red").drawCircle(0, 0, (stage.canvas.width) / 11);

    var circlem = new createjs.Shape();
    circlem.graphics.beginFill("rgba(0,0,0, 0.8)").drawCircle(0, 0, (stage.canvas.width) / 11 - 5);


    var container = new createjs.Container();
    container.addChild(circlel, circlem);
    container.x = stage.canvas.width / 2
    container.y = stage.canvas.height * 9 / 10 - (stage.canvas.width) / 15

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
    console.log(player.color);
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
    bubble.name = 'player' + nInName
    nInName++
    stage.addChild(bubble);
}
function updateColor() {
    var arColor = []
    player.color = []
    game.map.forEach(element => {
        element.forEach(bubble => {
            if (bubble.color != null) arColor.push(bubble.color)
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
function radToDeg(x, y) {
    return Math.atan2(y, x) * 180 / Math.PI;
}
function degToRad(angle) {
    return angle * (Math.PI / 180);
}
function getTanAngle(angle) {
    return Math.tan(angle * Math.PI / 180);
}
function renderDotLine() {
    var map = game.map

    if (containerLine) {
        stage.removeChild(containerLine)
        containerLine = new createjs.Container();
    }
    var dotLineArr = []
    var turnCheck = []
    var check = true
    if (player.angle < 90) {
        drawDotLeft()
    } else {
        drawDotRight()
    }
    function setCheck() {
        if (check == true) turnCheck[turnCheck.length - 1] == 0 ? drawDotRight() : drawDotLeft()
    }
    function drawDotLeft() {
        var startX = player.x,
            startY = player.y,
            sideK = startX
        if (dotLineArr.length != 0) {
            startX = dotLineArr[dotLineArr.length - 1].x,
                startY = dotLineArr[dotLineArr.length - 1].y
            sideK = stage.canvas.width
        }
        var cosAngle = Math.abs(Math.cos(degToRad(player.angle)))
        var sideHMax = sideK / cosAngle
        var tanAngle = Math.abs(getTanAngle(player.angle))
        for (var sideH = 0; sideH < sideHMax + 30; sideH += 30) {
            if (sideH > sideHMax) sideH = sideHMax
            var sideKNew = cosAngle * sideH
            var sideD = sideKNew * tanAngle
            if (checkEndLine(startX - sideKNew, startY - sideD)) {
                check = false
                return
            }
            dotLineArr.push({ x: startX - sideKNew, y: startY - sideD })
        }
        if (dotLineArr[dotLineArr.length - 1].y <= 0) check = false
        turnCheck.push(0)
        setCheck()
    }
    function drawDotRight() {
        var startX = player.x,
            startY = player.y,
            sideK = startX
        if (dotLineArr.length != 0) {
            startX = dotLineArr[dotLineArr.length - 1].x,
                startY = dotLineArr[dotLineArr.length - 1].y
            sideK = stage.canvas.width
        }
        var cosAngle = Math.abs(Math.cos(degToRad(180 - player.angle)))

        var sideHMax = sideK / cosAngle
        var tanAngle = Math.abs(getTanAngle(180 - player.angle))
        for (var sideH = 0; sideH < sideHMax + 30; sideH += 30) {
            if (sideH > sideHMax) sideH = sideHMax
            var sideKNew = cosAngle * sideH
            var sideD = sideKNew * tanAngle
            if (checkEndLine(startX + sideKNew, startY - sideD)) {
                check = false
                return
            }
            dotLineArr.push({ x: startX + sideKNew, y: startY - sideD })
        }
        if (dotLineArr[dotLineArr.length - 1].y <= 0) check = false
        turnCheck.push(1)
        setCheck()
    }
    function checkEndLine(x, y) {
        if (y >= 0) {
            var index = lToIndex(x, y)
            return map[index.y][index.x].existing
        }
    }
    dotLineArr.forEach(dot => {
        drawDot(dot.x, dot.y)
    });
    var a = dotLineArr.filter(dot => dot.x == 0 || dot.x == stage.canvas.width)
    destinations = removeDuplicates(a)
    destinations.push(dotLineArr[dotLineArr.length - 1])
    destinations = toReality(destinations)
    stage.addChild(containerLine)

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
function toReality(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].x == stage.canvas.width) arr[i] = { x: arr[i].x - game.bubble.currentWidth, y: arr[i].y }
    }
    var index = lToIndex(arr[arr.length - 1].x, arr[arr.length - 1].y)
    arr[arr.length - 1] = { x: game.map[index.y][index.x].x, y: game.map[index.y][index.x].y }
    return arr
}
function removeDuplicates(arr) {
    var dataArr = arr.map(item => {
        return [JSON.stringify(item), item]
    });
    var maparr = new Map(dataArr);
    return [...maparr.values()]
}
//Kết thúc sự kiện di chuyển player
function moveBubbleEnd() {
    convertBubbles()
    destinations = []
}
//chuyển bubble player to bubble map
function convertBubbles() {
    var bubble = player.bubble.clone()
    containerMain.addChild(bubble)

    var aReality = lToIndex(bubble.x, bubble.y)
    var loacaton = game.map[aReality.y][aReality.x]
    game.map[aReality.y][aReality.x] = { x: loacaton.x, y: loacaton.y, existing: true, bubble: bubble, color: player.currentColor, checked: false, checkAlone: true, vibration: false }
    // console.log(stage.getChildByName('player'+ (nInName-1)));
    stage.removeChild(player.bubble)
    console.log(stage.getChildByName('player' + (nInName - 1)));

    player.bubble = null

    vibration(aReality.x, aReality.y)
}
//Check die bubble
function checkDie(direction, x, y) {
    var index = renderXY(direction, x, y)
    if (game.map[index.y][index.x].existing == true) {
        if (game.map[y][x].color == game.map[index.y][index.x].color && game.map[index.y][index.x].checked == false) {
            updateCheckBubble(index.x, index.y)
        }
    }
}
//set rỗng cho các vị trí không có bubble trên map
function updateLocationEmpty(x, y) {
    var a = game.map[y][x]
    game.map[y][x] = { x: a.x, y: a.y, existing: false, bubble: null, color: null, checked: false, checkAlone: false }
}
// dựng cờ đã check cho bubbles đang được check
function updateCheckBubble(x, y) {
    var a = game.map[y][x]
    game.map[y][x] = { x: a.x, y: a.y, existing: a.existing, bubble: a.bubble, color: a.color, checked: true, checkAlone: false }
    getAdjacent(x, y, 1)
    bubbleRemove.push({ x: x, y: y })
}
// xóa bubbles khi bắn khi thỏa mãn đk
async function removeBubble(x, y) {
    await getAdjacent(x, y, 1)
    if (bubbleRemove.length >= 3) {
        var arrL = [], arrS = []
        bubbleRemove.forEach(index => {
            if (index.y >= y) arrL.push(index)
            else arrS.push(index)
        });
        arrL.sort((a, b) => Number(a.y) - Number(b.y))
        arrS.sort((a, b) => Number(b.y) - Number(a.y))
        var index = 0
        var bubbleDie1 = setInterval(function () {
            if (index <= arrL.length - 1) {
                var a = game.map[arrL[index].y][arrL[index].x]
                containerMain.removeChild(a.bubble)
                bubbleDie(a.color, a.x, a.y)
                a.bubble = null
                updateLocationEmpty(arrL[index].x, arrL[index].y)
                if (arrL.length > arrS.length && index === arrL.length - 1) {
                    clearInterval(bubbleDie1);
                    bubbleRemove = []
                    removeBubbleAlone()
                }
            }
            if (index <= arrS.length - 1) {
                var a = game.map[arrS[index].y][arrS[index].x]
                containerMain.removeChild(a.bubble)
                bubbleDie(a.color, a.x, a.y)
                a.bubble = null
                updateLocationEmpty(arrS[index].x, arrS[index].y)
                if (arrS.length >= arrL.length && index === arrS.length - 1) {
                    clearInterval(bubbleDie1);
                    bubbleRemove = []
                    removeBubbleAlone()
                }
            }
            index++
        }, 90);

    } else {
        bubbleRemove.forEach(i => {
            var a = game.map[i.y][i.x]
            game.map[i.y][i.x] = { x: a.x, y: a.y, existing: a.existing, bubble: a.bubble, color: a.color, checked: false, checkAlone: false, vibration: false }
        });
        bubbleRemove = []
        removeBubbleAlone()
    }
}
// call animation bubble die
function bubbleDie(color, x, y) {
    if (color == 0 || color == 1 || color == 2 || color == 3 || color == 4 || color == 5 || color == 6 || color == 7) {
        var bubble = new createjs.Sprite(spriteBubbles, convertAnimations(color));
        bubble.scaleX = 0.7;
        bubble.scaleY = 0.7;
        bubble.x = x
        bubble.y = y;

        stage.addChild(bubble);
        bubble.on('animationend', handleComplete);
        function handleComplete() {
            stage.removeChild(this)
            bubble = null
        }
    }
    // var bubble = new createjs.Sprite(spriteBubbles, convertAnimations(color));
    // bubble.scaleX = 0.7;
    // bubble.scaleY = 0.7;
    // bubble.x = x
    // bubble.y = y;

    // stage.addChild(bubble);
    // bubble.on('animationend', handleComplete);
    // function handleComplete() {
    //     stage.removeChild(this)
    //     bubble = null
    // }
}
//check bubble alone
function checkAlone(direction, x, y) {
    var index = renderXY(direction, x, y)
    if (game.map[index.y][index.x].existing == true && game.map[index.y][index.x].checkAlone == false) updateCheckAlone(index.x, index.y)
}
function updateCheckAlone(x, y) {
    var a = game.map[y][x]
    game.map[y][x] = { x: a.x, y: a.y, existing: a.existing, bubble: a.bubble, color: a.color, checked: false, checkAlone: true, vibration: false }
    getAdjacent(x, y, 0)
}
async function getBubbleAlone() {
    var arr = []
    var x = 0, y = 0
    await getAdjacent(0, 0, 0)
    game.map.forEach(element => {
        x = 0
        element.forEach(bubble => {
            if (bubble.checkAlone == false && bubble.existing == true) {
                arr.push({ x: x, y: y })
            }
            x++
        });
        y++
    });
    return arr
}
function resetAlone() {
    console.log(game.map);
    var x = 0, y = 0
    game.map.forEach(element => {
        x = 0
        element.forEach(bubble => {
            var a = game.map[y][x]
            game.map[y][x] = { x: a.x, y: a.y, existing: a.existing, bubble: a.bubble, color: a.color, checked: false, checkAlone: false, vibration: false }
            x++
        });
        y++
    });
}
async function removeBubbleAlone() {
    var arr = await getBubbleAlone()
    arr.forEach(i => {
        var a = game.map[i.y][i.x]
        createjs.Tween.get(a.bubble)
            .to({ y: a.bubble.y + 100 }, 500, createjs.Ease.linear)
            .call(() => {
                bubbleDie(a.color, a.bubble.x, a.bubble.y)
                containerMain.removeChild(a.bubble)
                a.bubble = null
                updateLocationEmpty(i.x, i.y)
            })
    });
    setPlayer()
    setStar()
    resetAlone()
}
async function setStar() {
    var complete = await checkComplete()
    if (complete) {
        var image = queue.getResult("star");
        var star = new createjs.Bitmap(image);
        star.scaleX = (stage.canvas.width * 8 / 9) / image.width;
        star.scaleY = (stage.canvas.width * 8 / 9) / image.width;
        star.x = (stage.canvas.width - star.scaleX * image.width) / 2
        star.y = -star.scaleY * image.height
        stage.addChild(star);
        createjs.Tween.get(star)
            .to({ y: stage.canvas.height / 2 - (star.scaleY * image.height) * 2.5 / 3 }, 500, createjs.Ease.linear)
        if (isMobile) {
            canvas.removeEventListener("touchstart", onMouseDown, supportsPassive ? { passive: true } : false);
            canvas.removeEventListener("touchmove", onPressMove, supportsPassive ? { passive: true } : false);
            canvas.removeEventListener("touchend", onMouseUp, supportsPassive ? { passive: true } : false);
        } else {
            canvas.removeEventListener("mousedown", onMouseDown);
            canvas.removeEventListener("mousemove", onPressMove);
            canvas.removeEventListener("mouseup", onMouseUp);
        }
    }
}
//check win
function checkComplete() {
    var complete = true
    game.map.forEach(element => {
        element.forEach(bubble => {
            if (bubble.existing === true && bubble.y != 0) complete = false
        });
    });
    return complete
}
// rung khi bubble player va chamj
async function vibration(x, y) {
    var arr = []
    var a = x, b = y
    await setVibration(x, y)
    var arr1 = delaminations(x, y, 1)
    var arr2 = delaminations(x, y, 2)
    var arr3 = delaminations(x, y, 3)

    await moveVibration(arr1, 7, 1)
    await moveVibration(arr2, 5, 2)
    await moveVibration(arr3, 2, 3)

    function moveVibration(arr, side, turn) {
        arr.forEach(element => {
            var bubbles = game.map[element.y][element.x]
            var oldx = bubbles.x
            var oldy = bubbles.y
            var index = game.map[y][x]
            var newIndex = setMove(index.x, index.y, oldx, oldy, side)
            createjs.Tween.get(bubbles.bubble)
                .to({ x: newIndex.x, y: newIndex.y }, 100)
                .to({ x: oldx, y: oldy }, 100)
        });
        if (turn == 3) { removeBubble(x, y) }
    }
    function setVibration(x, y) {
        if (x < a + 3 && y < b + 3 && x > a - 3 && y > b - 3) {
            x = x - 1 < 0 ? 1 : x
            x = x + 1 > 10 ? 9 : x
            y = y - 1 < 0 ? 1 : y
            y = y + 1 > 22 ? 21 : y
            if (y == 0) {
                checkVibration('Bottom', x, y)
                if (x == 0) {
                    checkVibration('Right', x, y)
                    checkVibration('BottomRight', x, y)
                } else if (x == 10) {
                    checkVibration('Left', x, y)
                    checkVibration('BottomLeft', x, y)
                } else {
                    checkVibration('Left', x, y)
                    checkVibration('Right', x, y)
                    checkVibration('BottomRight', x, y)
                    checkVibration('BottomLeft', x, y)
                }
            } else if (y > 0 && y % 2 == 0) {
                checkVibration('Top', x, y)
                checkVibration('TopRight', x, y)
                checkVibration('Bottom', x, y)
                if (x == 0) {
                    checkVibration('Right', x, y)
                } else if (x == 9) {
                    checkVibration('Left', x, y)
                    checkVibration('BottomLeft', x, y)
                } else {
                    checkVibration('Left', x, y)
                    checkVibration('Right', x, y)
                    checkVibration('BottomRight', x, y)
                }
            } else {
                if (x == 0) {
                    checkVibration('Top', x, y)
                    checkVibration('Right', x, y)
                    checkVibration('Bottom', x, y)
                } else if (x == 10) {
                    checkVibration('Left', x, y)
                    checkVibration('TopLeft', x, y)
                    checkVibration('BottomLeft', x, y)
                } else {
                    checkVibration('Left', x, y)
                    checkVibration('TopLeft', x, y)
                    checkVibration('Top', x, y)
                    checkVibration('Right', x, y)
                    checkVibration('Bottom', x, y)
                    checkVibration('BottomLeft', x, y)
                }
            }
        }
    }
    function checkVibration(direction, x, y) {
        var index = renderXY(direction, x, y)
        if (game.map[index.y][index.x].vibration == false) {
            setBubblesVibration(index.x, index.y, true)
            if (game.map[index.y][index.x].existing == true) {
                arr.push({ x: index.x, y: index.y });
                setVibration(index.x, index.y)
            }
        }
    }
    function setBubblesVibration(x, y, vibration) {
        var bubble = game.map[y][x]
        game.map[y][x] = { x: bubble.x, y: bubble.y, existing: bubble.existing, bubble: bubble.bubble, color: bubble.color, checked: false, checkAlone: false, vibration: vibration }
    }
    function delaminations(x, y, turn) {
        var array = []
        var a = arr.filter(bubble => bubble.y == (y - turn) && bubble.x >= (x - turn) && bubble.x < (x + turn) || bubble.y == (y + turn) && bubble.x >= (x - turn) && bubble.x < (x + turn));
        var b = arr.filter(bubble => bubble.x == (x - turn) && bubble.y >= (y - turn) && bubble.y < (y + turn) || bubble.x == (x + turn) && bubble.y >= (y - turn) && bubble.y < (y + turn));
        var xNew = a.concat(b);
        xNew.forEach(element => {
            if (array.indexOf(element) < 0) array.push(element)
        });
        return array
    }
}
function tick(event) {
    if (update) {
        // update = false;
        stage.update(event);
    }
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
function currentMouse(evt) {
    return isMobile ? { x: evt.changedTouches[0].clientX, y: evt.changedTouches[0].clientY } : { x: evt.layerX, y: evt.layerY }
}
function limitAngle(mouseangle) {
    var lbound = 8;
    var ubound = 172;
    if (mouseangle > ubound && mouseangle < 270) mouseangle = ubound
    if (mouseangle < lbound || mouseangle >= 270) mouseangle = lbound
    return mouseangle
}
function setMove(x1, y1, x2, y2, anpha) {
    x = x2 - x1
    y = y2 - y1
    if (x < 0) {
        var xNew = x2 - anpha
        if (y < 0) {
            var yNew = y2 - ((anpha * (y1 - y2)) / (x1 - x2))
            return ({ x: xNew, y: yNew })
        } else if (y == 0) {
            var yNew = y2
            xNew = x2 - 2 * anpha
            return ({ x: xNew, y: yNew })
        } else {
            var yNew = y2 + ((anpha * (y2 - y1)) / (x1 - x2))
            return ({ x: xNew, y: yNew })
        }
    } else if (x == 0) {
        var xNew = x1
        if (y < 0) {
            var yNew = y2 - 3 * anpha
            return ({ x: xNew, y: yNew })
        } else if (y == 0) {
            var yNew = y2
            return ({ x: xNew, y: yNew })
        } else {
            var yNew = y2 - anpha
            return ({ x: xNew, y: yNew })
        }
    } else {
        var xNew = x2 + anpha
        if (y < 0) {
            var yNew = y2 - ((anpha * (y1 - y2)) / (x2 - x1))
            return ({ x: xNew, y: yNew })
        } else if (y == 0) {
            var yNew = y2

            xNew = x2 + 2 * anpha
            return ({ x: xNew, y: yNew })
        } else {
            var yNew = y2 + ((anpha * (y2 - y1)) / (x2 - x1))
            return ({ x: xNew, y: yNew })
        }
    }
}
function getAdjacent(x, y, die) {
    if (y == 0) {
        die == 1 ? checkDie('Bottom', x, y) : checkAlone('Bottom', x, y)
        if (x == 0) {
            die == 1 ? checkDie('Right', x, y) : checkAlone('Right', x, y)
            die == 1 ? checkDie('BottomRight', x, y) : checkAlone('BottomRight', x, y)
        } else if (x == 10) {
            die == 1 ? checkDie('Left', x, y) : checkAlone('Left', x, y)
            die == 1 ? checkDie('BottomLeft', x, y) : checkAlone('BottomLeft', x, y)
        } else {
            die == 1 ? checkDie('Left', x, y) : checkAlone('Left', x, y)
            die == 1 ? checkDie('Right', x, y) : checkAlone('Right', x, y)
            die == 1 ? checkDie('BottomRight', x, y) : checkAlone('BottomRight', x, y)
            die == 1 ? checkDie('BottomLeft', x, y) : checkAlone('BottomLeft', x, y)
        }
    } else if (y > 0 && y % 2 == 0) {
        die == 1 ? checkDie('Top', x, y) : checkAlone('Top', x, y)
        die == 1 ? checkDie('TopRight', x, y) : checkAlone('TopRight', x, y)
        die == 1 ? checkDie('Bottom', x, y) : checkAlone('Bottom', x, y)
        if (x == 0) {
            die == 1 ? checkDie('Right', x, y) : checkAlone('Right', x, y)
            die == 1 ? checkDie('BottomRight', x, y) : checkAlone('BottomRight', x, y)
        } else if (x == 9) {
            die == 1 ? checkDie('Left', x, y) : checkAlone('Left', x, y)
            die == 1 ? checkDie('BottomLeft', x, y) : checkAlone('BottomLeft', x, y)
        } else {
            die == 1 ? checkDie('Left', x, y) : checkAlone('Left', x, y)
            die == 1 ? checkDie('Right', x, y) : checkAlone('Right', x, y)
            die == 1 ? checkDie('BottomRight', x, y) : checkAlone('BottomRight', x, y)
        }
    } else {
        if (x == 0) {
            die == 1 ? checkDie('Top', x, y) : checkAlone('Top', x, y)
            die == 1 ? checkDie('Right', x, y) : checkAlone('Right', x, y)
            die == 1 ? checkDie('Bottom', x, y) : checkAlone('Bottom', x, y)
        } else if (x == 10) {
            die == 1 ? checkDie('Left', x, y) : checkAlone('Left', x, y)
            die == 1 ? checkDie('TopLeft', x, y) : checkAlone('TopLeft', x, y)
            die == 1 ? checkDie('BottomLeft', x, y) : checkAlone('BottomLeft', x, y)
        } else {
            die == 1 ? checkDie('Left', x, y) : checkAlone('Left', x, y)
            die == 1 ? checkDie('TopLeft', x, y) : checkAlone('TopLeft', x, y)
            die == 1 ? checkDie('Top', x, y) : checkAlone('Top', x, y)
            die == 1 ? checkDie('Right', x, y) : checkAlone('Right', x, y)
            die == 1 ? checkDie('Bottom', x, y) : checkAlone('Bottom', x, y)
            die == 1 ? checkDie('BottomLeft', x, y) : checkAlone('BottomLeft', x, y)
        }
    }
}
function renderXY(direction, x, y) {
    var xNew = x, yNew = y
    switch (direction) {
        case "Left":
            xNew = x - 1
            break;
        case "TopLeft":
            xNew = x - 1
            yNew = y - 1
            break;

        case "Top":
            yNew = y - 1
            break;

        case "TopRight":
            xNew = x + 1
            yNew = y - 1
            break;

        case "Right":
            xNew = x + 1
            break;

        case "BottomRight":
            xNew = x + 1
            yNew = y + 1
            break;

        case "Bottom":
            yNew = y + 1
            break;

        case "BottomLeft":
            xNew = x - 1
            yNew = y + 1
            break;
    }
    return { x: xNew, y: yNew }
}
// Event
function onMouseDown(evt) {
    pressMove = true
    var location = currentMouse(evt)
    player.angle = limitAngle(radToDeg(location.x - player.x, location.y - player.y) + 180)
}
function onPressMove(evt) {
    if (pressMove) {
        var location = currentMouse(evt)
        var anpha = radToDeg(location.x - player.x, location.y - player.y) + 180
        if (anpha >= 8 && anpha <= 172) {
            player.angle = limitAngle(anpha)
            renderDotLine()
        } else {
            stage.removeChild(containerLine)
            containerLine = new createjs.Container();
            destinations = []
        }
    }
}
function onMouseUp(evt) {
    pressMove = false
    // var location = currentMouse(evt)
    // var anpha = radToDeg(location.x - player.x, location.y - player.y) + 180
    // if (anpha >= 8 && anpha <= 172) {
    //     player.angle = limitAngle(anpha)
    //     renderDotLine()
    // }
    // if (containerLine) {
    //     stage.removeChild(containerLine)
    //     containerLine = new createjs.Container();
    if (destinations.length == 0) {
        return null;
    }
    if (destinations.length == 1) {
        createjs.Tween.get(player.bubble)
            .to({ x: destinations[0].x, y: destinations[0].y }, 300, createjs.Ease.linear)
            .call(moveBubbleEnd)
    } else {
        createjs.Tween.get(player.bubble)
            .to({ x: destinations[0].x, y: destinations[0].y }, 300, createjs.Ease.linear)
        var i = 1
        var moveBubble = setInterval(function () {
            createjs.Tween.get(player.bubble)
                .to({ x: destinations[i].x, y: destinations[i].y }, 300, createjs.Ease.linear)
            if (i == destinations.length - 1) clearInterval(moveBubble);
            i++
        }, 300);
        setTimeout(moveBubbleEnd, 300 * destinations.length);
    }
    stage.removeChild(containerLine)
    containerLine = new createjs.Container();
    // }

}
