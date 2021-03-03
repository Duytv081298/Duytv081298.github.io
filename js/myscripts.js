$(document).ready(init);

var width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

var height = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;
var heightCV = height,
    widthCV = height / 1.7
// var leftC, topC, rightC, bottomC

var stage = new createjs.Stage("myCanvas");

var canvas, spriteBubbles
// spriteDinosaurs, spriteBird
var containerMain = new createjs.Container();


var containerLine = new createjs.Container();

var locationArr = []
var levels, map, widthB = heightB = 110, bubbleBitmap,
    touchBubbles = [],
    arrEndPoint = [],
    bubbleRemove = [],
    bubble = {
        b_Blue: null,
        b_Pink: null,
        b_Green: null,
        b_Cyan: null,
        b_Purple: null,
        b_Red: null,
        b_Yellow: null,
    },
    queue

var bublesPlayers = [], colorPlayers = []

// Hàm khởi tạo
async function init() {
    handleResize()
    loadAnimations()
    await getData()
    setStage()

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", () => {
        stage.update();
    });
}

function loadAnimations() {
    spriteBubbles = new createjs.SpriteSheet({
        framerate: 10,
        "images": ["../data/images/dino.png"],
        "frames": { "regX": 0, "height": 93, "count": 49, "regY": 0, "width": 93 },
        "animations": {
            "run_blue": [-1, 6, false],
            "run_red": [35, 41, false],
            "run_yellow": [42, 48, false],
            "run-green": [14, 20, false],
            "run_pink": [21, 27, false],
            "run_purple": [28, 34, false],
            "run_cyan": [7, 13, false],
        }
    });
}
function setDinosaursAndBird() {
    var image = new Image();
    image = queue.getResult("dinosaur");
    var dinosaur = new createjs.Bitmap(image);
    dinosaur.scaleX = 0.25;
    dinosaur.scaleY = 0.25;
    dinosaur.x = stage.canvas.width / 2 - (dinosaur.image.width * 0.25) * 1.5
    dinosaur.y = stage.canvas.height - dinosaur.image.height * 0.25 - 100;

    image = queue.getResult("owl");
    var bird = new createjs.Bitmap(image);
    bird.scaleX = 0.15;
    bird.scaleY = 0.15;
    bird.x = stage.canvas.width / 2 + (dinosaur.image.width * 0.25) * 0.5
    bird.y = stage.canvas.height - bird.image.height * 0.15 - 100;
    stage.addChild(dinosaur, bird);
    stage.update();
}
function bubbleDie(color, x, y) {
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
    levels = await getLevel()
    map = levels.bubbles
    locationArr = setLocationXY()
    await loadImage()
}
// đọc file levels map
async function getLevel() {
    var map
    await $.getJSON("../data/levels/level_0.json", function (data) {
        map = data
    });
    return map
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
    bubble.b_Blue = queue.getResult("B_Blue");
    bubble.b_Red = queue.getResult("B_Red");
    bubble.b_Yellow = queue.getResult("B_Yellow");
    bubble.b_Green = queue.getResult("B_Green");
    bubble.b_Pink = queue.getResult("B_Pink");
    bubble.b_Purple = queue.getResult("B_Purple");
    bubble.b_Cyan = queue.getResult("B_Cyan");
    setBackground()
    // setDinosaursAndBird()
    renderBubble()
    setStartLocation()
    setBubble()
    setDinosaursAndBird()

}
//conver từ id đối tượng ra hình ảnh
function convertIdtoBubble(id) {
    switch (id) {
        case 0:
            // return bubble.b_Blue
            return queue.getResult("B_Blue");
        case 1:
            // return bubble.b_Red
            return queue.getResult("B_Red");
        case 2:
            // return bubble.b_Yellow
            return queue.getResult("B_Yellow");
        case 3:
            // return bubble.b_Green
            return queue.getResult("B_Green");
        case 4:
            // return bubble.b_Pink
            return queue.getResult("B_Pink");
        case 5:
            // return bubble.b_Purple
            return queue.getResult("B_Purple");
        case 6:
            // return bubble.b_Cyan
            return queue.getResult("B_Cyan");
        default:
            return null;
    }

}

