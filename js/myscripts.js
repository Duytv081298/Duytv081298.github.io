var width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

var height = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;

var heightCV = height
var widthCV = height / 1.7

var Keys = {
    up: false,
    down: false,
    left: false,
    right: false
};
var stage


var monstersL = [], monstersC = [], monstersR = [], widthM, heightM, exp = 1

function init() {

    createjs.CSSPlugin.install();
    createjs.RotationPlugin.install();
    createjs.MotionGuidePlugin.install(createjs.Tween);
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", tick);
    setStage()
    setBackground()
    createMonster(1, -widthM, 0, monsterMoveL)
    createMonster(1, widthCV + widthM, 0, monsterMoveR)
    // monsterMove()
}

function setStage() {
    var canvas = document.getElementById("myCanvas");
    console.log(height);
    canvas.height = height
    canvas.width = height / 1.7
    console.log('canvas.height: ' + canvas.height);
    console.log('canvas.width: ' + canvas.width);
    stage = new createjs.Stage("myCanvas");
}

function setBackground() {
    var image = new Image();
    image.src = "../img/bg.png";
    image.onload = function () {
        var bg = new createjs.Bitmap(image);
        bg.scaleX = stage.canvas.width / image.width;
        bg.scaleY = stage.canvas.height / image.height;
        stage.addChild(bg);
        stage.update();
    }
}


function createMonster(exp, startX, startY, moveMonster) {
    console.log(monstersL);
    var image = new Image();
    image.src = "../img/e" + exp + ".png";
    var monster
    image.onload = function () {
        monster = new createjs.Bitmap(image);
        monster.scaleX = 0.2;
        monster.scaleY = 0.2;
        widthM = monster.image.width * monster.scaleX
        heightM = monster.image.height * monster.scaleY
        monster.x = startX
        monster.y = startY

        monster.setBounds(monster.x, monster.y, widthM, heightM)
        monstersL.push(monster)

        stage.addChild(monster);
        var i = 1
        moveMonster(monster, i)

        var move = setInterval(
            function () {
                i += 1
                var monsterClone = monstersL[monstersL.length - 1].clone();
                monster.x = startX
                monster.y = startY
                monsterClone.setBounds(monsterClone.x, monsterClone.y, widthM, heightM)
                monstersL.push(monsterClone)
                moveMonster(monsterClone, i)
                stage.addChild(monsterClone);
                if (i == 6) clearInterval(move);
            }, 200);
        stage.update();
    }
}
function monsterMoveL(monsterL, i) {
    tween = createjs.Tween.get(monsterL, { bounce: false, loop: 2 })
        .to({
            guide: {
                path: [-50, 0,
                stage.canvas.width * 2 / 10, stage.canvas.height * 1 / 10,
                stage.canvas.width * 4 / 10, stage.canvas.height * 2 / 10,
                stage.canvas.width * 6 / 10, stage.canvas.height * 3 / 10,
                stage.canvas.width * 4 / 10, stage.canvas.height * 4 / 10,
                stage.canvas.width * 2 / 10, stage.canvas.height * 5 / 10,
                -50, stage.canvas.height * 7 / 10], orient: "fixed"
            }
        }, 3000)
        .call(() => {
            setTimeout(function () {
                createjs.Tween.get(monsterL).to({ x: i * widthM + 20, y: heightM, rotation: -90 }, 1000)
            }, 6000);
        });
}
function monsterMoveR(monsterL, i) {
    tween = createjs.Tween.get(monsterL, { bounce: false, loop: true })
        .to({
            guide: {
                path: [stage.canvas.width + 50, 0,
                stage.canvas.width * 8 / 10, stage.canvas.height * 1 / 10,
                stage.canvas.width * 6 / 10, stage.canvas.height * 2 / 10,
                stage.canvas.width * 4 / 10, stage.canvas.height * 3 / 10,
                stage.canvas.width * 6 / 10, stage.canvas.height * 4 / 10,
                stage.canvas.width * 8 / 10, stage.canvas.height * 5 / 10,
                stage.canvas.width + 50, stage.canvas.height * 7 / 10], orient: "fixed"
            }
        }, 3000);
}

function tick(event) {
    stage.update();
}