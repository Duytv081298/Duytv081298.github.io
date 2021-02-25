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

var canvas
var containerMain = new createjs.Container();
stage.addChild(containerMain)

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
    await getData()
    setStage()
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", stage);
}
async function getData() {
    levels = await getLevel()
    map = levels.bubbles
    locationArr = setLocationXY()
    await loadImage()
    setStartLocation()
}
// đọc file levels map
async function getLevel() {
    var map
    await $.getJSON("../data/levels/level_0.json", function (data) {
        map = data
    });
    console.log(map);
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
        { src: 'bg1.png', id: 'bg' }
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

    renderBubble()
    setBubble()
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
    console.log(image.width);
    bg.scaleX = stage.canvas.width / image.width;
    bg.scaleY = stage.canvas.height / image.height;
    stage.addChild(bg);
    stage.update();
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
        locationArr[locationBubble.y][locationBubble.x] = { x: a.x, y: a.y, existing: true, bubble: bubble, color: locationBubble.id, checked: false, checkAlone: false }
    });
    console.log(locationArr);
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

        locationArr[aReality.y][aReality.x] = { x: index.x, y: index.y, existing: true, bubble: bubble, color: bublesPlayers[0].color, checked: false, checkAlone: false }

        stage.removeChild(bubbleBitmap)
        bubbleBitmap = null
        bublesPlayers = []

        // bubbleRemove.push({ x: index.x, y: index.y })
        removeBubble(aReality.x, aReality.y)

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
            a.bubble = null
            updateLocationEmpty(i.x, i.y)
        });
        bubbleRemove = []
        getBubbleAlone()
    } else {
        bubbleRemove.forEach(i => {
            var a = locationArr[i.y][i.x]
            locationArr[i.y][i.x] = { x: a.x, y: a.y, existing: a.existing, bubble: a.bubble, color: a.color, checked: false, checkAlone: false }
        });
        bubbleRemove = []
    }

}

// var screenType = {
//     isMobileScreen: function () {
//         if (deviceIs.iPhone || deviceIs.iPod || deviceIs.BB || deviceIs.webOS || deviceIs.mobile || (currentRES.width <= 480 && currentRES.height <= 720)) {
//             return true;
//         }
//         return false;
//     }
// };

// var deviceIs = {
//     mobile: agent.match(/Android; Mobile|opera mini|opera mobi|skyfire|maemo|windows phone|palm|iemobile|symbian|symbianos|fennec/i),
//     iPhone: agent.match(/iPhone/i),
//     iPad: agent.match(/ipad/i),
//     tab: agent.match(/ipad|android 3|gt-p7500|sch-i800|playbook|tablet|kindle|gt-p1000|sgh-t849|shw-m180s|a510|a511|a100|dell streak|silk/i),
//     iPod: agent.match(/iPod/i),
//     BB: agent.match(/BlackBerry/i),
//     webOS: agent.match(/webOS/i)
// };


// var stage = new createjs.Stage('myCanvas');
// var dragon = new createjs.Spine("../data/spine/babydino/Dinobaby_green.atlas", "../data/spine/babydino/Dinobaby_green.json");


// dragon.setTransform(300, 220, 1, 1);

// dragon.onComplete = function(){
//     console.log(dragon.width);
//   console.log(dragon);
//   dragon.state.setAnimationByName(0, 'flying', true);
//   stage.addChild(dragon);
// }

// stage.addChild(dragon);

// createjs.Ticker.on("tick", function(e){
//   dragon.update(e);
//   stage.update();
// })


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
containerMain.on("pressmove", function (evt) {
    roadPrediction(evt.stageX, evt.stageY)
    stage.update();
});
containerMain.on("pressup", function (evt) {
    remoLine()
    roadPrediction(evt.stageX, evt.stageY, 'move')
    remoLine()
    bubbleMove()
});
containerMain.on("mousedown", function (evt) {

    roadPrediction(evt.stageX, evt.stageY)
});



bubbleAlone = []
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
        locationArr[y][x] = { x: a.x, y: a.y, existing: a.existing, bubble: a.bubble, color: a.color, checked: false, checkAlone: true }
        bubbleAlone.push({ x: x, y: y })
        checkBubbleAlone(x, y)
    }
}
async function getBubbleAlone(){
    var arr = []
    var x = 0, y = 0
    await checkBubbleAlone(0, 0)
    locationArr.forEach(element => {
        element.forEach(bubble => { 
            if (bubble.checkAlone == false && bubble.existing == true) {
                arr.push({x : x, y : y })
            }
           x++
        });
        y++
    });
    return arr
}