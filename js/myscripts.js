
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

var canvas
var stage


var monsterL = [], monsterR = []
var monsterTL = [], monsterTR = []
var monsterBL = [], monsterBR = []
var monsterSL = [], monsterSR = []
var turn1 = false, nextRound = 0, turn2 = false
var widthM, heightM, exp = 1

var boss, rotationBoss, widthBoss, heightBoss

var player, widthP, heightP
var life = 3, scores = 0, immortal = false, life_Text, scores_Text


var arrBullet = [], startShoot, widthB, heightB


var imgSeq = new Image();       // The image for the sparkle animation
var sprite;

var fader;
var spkls;                      // Container for all the sparkles

function init() {

    createjs.CSSPlugin.install();
    createjs.RotationPlugin.install();
    createjs.MotionGuidePlugin.install(createjs.Tween);
    setStage()

    creatMonsterT1()

    loadSound()

    creatPlayer()

    setSparkles()



}


function setSparkles() {
    // setBackground()
    var data = {
        images: ["../img/spritesheet_sparkle.png"],
        frames: {
            width: 21,
            height: 23,
            regX: 10,
            regY: 11
        }
    };
    // set up an animation instance, which we will clone
    sprite = new createjs.Sprite(new createjs.SpriteSheet(data));
    // fader = new createjs.Shape();
    // stage.addChild(fader);
    // var gfx = fader.graphics;
    // gfx.beginFill("rgba(0,0,0, 0.3)").drawRect(0, 0, 1024, 704).endFill();
    // setBackground()
    spkls = new createjs.Container();
    stage.addChild(spkls);

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", tick);

}