function setStage() {
    canvas = document.getElementById("myCanvas");
    console.log(height);
    canvas.height = height
    canvas.width = height / 1.7
    console.log('canvas.height: ' + canvas.height);
    console.log('canvas.width: ' + canvas.width);


    var fader = new createjs.Shape();
    containerMain.addChild(fader);
    var gfx = fader.graphics;
    gfx.beginFill("rgba(0,0,0, 0.3)").drawRect(0, 0, widthCV, heightCV).endFill();

}
function setBackground() {
    var image = new Image();
    image = queue.getResult("bg");
    var bg = new createjs.Bitmap(image);
    bg.scaleX = stage.canvas.width / image.width;
    bg.scaleY = stage.canvas.height / image.height;
    stage.addChild(bg);
    stage.update();

    // var image = new Image();
    // image.src = "../data/images/bg1.png";
    // image.onload = function () {
    //     var bg = new createjs.Bitmap(image);
    //     bg.scaleX = stage.canvas.width / image.width;
    //     bg.scaleY = stage.canvas.height / image.height;
    //     stage.addChild(bg);
    //     stage.update();
    // }
}
// khởi tạo bubbles mặc định
function renderBubble() {
    map.forEach(locationBubble => {
        var image = new Image();
        var image = convertIdtoBubble(locationBubble.id)
        var bubble = new createjs.Bitmap(image);
        bubble.scaleX = 0.5;
        bubble.scaleY = 0.5;
        var a = locationArr[locationBubble.y][locationBubble.x]
        // updateLocationXY(x, y, existing)
        bubble.x = a.x
        bubble.y = a.y
        containerMain.addChild(bubble)
        locationArr[locationBubble.y][locationBubble.x] = { x: a.x, y: a.y, existing: true, bubble: bubble, color: locationBubble.id, checked: false, checkAlone: false, vibration: false }
    });
    stage.addChild(containerMain)
    updateColor()
}
// khởi tọa vòng tròn đỏ
function setStartLocation() {
    var circlel = new createjs.Shape();
    circlel.graphics.beginFill("red").drawCircle(0, 0, 50);
    circlel.x = 50;
    circlel.y = 50;

    var circlem = new createjs.Shape();
    circlem.graphics.beginFill("rgba(0,0,0, 0.8)").drawCircle(0, 0, 45);
    circlem.x = 50;
    circlem.y = 50;

    var container = new createjs.Container();
    container.addChild(circlel, circlem);
    container.x = (stage.canvas.width - 100) / 2
    container.y = stage.canvas.height * 9 / 10 - 100

    stage.addChild(container);
}
// tạo đường định hướng
function roadPrediction(x, y, move) {
    arrEndPoint = []
    extendedPoint = toBorder(x, y, stage.canvas.width / 2, stage.canvas.height * 9 / 10 - 100, 0, stage.canvas.width, stage.canvas.height, 0)
    arrEndPoint.push(extendedPoint)
    if (extendedPoint.y > 0) arrEndPoint.push(toBorder(stage.canvas.width / 2, extendedPoint.y - ((stage.canvas.height * 9 / 10 - 100) - extendedPoint.y), extendedPoint.x, extendedPoint.y, 0, stage.canvas.width, stage.canvas.height, 0));
    if (containerLine != null) {
        stage.removeChild(containerLine)
        containerLine = null
        containerLine = new createjs.Container();
        stage.update()
    }
    var line = new createjs.Shape();
    line.graphics.setStrokeStyle(10, "round").dash([1, 30]).beginStroke("#F00");
    containerLine.addChild(line);
    line.graphics.moveTo(stage.canvas.width / 2, stage.canvas.height * 9 / 10 - 100);
    line.graphics.lineTo(arrEndPoint[0].x, arrEndPoint[0].y);
    line.graphics.endStroke();

    if (arrEndPoint.length > 1) {
        var line = new createjs.Shape();
        line.graphics.setStrokeStyle(10, "round").dash([1, 30]).beginStroke("#F00");
        containerLine.addChild(line);
        line.graphics.moveTo(arrEndPoint[0].x, arrEndPoint[0].y);
        line.graphics.lineTo(arrEndPoint[1].x, arrEndPoint[1].y);
        line.graphics.endStroke();
    }
    if (move) {
        if (arrEndPoint.length == 1) {
            var convert = lToC(arrEndPoint[0].x, arrEndPoint[0].y)
            touchBubbles.push({ x: convert.x, y: convert.y })
        } else {
            touchBubbles.push({ x: arrEndPoint[0].x, y: arrEndPoint[0].y })
            touchBubbles.push({ x: arrEndPoint[1].x, y: arrEndPoint[1].y })
        }
    }
    stage.addChild(containerLine)
    stage.update();
}
// xác định giao điểm đường địn hướng và cạnh bên
function toBorder(x1, y1, x2, y2, left, top, right, bottom) {
    var dx, dy, py, vx, vy;

    vx = x2 - x1;
    vy = y2 - y1;
    dx = vx < 0 ? left : right;
    dy = py = vy < 0 ? top : bottom;
    if (vx === 0) {
        dx = x1;
    } else if (vy === 0) {
        dy = y1;
    } else {
        dy = y1 + (vy / vx) * (dx - x1);
        if (dy < top || dy > bottom) {
            dx = x1 + (vx / vy) * (py - y1);
            dy = py;
        }
    }
    var newY = dy,
        newX = dx
    if (dx > stage.canvas.width) {
        newX = stage.canvas.width
        newY = (y1 * (dx - stage.canvas.width)) / (dx - stage.canvas.width / 2)
    }
    if (dx < 0) {
        newX = 0
        newY = (y1 * (Math.abs(dx))) / ((Math.abs(dx)) + (stage.canvas.width / 2))
    }
    return { x: newX, y: newY }
}
// Xóa đường định hướng
function remoLine() {
    stage.removeChild(containerLine)
    containerLine = null
    containerLine = new createjs.Container();
}
//khởi tạo map rỗng
function setLocationXY() {
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
// chuyển bị trí thực tế trả ra đối tượng tồn tại trong vị trí tương đối
function lToC(x, y) {
    x -= (stage.canvas.width - (widthB / 2) * 9) / 10
    var estimateY = Math.round(y / (heightB / 2.5))
    estimateY % 2 == 0 ? x -= (widthB / 4 - 5) : x += 0
    var estimateX = Math.round(x / (widthB / 2.3))
    if (estimateX < 0) estimateX = 0
    if (estimateX > 10) estimateX = 10
    return locationArr[estimateY][estimateX]
}
// chuyển bị trí thực tế thành vị trí trên map
function lToIndex(x, y) {
    x -= (stage.canvas.width - (widthB / 2) * 9) / 10
    var estimateY = Math.round(y / (heightB / 2.5))
    estimateY % 2 == 0 ? x -= (widthB / 4 - 5) : x += 0
    var estimateX = Math.round(x / (widthB / 2.3))
    if (estimateX < 0) estimateX = 0
    if (estimateX > 10) estimateX = 10
    return ({ x: estimateX, y: estimateY })
}
//khởi tạo bubble player
function setBubble() {
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
// dic chuyển bubble player
function bubbleMove() {
    var collisionOccurred = null

    if (touchBubbles.length == 1) {
        var x1 = touchBubbles[0].x
        var y1 = touchBubbles[0].y
        createjs.Tween.get(bubbleBitmap)
            .to({ x: x1 == 0 ? x1 : x1 - widthB / 4, y: y1 }, 500, createjs.Ease.linear)
            .on("change", collision, null, false, { turn: 2 })
        setTimeout(() => { if (collisionOccurred == null) convertBubbles() }, 500);
    } else {
        var x1 = touchBubbles[0].x
        var y1 = touchBubbles[0].y
        var index = lToIndex(touchBubbles[1].x, touchBubbles[1].y)
        createjs.Tween.get(bubbleBitmap)
            .to({ x: x1 == 0 ? x1 : x1 - widthB / 4, y: y1 }, 500, createjs.Ease.linear)
            .on("change", collision, null, false, { turn: 1 });
        setTimeout(function () { if (touchBubbles.length != 0) move(touchBubbles[1].x, touchBubbles[1].y) }, 500);

    }
    function move(x, y) {
        touchBubbles = [];
        setTimeout(() => {
            if (collisionOccurred == null) convertBubbles()
        }, 500);
        createjs.Tween.get(bubbleBitmap)
            .to({ x: x == 0 ? x : x - widthB / 4, y: y }, 500, createjs.Ease.linear)
            .on("change", collision, null, false, { turn: 2 })

    }

    // // bắt sự kiện ki bubble đi chuyển
    var lArr = []
    function collision(evt, data) {
        var location = lToC(evt.target.target.x, evt.target.target.y)

        lArr.push(location)
        if (location.existing === true) {
            touchBubbles = [];
            collisionOccurred = 'collision'
            var index = lToIndex(lArr[lArr.length - 2].x, lArr[lArr.length - 2].y)
            convertBubbles(index.x, index.y)
            lArr = []
        }
    }

    // // chuyển bubble player to bubble mặc định
    function convertBubbles(lx, ly) {
        createjs.Tween.removeTweens(bubbleBitmap);
        var a = lToIndex(bubbleBitmap.x, bubbleBitmap.y)

        var bubble = bubbleBitmap.clone()
        bubble.x = locationArr[a.y][a.x].x
        bubble.y = locationArr[a.y][a.x].y
        if (lx && ly) {
            bubble.x = locationArr[ly][lx].x
            bubble.y = locationArr[ly][lx].y
        }
        containerMain.addChild(bubble)

        var index = lToC(bubble.x, bubble.y)
        var aReality = lToIndex(bubble.x, bubble.y)

        locationArr[aReality.y][aReality.x] = { x: index.x, y: index.y, existing: true, bubble: bubble, color: bublesPlayers[0].color, checked: false, checkAlone: true, vibration: false }

        stage.removeChild(bubbleBitmap)
        bubbleBitmap = null
        bublesPlayers = []

        // bubbleRemove.push({ x: index.x, y: index.y })

        vibration(aReality.x, aReality.y)

        setBubble()
        stage.clear();
        stage.update();
        newX = null
        newY = null
    }
}
//check va chạm bubble player and bubble mặc định
function checkBubble(x, y) {
    if (x == 0) {
        if (y == 0) {
            checkRight(x, y)
            checkBottomRight(x, y)
            checkbBottom(x, y)
        } else {
            checkTop(x, y)
            checkTopRight(x, y)
            checkRight(x, y)
            checkBottomRight(x, y)
            checkbBottom(x, y)
        }

    } else if (x == 10) {
        if (y == 0) {
            checkLeft(x, y)
            checkbBottom(x, y)
            checkBottomLeft(x, y)
        } else {
            checkbBottom(x, y)
            checkBottomLeft(x, y)
            checkLeft(x, y)
            checkTopLeft(x, y)
            checkTop(x, y)
        }

    } else if (y == 0) {
        checkLeft(x, y)
        checkRight(x, y)
        checkBottomRight(x, y)
        checkbBottom(x, y)
        checkBottomLeft(x, y)
    } else {
        checkLeft(x, y)
        checkTopLeft(x, y)
        checkTop(x, y)
        checkTopRight(x, y)
        checkRight(x, y)
        checkBottomRight(x, y)
        checkbBottom(x, y)
        checkBottomLeft(x, y)
    }
}
function checkLeft(x, y) {
    if (locationArr[y][x - 1].existing == true) {
        if (locationArr[y][x].color == locationArr[y][x - 1].color && locationArr[y][x - 1].checked == false) {
            updateCheckBubble(x - 1, y)
        }
    }
}
function checkTopLeft(x, y) {
    if (locationArr[y - 1][x - 1].existing == true) {
        if (locationArr[y][x].color == locationArr[y - 1][x - 1].color && locationArr[y - 1][x - 1].checked == false) {
            updateCheckBubble(x - 1, y - 1)
        }
    }
}
function checkTop(x, y) {
    if (locationArr[y - 1][x].existing == true) {
        if (locationArr[y][x].color == locationArr[y - 1][x].color && locationArr[y - 1][x].checked == false) {
            updateCheckBubble(x, y - 1)
        }
    }
}
function checkTopRight(x, y) {
    if (locationArr[y - 1][x + 1].existing == true) {
        if (locationArr[y][x].color == locationArr[y - 1][x + 1].color && locationArr[y - 1][x + 1].checked == false) {
            updateCheckBubble(x + 1, y - 1)
        }
    }
}
function checkRight(x, y) {
    if (locationArr[y][x + 1].existing == true) {
        if (locationArr[y][x].color == locationArr[y][x + 1].color && locationArr[y][x + 1].checked == false) {
            updateCheckBubble(x + 1, y)
        }
    }
}
function checkBottomRight(x, y) {
    if (locationArr[y + 1][x + 1].existing == true) {
        if (locationArr[y][x].color == locationArr[y + 1][x + 1].color && locationArr[y + 1][x + 1].checked == false) {
            updateCheckBubble(x + 1, y + 1)
        }
    }
}
function checkbBottom(x, y) {
    if (locationArr[y + 1][x].existing == true) {
        if (locationArr[y][x].color == locationArr[y + 1][x].color && locationArr[y + 1][x].checked == false) {
            updateCheckBubble(x, y + 1)
        }
    }
}
function checkBottomLeft(x, y) {
    if (locationArr[y + 1][x - 1].existing == true) {
        if (locationArr[y][x].color == locationArr[y + 1][x - 1].color && locationArr[y + 1][x - 1].checked == false) {
            updateCheckBubble(x - 1, y + 1)
        }
    }
}
//set rỗng cho các vị trí không có bubble trên map
function updateLocationEmpty(x, y) {
    var a = locationArr[y][x]
    locationArr[y][x] = { x: a.x, y: a.y, existing: false, bubble: null, color: null, checked: false, checkAlone: false }
}
// dựng cờ đã check cho bubbles đang được check
function updateCheckBubble(x, y) {
    var a = locationArr[y][x]
    locationArr[y][x] = { x: a.x, y: a.y, existing: a.existing, bubble: a.bubble, color: a.color, checked: true, checkAlone: false }
    bubbleRemove.push({ x: x, y: y })
    checkBubble(x, y)
}
// xóa bubbles khi bắn khi thỏa mãn đk
async function removeBubble(x, y) {
    await checkBubble(x, y)
    if (bubbleRemove.length >= 3) {
        bubbleRemove.forEach(i => {
            var a = locationArr[i.y][i.x]
            containerMain.removeChild(a.bubble)
            bubbleDie(a.color, a.x, a.y)
            a.bubble = null
            updateLocationEmpty(i.x, i.y)
        });
        bubbleRemove = []
        removeBubbleAlone()
        setStar()
    } else {
        bubbleRemove.forEach(i => {
            var a = locationArr[i.y][i.x]
            locationArr[i.y][i.x] = { x: a.x, y: a.y, existing: a.existing, bubble: a.bubble, color: a.color, checked: false, checkAlone: false, vibration: false }
        });
        bubbleRemove = []
        removeBubbleAlone()
    }

}

(createjs.Graphics.Dash = function (instr) {
    if (instr == null) { instr = [0]; }
    this.instr = instr;
}).prototype.exec = function (ctx) {
    ctx.setLineDash(this.instr);
};
createjs.Graphics.prototype.dash = function (instr) {
    return this.append(new createjs.Graphics.Dash(instr));
}
function updateColor() {
    var arColor = []
    colorPlayers = []
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
    colorPlayers = colorPlayers.sort()
}
window.addEventListener("resize", handleResize);
function handleResize() {
    var w = window.innerWidth - 2;
    var h = window.innerHeight - 2;
    stage.canvas.width = h / 1.7;
    stage.canvas.height = h;

    // leftC = new createjs.Shape();
    // leftC.graphics.dr(-1, 0, 1, stage.canvas.height);


    // topC = new createjs.Shape();
    // topC.graphics.dr(0, -1, stage.canvas.width, 1);

    // rightC = new createjs.Shape();
    // rightC.graphics.dr(stage.canvas.width, 0, 1, stage.canvas.height);

    // bottomC = new createjs.Shape();
    // bottomC.graphics.dr(0, stage.canvas.height, stage.canvas.width, 1);

    // leftC.setBounds(-1, 0, 1, stage.canvas.height);
    // topC.setBounds(0, -1, stage.canvas.width, 1);
    // rightC.setBounds(stage.canvas.width, 0, 1, stage.canvas.height)
    // bottomC.setBounds(0, stage.canvas.height, stage.canvas.width, 1)

    stage.update();
}
//Bắt sự kiện containerMain
var pressmove = containerMain.on("pressmove", function (evt) {
    roadPrediction(evt.stageX, evt.stageY)
    stage.update();
});
var pressup = containerMain.on("pressup", function (evt) {
    remoLine()
    roadPrediction(evt.stageX, evt.stageY, 'move')
    remoLine()
    bubbleMove()
});
var mousedown = containerMain.on("mousedown", function (evt) {

    roadPrediction(evt.stageX, evt.stageY)
});
function checkBubbleAlone(x, y) {
    if (x == 0) {
        if (y == 0) {
            checkRight(x, y)
            checkBottomRight(x, y)
            checkbBottom(x, y)
        } else {
            checkTop(x, y)
            checkTopRight(x, y)
            checkRight(x, y)
            checkBottomRight(x, y)
            checkbBottom(x, y)
        }
    } else if (x == 10) {
        if (y == 0) {
            checkLeft(x, y)
            checkbBottom(x, y)
            checkBottomLeft(x, y)
        } else {
            checkbBottom(x, y)
            checkBottomLeft(x, y)
            checkLeft(x, y)
            checkTopLeft(x, y)
            checkTop(x, y)
        }

    } else if (y == 0) {
        checkLeft(x, y)
        checkRight(x, y)
        checkBottomRight(x, y)
        checkbBottom(x, y)
        checkBottomLeft(x, y)
    } else {
        checkLeft(x, y)
        checkTopLeft(x, y)
        checkTop(x, y)
        checkTopRight(x, y)
        checkRight(x, y)
        checkBottomRight(x, y)
        checkbBottom(x, y)
        checkBottomLeft(x, y)
    }
    function checkLeft(x, y) {
        if (locationArr[y][x - 1].existing == true && locationArr[y][x - 1].checkAlone == false) updateCheckAlone(x - 1, y)
    }
    function checkTopLeft(x, y) {
        if (locationArr[y - 1][x - 1].existing == true && locationArr[y - 1][x - 1].checkAlone == false) updateCheckAlone(x - 1, y - 1)
    }

    function checkTop(x, y) {
        if (locationArr[y - 1][x].existing == true && locationArr[y - 1][x].checkAlone == false) updateCheckAlone(x, y - 1)

    }
    function checkTopRight(x, y) {
        if (locationArr[y - 1][x + 1].existing == true && locationArr[y - 1][x + 1].checkAlone == false) updateCheckAlone(x + 1, y - 1)
    }
    function checkRight(x, y) {
        if (locationArr[y][x + 1].existing == true && locationArr[y][x + 1].checkAlone == false) updateCheckAlone(x + 1, y)
    }
    function checkBottomRight(x, y) {
        if (locationArr[y + 1][x + 1].existing == true && locationArr[y + 1][x + 1].checkAlone == false) updateCheckAlone(x + 1, y + 1)
    }
    function checkbBottom(x, y) {
        if (locationArr[y + 1][x].existing == true && locationArr[y + 1][x].checkAlone == false) updateCheckAlone(x, y + 1)
    }
    function checkBottomLeft(x, y) {
        if (locationArr[y + 1][x - 1].existing == true && locationArr[y + 1][x - 1].checkAlone == false) updateCheckAlone(x - 1, y + 1)
    }
    function updateCheckAlone(x, y) {
        var a = locationArr[y][x]
        locationArr[y][x] = { x: a.x, y: a.y, existing: a.existing, bubble: a.bubble, color: a.color, checked: false, checkAlone: true, vibration: false }
        checkBubbleAlone(x, y)
    }
}
async function getBubbleAlone() {
    var arr = []
    var x = 0, y = 0
    await checkBubbleAlone(0, 0)
    locationArr.forEach(element => {
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
    var x = 0, y = 0
    locationArr.forEach(element => {
        x = 0
        element.forEach(bubble => {
            var a = locationArr[y][x]
            locationArr[y][x] = { x: a.x, y: a.y, existing: a.existing, bubble: a.bubble, color: a.color, checked: false, checkAlone: false, vibration: false }
            x++
        });
        y++
    });
}
async function removeBubbleAlone() {
    var arr = await getBubbleAlone()
    arr.forEach(i => {
        var a = locationArr[i.y][i.x]
        containerMain.removeChild(a.bubble)
        a.bubble = null
        updateLocationEmpty(i.x, i.y)
    });
    setStar()
    resetAlone()
}
function checkComplete() {
    var complete = true
    locationArr.forEach(element => {
        element.forEach(bubble => {
            if (bubble.existing === true && bubble.y != 0) complete = false
        });
    });
    return complete
}
async function setStar() {
    var complete = await checkComplete()
    console.log(complete);
    if (complete) {
        var image = queue.getResult("star");
        var star = new createjs.Bitmap(image);
        star.scaleX = 0.6;
        star.scaleY = 0.6;
        star.x = stage.canvas.width / 2 - (star.image.width * 0.6) / 2
        star.y = star.image.height * 0.6
        stage.addChild(star);
        stage.update();
        createjs.Tween.get(star)
            .to({ y: stage.canvas.height / 2 - (star.image.height * 0.6) * 2 / 3 }, 500, createjs.Ease.linear)

        containerMain.off("pressmove", pressmove)
        containerMain.off("pressup", pressup)
        containerMain.off("mousedown", mousedown)
    }
}
async function vibration(x, y) {
    var arr = []
    var a = x, b = y
    var arr = await setVibration(x, y)
    var arr1 = delaminations(x, y, 1)
    var arr2 = delaminations(x, y, 2)
    var arr3 = delaminations(x, y, 3)

    arr1.forEach(element => {
        var bubbles = locationArr[element.y][element.x]
        createjs.Tween.get(bubbles.bubble)
            .to({ y: bubbles.bubble.y - 5 }, 100)
            .to({ y: bubbles.bubble.y }, 100)
        // containerMain.removeChild(element.bubble)
    });
    setTimeout(function () {
        arr2.forEach(element => {

            var bubbles = locationArr[element.y][element.x]
            createjs.Tween.get(bubbles.bubble)
                .to({ y: bubbles.bubble.y - 5 }, 100)
                .to({ y: bubbles.bubble.y }, 100)
            // containerMain.removeChild(element.bubble)
        });
    }
        , 200);
    setTimeout(function () {
        arr3.forEach(element => {

            var bubbles = locationArr[element.y][element.x]
            createjs.Tween.get(bubbles.bubble)
                .to({ y: bubbles.bubble.y - 5 }, 100)
                .to({ y: bubbles.bubble.y }, 100)
            // containerMain.removeChild(element.bubble)
        });
    }
        , 400);
    setTimeout(function () {
        removeBubble(x, y)
    }
        , 600);
    function setVibration(x, y) {
        if (x < a + 3 && y < b + 3 && x > a - 3 && y > b - 3) {
            x = x - 1 < 0 ? 1 : x
            x = x + 1 > 10 ? 9 : x
            y = y - 1 < 0 ? 1 : y
            y = y + 1 > 22 ? 21 : y
            if (locationArr[y][x - 1].vibration == false) {
                setBubblesVibration(x - 1, y, true)
                if (locationArr[y][x - 1].existing == true) {
                    arr.push({ x: x - 1, y: y });
                }
                setVibration(x - 1, y)
            }
            if (locationArr[y - 1][x - 1].vibration == false) {
                setBubblesVibration(x - 1, y - 1, true)
                if (locationArr[y - 1][x - 1].existing == true) {
                    arr.push({ x: x - 1, y: y - 1 });
                }
                setVibration(x - 1, y - 1)
            }
            if (locationArr[y - 1][x].vibration == false) {
                setBubblesVibration(x, y - 1, true)
                if (locationArr[y - 1][x].existing == true) {
                    arr.push({ x: x, y: y - 1 });
                }
                setVibration(x, y - 1)
            }
            if (locationArr[y - 1][x + 1].vibration == false) {
                setBubblesVibration(x + 1, y - 1, true)
                if (locationArr[y - 1][x + 1].existing == true) {
                    arr.push({ x: x + 1, y: y - 1 });

                }
                setVibration(x + 1, y - 1)
            }
            if (locationArr[y][x + 1].vibration == false) {
                setBubblesVibration(x + 1, y, true)
                if (locationArr[y][x + 1].existing == true) {
                    arr.push({ x: x + 1, y: y });
                }
                setVibration(x + 1, y)
            }
            if (locationArr[y + 1][x + 1].vibration == false) {
                setBubblesVibration(x + 1, y + 1, true)
                if (locationArr[y + 1][x + 1].existing == true) {
                    arr.push({ x: x + 1, y: y + 1 });
                }
                setVibration(x + 1, y + 1)
            }
            if (locationArr[y + 1][x].vibration == false) {
                setBubblesVibration(x, y + 1, true)
                if (locationArr[y + 1][x].existing == true) {
                    arr.push({ x: x, y: y + 1 });
                }
                setVibration(x, y + 1)
            }
            if (locationArr[y + 1][x - 1].vibration == false) {
                setBubblesVibration(x - 1, y + 1, true)
                if (locationArr[y + 1][x - 1].existing == true) {
                    arr.push({ x: x - 1, y: y + 1 });
                }
                setVibration(x - 1, y + 1)
            }
        }
        return arr
    }

    function setBubblesVibration(x, y, vibration) {
        var bubble = locationArr[y][x]
        locationArr[y][x] = { x: bubble.x, y: bubble.y, existing: bubble.existing, bubble: bubble.bubble, color: bubble.color, checked: false, checkAlone: false, vibration: vibration }

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