function setStage() {
    canvas = document.getElementById("myCanvas");
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
function createMonster(exp, startX, startY, moveMonster, arr) {
    var image = new Image();
    image.src = "../img/e" + exp + ".png";
    var monster
    image.onload = function () {
        monster = new createjs.Bitmap(image);
        monster.scaleX = 0.2;
        monster.scaleY = 0.2;
        monster.x = startX
        monster.y = startY
        widthM = monster.image.width * monster.scaleX
        heightM = monster.image.height * monster.scaleY
        monster.rotation = -90
        monster.alpha = 0
        arr.push(monster)
        stage.addChild(monster);
        for (let index = 1; index < 6; index++) {
            var monsterClone = arr[arr.length - 1].clone();
            monsterClone.x = startX
            monsterClone.y = startY
            arr.push(monsterClone)
            stage.addChild(monsterClone);
        }
        moveMonster(arr)
        stage.update();
    }
}
function createMonsterSides(exp, startX, startY, moveMonster, arr) {
    var image = new Image();
    image.src = "../img/e" + exp + ".png";
    var monster
    image.onload = function () {
        monster = new createjs.Bitmap(image);
        monster.scaleX = 0.2;
        monster.scaleY = 0.2;
        monster.alpha = 0
        monster.x = startX
        monster.y = startY
        widthM = monster.image.width * monster.scaleX
        heightM = monster.image.height * monster.scaleY

        arr.push(monster)
        stage.addChild(monster);

        for (let index = 2; index < 7; index++) {
            var monsterClone = arr[arr.length - 1].clone();
            monsterClone.x = startX
            monsterClone.y = startY * index * 0.8
            arr.push(monsterClone)
            stage.addChild(monsterClone);
        }
        moveMonster(arr)
        stage.update();
    }
}
//turn1
function creatMonsterT1() {
    createMonster(1, -widthM, 0, monsterMoveL, monsterL)
    createMonster(1, widthCV + widthM, 0, monsterMoveR, monsterR)
    createMonster(1, stage.canvas.width * 3 / 10, -heightM, monsterMoveTL, monsterTL)
    createMonster(1, stage.canvas.width * 7 / 10, -heightM, monsterMoveTR, monsterTR)
}
function monsterMoveL() {
    var i = 0
    var move1 = setInterval(
        function () {
            move(monsterL[i], i)
            if (i == monsterL.length - 1) clearInterval(move1);
            i += 1
        }, 200);

    function move(item, index) {
        tween = createjs.Tween.get(item, { bounce: false, loop: false })
            .to({
                alpha: 1,
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
            .to({
                guide: {
                    path: [
                        -50, stage.canvas.height * 7 / 10,
                        stage.canvas.width * 2 / 10, stage.canvas.height * 1 / 10,
                        stage.canvas.width * 5 / 10, stage.canvas.height * 4 / 10,
                        stage.canvas.width * 7 / 10, stage.canvas.height * 2 / 10,
                        -50, 0,
                    ], orient: "fixed"
                }
            }, 3000)
            .to({ x: index * widthM + 100, y: heightM, rotation: -90 }, 1000)
            .call(() => createjs.Tween.get(item)
                .wait((6 - index) * 200)
                .to({ y: stage.canvas.height + heightM }, 13000)
                .call(() => {
                    stage.removeChild(item)
                    monsterL = []
                    checkTurn1()
                }))
    }
}
function monsterMoveR() {
    var i = 0
    var move1 = setInterval(
        function () {
            move(monsterR[i], i)
            if (i == monsterR.length - 1) clearInterval(move1);
            i += 1
        }, 200);

    function move(item, i) {
        tween = createjs.Tween.get(item, { bounce: false, loop: false })
            .to({
                alpha: 1,
                guide: {
                    path: [stage.canvas.width + 50, 0,
                    stage.canvas.width * 8 / 10, stage.canvas.height * 1 / 10,
                    stage.canvas.width * 6 / 10, stage.canvas.height * 2 / 10,
                    stage.canvas.width * 4 / 10, stage.canvas.height * 3 / 10,
                    stage.canvas.width * 6 / 10, stage.canvas.height * 4 / 10,
                    stage.canvas.width * 8 / 10, stage.canvas.height * 5 / 10,
                    stage.canvas.width + 50, stage.canvas.height * 7 / 10], orient: "fixed"
                }
            }, 3000)
            .to({
                guide: {
                    path: [
                        stage.canvas.width + 50, stage.canvas.height * 7 / 10,
                        stage.canvas.width * 8 / 10, stage.canvas.height * 1 / 10,
                        stage.canvas.width * 5 / 10, stage.canvas.height * 4 / 10,
                        stage.canvas.width * 3 / 10, stage.canvas.height * 2 / 10,
                        stage.canvas.width + 50, stage.canvas.height * 2 / 10,
                    ], orient: "fixed"
                }
            }, 3000)
            .to({ x: i * widthM + 100, y: heightM * 2.5, rotation: -90 }, 1000)
            .call(() => createjs.Tween.get(item)
                .wait((6 - i) * 200)
                .to({ y: stage.canvas.height + heightM }, 12000)
                .call(() => {
                    stage.removeChild(item)
                    monsterR = []
                    checkTurn1()
                }))
    }
}
function monsterMoveTL() {
    var i = 0
    var move1 = setInterval(
        function () {
            move(monsterTL[i], i)
            if (i == monsterTL.length - 1) clearInterval(move1);
            i += 1
        }, 200);

    function move(item, i) {
        tween = createjs.Tween.get(item, { bounce: false, loop: false })
            .to({
                alpha: 1,
                guide: {
                    path: [stage.canvas.width * 3 / 10, -heightM,
                    stage.canvas.width * 3 / 10, stage.canvas.height * 3 / 10 - 50,
                    stage.canvas.width * 3 / 10 - 50, stage.canvas.height * 3 / 10,
                    -50, stage.canvas.height * 3 / 10,
                    stage.canvas.width * 3 / 10, -heightM,
                    ], orient: "fixed"
                }
            }, 3000)
            .wait(3000)
            .to({ x: i * widthM + 100, y: heightM * 4, rotation: -90 }, 1000)
            .call(() => createjs.Tween.get(item)
                .wait((6 - i) * 200)
                .to({ y: stage.canvas.height + heightM }, 11000)
                .call(() => {
                    stage.removeChild(item)
                    monsterTL = []
                    checkTurn1()
                })
            )
    }
}
function monsterMoveTR() {
    var i = 0
    var move1 = setInterval(
        function () {
            move(monsterTR[i], i)
            if (i == monsterTR.length - 1) clearInterval(move1);
            i += 1
        }, 200);

    function move(item, i) {
        tween = createjs.Tween.get(item, { bounce: false, loop: false })
            .to({
                alpha: 1,
                guide: {
                    path: [stage.canvas.width * 6 / 10, -heightM,
                    stage.canvas.width * 6 / 10, stage.canvas.height * 3 / 10 - 50,
                    stage.canvas.width * 6 / 10 + 50, stage.canvas.height * 3 / 10,
                    stage.canvas.width - 50, stage.canvas.height * 3 / 10,
                    stage.canvas.width * 9 / 10, -heightM * 2,
                    ], orient: "fixed"
                }
            }, 3000)
            .wait(3000)
            .to({ x: i * widthM + 100, y: heightM * 5.5, rotation: -90 }, 1000)
            .call(() => createjs.Tween.get(item)
                .wait((6 - i) * 200)
                .to({ y: stage.canvas.height + heightM }, 10000)
                .call(() => {
                    stage.removeChild(item)
                    monsterTR = []
                    checkTurn1()
                })
            )
    }

}

//turn 2
function creatMonsterT2() {
    createMonster(2, stage.canvas.width * 3 / 10, stage.canvas.height + heightM, monsterMoveBL, monsterBL)
    createMonster(2, stage.canvas.width * 6 / 10, stage.canvas.height + heightM, monsterMoveBR, monsterBR)
    createMonsterSides(2, -100, stage.canvas.height / 10, monsterMoveSidesL, monsterSL)
    createMonsterSides(2, stage.canvas.width + 100, stage.canvas.height / 10, monsterMoveSidesR, monsterSR)
}
function monsterMoveBL() {
    var i = 0
    var move1 = setInterval(
        function () {
            move(monsterBL[i], i)
            if (i == monsterBL.length - 1) clearInterval(move1);
            i += 1
        }, 200);

    function move(item, i) {
        tween = createjs.Tween.get(item, { bounce: false, loop: false })
            .to({
                alpha: 1,
                guide: {
                    path: [stage.canvas.width * 3 / 10, stage.canvas.height + heightM,

                    -widthM * 2, stage.canvas.height * 3 / 10,
                    stage.canvas.width * 3 / 10, stage.canvas.height * 2 / 10,
                    stage.canvas.width * 5 / 10, stage.canvas.height * 3 / 10,
                    stage.canvas.width * 1 / 10, stage.canvas.height * 4 / 10,
                    stage.canvas.width * 3 / 10, stage.canvas.height * 2 / 10,
                    i * widthM + 50, heightM * 2,

                    ], orient: "auto"
                }
            }, 3000)
            .to({ x: i * widthM + 100, y: heightM * 4, rotation: -90 }, 1000)
            .call(() => createjs.Tween.get(item)
                .wait((6 - i) * 200)
                .to({ y: stage.canvas.height + heightM }, 11000)
                .call(() => {
                    stage.removeChild(item)
                    monsterBL = []
                    checkTurn2()
                })
            )
    }

}
function monsterMoveBR() {
    var i = 0
    var move1 = setInterval(
        function () {
            move(monsterBR[i], i)
            if (i == monsterBR.length - 1) clearInterval(move1);
            i += 1
        }, 200);
    function move(item, i) {
        tween = createjs.Tween.get(item, { bounce: false, loop: false })
            .to({
                alpha: 1,
                guide: {
                    path: [stage.canvas.width * 6 / 10, stage.canvas.height + heightM,
                    stage.canvas.width + widthM * 2, stage.canvas.height * 3 / 10,
                    stage.canvas.width * 7 / 10, stage.canvas.height * 2 / 10,
                    stage.canvas.width * 4 / 10, stage.canvas.height * 3 / 10,
                    stage.canvas.width * 7 / 10, stage.canvas.height * 4 / 10,
                    stage.canvas.width * 6 / 10, stage.canvas.height * 1 / 10,
                    i * widthM + 100, heightM * 2,

                    ], orient: "auto"
                }
            }, 3000)
            .to({ x: i * widthM + 100, y: heightM * 5.5 }, 1000)
            .call(() => createjs.Tween.get(item)
                .wait((6 - i) * 200)
                .to({ y: stage.canvas.height + heightM }, 10000)
                .call(() => {
                    stage.removeChild(item)
                    monsterBR = []
                    checkTurn2()
                })
            )

    }

}
function monsterMoveSidesL() {
    var i = 0
    var move1 = setInterval(
        function () {
            move(monsterSL[i], i)
            if (i == monsterSL.length - 1) clearInterval(move1);
            i += 1
        }, 200);

    function move(item, i) {
        tween = createjs.Tween.get(item)
            .to({ alpha: 1, x: stage.canvas.width * 7 / 10 }, 1500)
            .to({ x: stage.canvas.width * 3 / 10 }, 1500)
            .to({ x: i * widthM + 100, y: heightM }, 1000)
            .wait((6 - i) * 200)
            .to({ y: stage.canvas.height + heightM }, 13000)
            .call(() => {
                stage.removeChild(item)
                monsterSL = []
                checkTurn2()
            })
    }


}
function monsterMoveSidesR() {
    var i = 0
    var move1 = setInterval(
        function () {
            move(monsterSR[i], i)
            if (i == monsterSR.length - 1) clearInterval(move1);
            i += 1
        }, 200);

    function move(item, i) {
        tween = createjs.Tween.get(item)
            .to({ alpha: 1, x: stage.canvas.width * 3 / 10 }, 1500)
            .to({ x: stage.canvas.width * 7 / 10 }, 1500)
            .to({ x: i * widthM + 100, y: heightM * 2.5 }, 1000)
            .wait((6 - i) * 200)
            .to({ y: stage.canvas.height + heightM }, 12000)
            .call(() => {
                stage.removeChild(item)
                monsterSR = []
                checkTurn2()
            })
    }
}

function checkTurn1() {
    if (monsterL.length == 0 && monsterR.length == 0 && monsterTL.length == 0 && monsterTR.length == 0) {
        nextRound += 1
        console.log(nextRound);
        if (!turn1) creatMonsterT2()
        turn1 = true
    }
}
function checkTurn2() {
    if (monsterBL.length == 0 && monsterBR.length == 0 && monsterSL.length == 0 && monsterSR.length == 0) {
        if (!turn2) createBoss()
        turn2 = true
    }
}


function createBoss() {
    var image = new Image();
    image.src = "../img/boss.png";
    image.onload = function () {
        boss = new createjs.Bitmap(image);
        boss.scaleX = 1.2
        boss.scaleY = 1.2
        boss.x = stage.canvas.width / 2
        boss.y = stage.canvas.height

        widthBoss = boss.image.height * 1.2
        heightBoss = boss.image.width * 1.2

        boss.regX = (boss.image.width) / 2
        boss.regY = (boss.image.height) / 2

        boss.alpha = 0
        boss.rotation = 180
        stage.addChild(boss);
        stage.update();

        bossMove(boss)
    }
}
function bossMove(boss) {
    createjs.Tween.get(boss)
        .to({ y: boss.getBounds().height * 1.5, alpha: 0.5, rotation: 90 }, 2500, createjs.Ease.linear)
        .to({ y: boss.getBounds().height * 2 / 3, alpha: 1, rotation: 0 }, 700, createjs.Ease.linear)
        .play(
            createjs.Tween.get(boss, { paused: true, loop: 2 })
                .to({ scaleX: 1.5, scaleY: 1.5 }, 500, createjs.Ease.linear)
                .to({ scaleX: 1.2, scaleY: 1.2 }, 500, createjs.Ease.linear)
        )
}
function creatPlayer() {
    life_Text = new createjs.Text(life, "20px Arial", "#ff7700");
    life_Text.x = 30;
    life_Text.y = 20
    scores_Text = new createjs.Text('Scores: ' + scores, "20px Arial", "#ff7700");
    scores_Text.x = widthCV - 100;
    scores_Text.y = 20
    stage.addChild(life_Text, scores_Text);
    var image = new Image();
    image.src = "../img/plane.png";
    image.onload = function () {
        player = new createjs.Bitmap(image);
        player.scaleX = 0.3;
        player.scaleY = 0.3;
        widthP = image.width * 0.3
        heightP = image.height * 0.3
        player.x = (widthCV - image.width * 0.3) / 2
        player.y = heightCV - image.height * 0.5
        stage.addChild(player);
        player.setBounds(player.x, player.y, widthP, heightP);

        player.on("pressmove", function (evt) {
            evt.target.x = evt.stageX - 50;
            evt.target.y = evt.stageY - 50;
            player.setBounds(evt.stageX - 50, evt.stageX - 50, widthP, heightP);
            addSparkles((Math.random() * 4 + 2) | 0, stage.mouseX, stage.mouseY, 0.1);
        });
        player.on("pressup", function (evt) {
            clearInterval(startShoot);
            // player.setBounds(evt.stageX - 50, evt.stageX - 50, widthP, heightP);
        });

        player.on("mousedown", function (evt) {
            console.log('mousedown');
            // console.log(evt);
            startShoot = setInterval(
                () => {

                    addSparkles((Math.random() * 4 + 2) | 0, stage.mouseX, stage.mouseY, 0.1);
                }
                , 1000);
            startShoot = setInterval(
                () => {
                    // shoot()
                    createBullet(player)
                }
                , 150);
            // player.setBounds(evt.stageX - 50, evt.stageX - 50, widthP, heightP);
        });

        stage.update();
    }
}

function shoot() {
    console.log(arrBullet.length);
    if (arrBullet.length > 0) {
        var bullet = arrBullet.pop()
        bullet.x = player.x + player.getBounds().width / 2
        bullet.y = player.y
        bullet.alpha = 1
        moveBullet(bullet)
    } else {
        createBullet(player)
    }
}
function createBullet(player) {
    var image = new Image();
    image.src = "../img/bullet.png";
    image.onload = function () {
        var bullet = new createjs.Bitmap(image);
        bullet.scaleX = 0.2;
        bullet.scaleY = 0.2;
        bullet.x = player.x + player.getBounds().width / 2
        bullet.y = player.y
        bullet.rotation = -90
        widthB = bullet.image.height * 0.2
        heightB = bullet.image.width * 0.2
        stage.addChild(bullet);
        stage.update();
        moveBullet(bullet)
    }
}
function moveBullet(bullet) {
    var moveY = createjs.Tween.get(bullet)
        .to({ y: 0 }, bullet.y / (stage.canvas.height / 1500), createjs.Ease.linear).addEventListener("change", handleChange);
    function handleChange(event) {
        if (boss != null) {
            var impinge = getIndexBoss(boss).intersects(getIndexBullet(bullet))
            if(impinge){
                bulletDie(bullet, true)
                updateScores()
            }
        }
        else {
            checkBulletMove(bullet)
            if (bullet.y <= 0) {
                bulletDie(bullet)
                // moveY.setPaused(true);
                // removeTweens(bullet)
            }
        }

    }
}
function checkBulletMove(bullet) {
    checkArrMonster('monsterL', monsterL)
    checkArrMonster('monsterR', monsterR)
    checkArrMonster('monsterTL', monsterTL)
    checkArrMonster('monsterTR', monsterTR)
    checkArrMonster('monsterBL', monsterBL)
    checkArrMonster('monsterBR', monsterBR)
    checkArrMonster('monsterSL', monsterSL)
    checkArrMonster('monsterSR', monsterSR)
    function checkArrMonster(name, arr) {
        if (arr.length > 0) {
            arr.forEach(monster => {
                var impinge = getIndexMonster(monster).intersects(getIndexBullet(bullet))
                if (impinge) {
                    monsterDie(name, arr, monster)
                    bulletDie(bullet, true)
                    updateScores()
                }
            });
        }
    }
}
function updateScores() {
    scores += 1
    stage.removeChild(scores_Text)
    scores_Text = new createjs.Text('Scores: ' + scores, "20px Arial", "#ff7700");
    scores_Text.x = widthCV - 100;
    scores_Text.y = 20
    stage.addChild(scores_Text);
    stage.update();
}
function monsterDie(name, arr, monster) {
    createjs.Tween.removeTweens(monster);
    console.log(arr.indexOf(monster));
    arr.splice(arr.indexOf(monster), 1)

    stage.removeChild(monster)

    if (nextRound < 6) checkTurn1()
    else if (nextRound == 6) checkTurn2()

}
async function bulletDie(bullet, boss) {
    if( boss ) {
        
    await addSparkles(Math.random() * 10 + 30 | 0, bullet.x, bullet.y, 1);
    }
    // bullet.alpha = 0
    // bullet.x = widthCV + widthB
    // bullet.y = heightCV
    bullet.x = -100
    bullet.y = -100
    // console.log('bullet die');
    stage.removeChild(bullet)

    // arrBullet.push(bullet)
}
function loadSound() {
    createjs.Sound.alternateExtensions = ["mp3"];
    createjs.Sound.on("fileload", loadHandler, this);
    createjs.Sound.registerSound("../sound/beatCut.mp3", "sound");
    function loadHandler(event) {
        // This is fired for each sound that is registered.
        console.log('load xong');
        var instance = createjs.Sound.play("sound");
        instance.on("complete", handleComplete, this);
        instance.volume = 100;
    }
    function handleComplete() {
        // console.log("load xong");
    }

    // createjs.Sound.initializeDefaultPlugins();
    // var assetsPath = "../sound/";
    // var sounds = [{
    //     src: "MyAudioSprite.ogg", data: {
    //         audioSprite: [
    //             { id: "beatCut", startTime: 0, duration: 500 },
    //             { id: "beat2Cut", startTime: 1000, duration: 400 }
    //         ]
    //     }
    // }
    // ];
    // createjs.Sound.alternateExtensions = ["mp3"];
    // createjs.Sound.on("fileload", loadHandler);
    // createjs.Sound.registerSounds(sounds, assetsPath);
    // // after load is complete
    // function loadHandler(event) {
    //     // This is fired for each sound that is registered.
    //     var instance = createjs.Sound.play("beatCut");  // play using id.  Could also use full sourcepath or event.src.
    //     // instance.on("complete", handleComplete, this);
    //     instance.volume = 100;
    // }
    // // createjs.Sound.play("sound2");
}

function getIndexMonster(obj) {
    var x = obj.x
    var y = obj.y
    obj.setBounds(x, y, widthM, heightM)
    return obj.getBounds()
}
function getIndexBoss(boss) {
    var x = boss.x
    var y = boss.y
    boss.setBounds(boss.x-25, boss.y +heightBoss/2 -10, widthBoss/2, 1);
    return boss.getBounds()
}
function getIndexBullet(obj) {
    var x = obj.x
    var y = obj.y
    obj.setBounds(x, y, widthM, heightB)
    return obj.getBounds()
}

function getIndexPlayer() {
    var x = player.x
    var y = player.y
    obj.setBounds(x, y, widthP, heightP)
    return obj.getBounds()
}
function checkDie(monster) {
    if (getIndexMonster(monster).intersects(getIndexPlayer())) {

    }

}
function tick(event) {
    // loop through all of the active sparkles on stage:
    var l = spkls.numChildren;
    var m = event.delta / 20;
    for (var i = 0; i < l; i++) {
        var sparkle = spkls.getChildAt(i);

        if (--sparkle.life <= 0) {
            spkls.removeChild(sparkle);
            i--; l--;
            continue;
        }

        // apply gravity and friction
        sparkle.vY += m;

        // update position, scale, and alpha:
        sparkle.x += sparkle.vX * m;
        sparkle.y += sparkle.vY * m;

        sparkle.alpha = sparkle.alphaStart * (sparkle.life / sparkle.lifeMax);

        // remove sparkles that are off screen or not invisible
        if (sparkle.y > canvas.height) {
            sparkle.vY *= -(Math.random() * 0.1 + 0.8);
            sparkle.vX += Math.cos(Math.random() * Math.PI * 2) * 3;
        } else if (sparkle.y < 0) {
            sparkle.vY *= 0.9;
        }

        if (sparkle.x > canvas.width || sparkle.x < 0) {
            sparkle.vX *= -1;
        }
    }

    stage.update(event);
}
function addSparkles(count, x, y, speed) {
    // create the specified number of sparkles
    for (var i = 0; i < count; i++) {
        // clone the original sparkle, so we don't need to set shared properties:
        var sparkle = sprite.clone();

        // set display properties:
        sparkle.x = x;
        sparkle.y = y;
        sparkle.rotation = Math.random() * 360;
        sparkle.alpha = sparkle.alphaStart = Math.random() * 0.7 + 0.6;
        sparkle.scale = Math.random() + 0.3;

        sparkle.life = sparkle.lifeMax = Math.random() * 100 + 50;

        // set up velocities:
        var a = Math.PI * 2 * Math.random();
        var v = (Math.random() - 0.5) * 30 * speed;
        sparkle.vX = Math.cos(a) * v;
        sparkle.vY = Math.sin(a) * v;

        // start the animation on a random frame:
        sparkle.gotoAndPlay(Math.random() * sparkle.spriteSheet.getNumFrames() | 0);

        // add to the display list:
        spkls.addChild(sparkle);
    }
}


