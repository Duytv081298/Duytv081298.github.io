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


var monsterL = [], monsterR = []
var monsterTL = [], monsterTR = []
var monsterBL = [], monsterBR = []
var monsterSL = [], monsterSR = []
var widthM, heightM, exp = 1

var boss, rotationBoss

var player, widthP, heightP


var arrBullet = [], startShoot

function init() {

    createjs.CSSPlugin.install();
    createjs.RotationPlugin.install();
    createjs.MotionGuidePlugin.install(createjs.Tween);
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", tick);
    setStage()
    setBackground()
    // createMonster(1, -widthM, 0, monsterMoveL, monsterL)
    // createMonster(1, widthCV + widthM, 0, monsterMoveR, monsterR)
    // createMonster(1, stage.canvas.width * 3 / 10, -heightM, monsterMoveTL, monsterTL)
    // createMonster(1, stage.canvas.width * 7 / 10, -heightM, monsterMoveTR, monsterTR)

    // createMonster(2, stage.canvas.width * 3 / 10, stage.canvas.height + heightM, monsterMoveBL, monsterBL)
    // createMonster(2, stage.canvas.width * 6 / 10, stage.canvas.height + heightM, monsterMoveBR, monsterBR)
    // createMonsterSides(2, -widthM, stage.canvas.height / 10, monsterMoveSidesL, monsterSL)
    // createMonsterSides(2, stage.canvas.width + widthM, stage.canvas.height / 10, monsterMoveSidesR, monsterSR)


    // createBoss()
    loadSound()

    creatPlayer()

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
function createMonster(exp, startX, startY, moveMonster, arr) {
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
        monster.rotation = -90

        monster.setBounds(monster.x, monster.y, widthM, heightM)
        arr.push(monster)
        stage.addChild(monster);
        var i = 1
        moveMonster(monster, i, arr)

        var move = setInterval(
            function () {
                i += 1
                var monsterClone = arr[arr.length - 1].clone();
                monsterClone.x = startX
                monsterClone.y = startY
                monsterClone.setBounds(monsterClone.x, monsterClone.y, widthM, heightM)
                arr.push(monsterClone)
                moveMonster(monsterClone, i, arr)
                stage.addChild(monsterClone);
                if (i == 6) clearInterval(move);
            }, 200);
        stage.update();
        console.log(arr);
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
        widthM = monster.image.width * monster.scaleX
        heightM = monster.image.height * monster.scaleY
        monster.x = startX
        monster.y = startY

        monster.setBounds(monster.x, monster.y, widthM, heightM)
        arr.push(monster)
        stage.addChild(monster);
        var i = 1
        moveMonster(monster, i, arr)

        var move = setInterval(
            function () {
                i += 1
                var monsterClone = arr[arr.length - 1].clone();
                monsterClone.x = startX
                monsterClone.y = startY * i * 0.8
                monsterClone.setBounds(monsterClone.x, monsterClone.y, widthM, heightM)
                arr.push(monsterClone)
                moveMonster(monsterClone, i, arr)
                stage.addChild(monsterClone);
                if (i == 6) clearInterval(move);
            }, 200);
        stage.update();
    }
}
function monsterMoveL(monsterL, i) {
    tween = createjs.Tween.get(monsterL, { bounce: false, loop: false })
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
            createjs.Tween.get(monsterL)
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
                .call(() => {
                    createjs.Tween.get(monsterL)
                        .to({ x: i * widthM + 50, y: heightM, rotation: -90 }, 1000)
                        .call(() => createjs.Tween.get(monsterL)
                            .wait((6 - i) * 200)
                            .to({ y: stage.canvas.height + heightM }, 13000)
                            .call(() => {
                                stage.removeChild(monsterL)
                                if (i == 6) arr = []
                            }))
                })
        });
}
function monsterMoveR(monsterR, i) {
    tween = createjs.Tween.get(monsterR, { bounce: false, loop: false })
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
        }, 3000)
        .call(() => {
            createjs.Tween.get(monsterR)
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
                .call(() => {
                    createjs.Tween.get(monsterR)
                        .to({ x: i * widthM + 50, y: heightM * 2.5, rotation: -90 }, 1000)
                        .call(() => createjs.Tween.get(monsterR)
                            .wait((6 - i) * 200)
                            .to({ y: stage.canvas.height + heightM }, 12000)
                            .call(() => {
                                stage.removeChild(monsterR)
                                if (i == 6) arr = []
                            }))
                })
        });

}
function monsterMoveTL(monsterTL, i) {
    tween = createjs.Tween.get(monsterTL, { bounce: false, loop: false })
        .to({
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
        .call(() => {
            createjs.Tween.get(monsterTL)
                .to({ x: i * widthM + 50, y: heightM * 4, rotation: -90 }, 1000)
                .call(() => createjs.Tween.get(monsterTL)
                    .wait((6 - i) * 200)
                    .to({ y: stage.canvas.height + heightM }, 11000)
                    .call(() => {
                        stage.removeChild(monsterTL)
                        if (i == 6) arr = []
                    })
                )
        });
}
function monsterMoveTR(monsterTR, i) {
    tween = createjs.Tween.get(monsterTR, { bounce: false, loop: false })
        .to({
            guide: {
                path: [stage.canvas.width * 6 / 10, -heightM,
                stage.canvas.width * 6 / 10, stage.canvas.height * 3 / 10 - 50,
                stage.canvas.width * 6 / 10 + 50, stage.canvas.height * 3 / 10,
                stage.canvas.width - 50, stage.canvas.height * 3 / 10,
                stage.canvas.width * 9 / 10, -heightM,
                ], orient: "fixed"
            }
        }, 3000)
        .wait(3000)
        .call(() => {
            createjs.Tween.get(monsterTR)
                .to({ x: i * widthM + 50, y: heightM * 5.5, rotation: -90 }, 1000)
                .call(() => createjs.Tween.get(monsterTR)
                    .wait((6 - i) * 200)
                    .to({ y: stage.canvas.height + heightM }, 10000)
                    .call(() => {
                        stage.removeChild(monsterTR)
                        if (i == 6) arr = []
                    })
                )
        });
}
function monsterMoveBL(monsterBL, i) {
    tween = createjs.Tween.get(monsterBL, { bounce: false, loop: false })
        .to({
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
        // .wait(3000)
        .call(() => {
            createjs.Tween.get(monsterBL)
                .to({ x: i * widthM + 50, y: heightM * 4, rotation: -90 }, 1000)
                .call(() => createjs.Tween.get(monsterBL)
                    .wait((6 - i) * 200)
                    .to({ y: stage.canvas.height + heightM }, 11000)
                    .call(() => {
                        stage.removeChild(monsterBL)
                        if (i == 6) arr = []
                    })
                )
        });
}
function monsterMoveBR(monsterBR, i) {
    tween = createjs.Tween.get(monsterBR, { bounce: false, loop: false })
        .to({
            guide: {
                path: [stage.canvas.width * 6 / 10, stage.canvas.height + heightM,

                stage.canvas.width + widthM * 2, stage.canvas.height * 3 / 10,
                stage.canvas.width * 7 / 10, stage.canvas.height * 2 / 10,
                stage.canvas.width * 4 / 10, stage.canvas.height * 3 / 10,
                stage.canvas.width * 7 / 10, stage.canvas.height * 4 / 10,
                stage.canvas.width * 6 / 10, stage.canvas.height * 1 / 10,
                i * widthM + 50, heightM * 2,

                ], orient: "auto"
            }
        }, 3000)
        // .wait(3000)
        .call(() => {
            createjs.Tween.get(monsterBR)
                .to({ x: i * widthM + 50, y: heightM * 5.5, rotation: -90 }, 1000)
                .call(() => createjs.Tween.get(monsterBR)
                    .wait((6 - i) * 200)
                    .to({ y: stage.canvas.height + heightM }, 10000)
                    .call(() => {
                        stage.removeChild(monsterBR)
                        if (i == 6) arr = []
                    })
                )
        });
}
function monsterMoveSidesL(monsterSL, i) {
    tween = createjs.Tween.get(monsterSL)
        .to({ x: stage.canvas.width * 7 / 10, rotation: -90 }, 1500)
        .to({ x: stage.canvas.width * 3 / 10, rotation: 90 }, 1500)
        // .wait(3000)
        .call(() => {
            createjs.Tween.get(monsterSL)
                .to({ x: i * widthM + 50, y: heightM, rotation: -90 }, 1000)
                .call(() => createjs.Tween.get(monsterSL)
                    .wait((6 - i) * 200)
                    .to({ y: stage.canvas.height + heightM }, 13000)
                    .call(() => {
                        stage.removeChild(monsterSL)
                        if (i == 6) arr = []
                    })
                )
        });
}
function monsterMoveSidesR(monsterSR, i) {
    tween = createjs.Tween.get(monsterSR)
        .to({ x: stage.canvas.width * 3 / 10, rotation: -90 }, 1500)
        .to({ x: stage.canvas.width * 7 / 10, rotation: 90 }, 1500)
        // .wait(3000)
        .call(() => {
            createjs.Tween.get(monsterSR)
                .to({ x: i * widthM + 50, y: heightM * 2.5, rotation: -90 }, 1000)
                .call(() => createjs.Tween.get(monsterSR)
                    .wait((6 - i) * 200)
                    .to({ y: stage.canvas.height + heightM }, 12000)
                    .call(() => {
                        stage.removeChild(monsterSR)
                        if (i == 6) arr = []
                    })
                )
        });
}
function checkTurn1() {
    if (monsterL.length == 0 && monsterR.length == 0 && monsterTL.length == 0 && monsterTR.length == 0) return true
}
function checkTurn() {
    if (monsterBL.length == 0 && monsterBR.length == 0 && monsterSL.length == 0 && monsterSR.length == 0) return true
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

        boss.regX = (boss.image.width) / 2
        boss.regY = (boss.image.height) / 2
        console.log(boss.x);
        console.log(boss.y);

        boss.alpha = 0

        boss.rotation = 180
        boss.setBounds(boss.x, boss.y, boss.image.height * 1.2, boss.image.width * 1.2);

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
            // console.log(evt);
            player.setBounds(evt.stageX - 50, evt.stageX - 50, widthP, heightP);
        });

        player.on("pressup", function (evt) {
            evt.target.x = evt.stageX - 50;
            evt.target.y = evt.stageY - 50;
            clearInterval(startShoot);

            player.setBounds(evt.stageX - 50, evt.stageX - 50, widthP, heightP);
        });

        player.on("mousedown", function (evt) {
            evt.target.x = evt.stageX - 50;
            evt.target.y = evt.stageY - 50;
            // console.log(evt);
            startShoot = setInterval(
                function () {
                    shoot()
                }, 200);
            player.setBounds(evt.stageX - 50, evt.stageX - 50, widthP, heightP);
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
        bullet.setBounds(bullet.x, bullet.y,bullet.image.height*0.2, bullet.image.width*0.2)
        stage.addChild(bullet);
        stage.update();
        moveBullet(bullet)
    }
}

function moveBullet(bullet) {
    var moveY = createjs.Tween.get(bullet)
        .to({ y: 0 }, bullet.y / (stage.canvas.height / 1500), createjs.Ease.linear).addEventListener("change", handleChange);
    function handleChange(event) {
        checkBulletMove(bullet)
        if (bullet.y <= 0) {
            console.log();
            bulletDie(bullet)
            // moveY.setPaused(true);
            // removeTweens(bullet)
        }
    }
}

function checkBulletMove(bullet) {
    checkArrMonster('monsterL',monsterL)
    checkArrMonster('monsterR',monsterR)
    checkArrMonster('monsterTL',monsterTL)
    checkArrMonster('monsterTR',monsterTR)
    checkArrMonster('monsterBL',monsterBL)
    checkArrMonster('monsterBR',monsterBR)
    checkArrMonster('monsterSL',monsterSL)
    checkArrMonster('monsterSR',monsterSR)
    function checkArrMonster(name,arr) {
        if (arr.length > 0) {
            arr.forEach(monster => {
                var impinge = getIndex(monster).intersects(getIndex(bullet))
                if (impinge) {
                    console.log(getIndex(monster));
                    console.log(getIndex(bullet));
                    monsterDie(name, arr, monster)
                    bulletDie(bullet)
                    // updateScores()
                }
            });
        }
    }


}

function monsterDie(name, arr, monster) {
        arr.splice(arr.indexOf(monster),1)
        stage.removeChild(monster)
        createjs.Tween.removeTweens(monster);
        console.log(name);
        console.log(arr);


    // for (let index = 0; index < monsters.length; index++) {
    //     monsters[index].splice(monsters[index].indexOf(monster), 1);
    //     if (monsters[index].length == 0) {
    //         monsters.splice(index, 1);
    //         exp < 4 ? exp += 1 : exp = 4
    //         createMonster(exp)
    //     }
    // }
}

function bulletDie(obj) {
    obj.x = widthCV + obj.getBounds().width * 2
    obj.y = heightCV
    obj.alpha = 0
    arrBullet.push(obj)
}



function loadSound() {
    // createjs.Sound.alternateExtensions = ["mp3"];
    // createjs.Sound.on("fileload", loadHandler, this);
    // createjs.Sound.registerSound("../sound/beatCut.mp3", "sound");
    // function loadHandler(event) {
    //     // This is fired for each sound that is registered.
    //     var instance = createjs.Sound.play("sound");  // play using id.  Could also use full sourcepath or event.src.
    //     // instance.on("complete", handleComplete, this);
    //     instance.volume = 100;
    // }

    createjs.Sound.initializeDefaultPlugins();
    var assetsPath = "../sound/";
    var sounds = [{
        src:"MyAudioSprite.ogg", data: {
            audioSprite: [
                {id:"beatCut", startTime:0, duration:500},
                {id:"beat2Cut", startTime:1000, duration:400}
            ]}
        }
    ];
    createjs.Sound.alternateExtensions = ["mp3"];
    createjs.Sound.on("fileload", loadHandler);
    createjs.Sound.registerSounds(sounds, assetsPath);
    // after load is complete
    function loadHandler(event) {
            // This is fired for each sound that is registered.
            var instance = createjs.Sound.play("beatCut");  // play using id.  Could also use full sourcepath or event.src.
            // instance.on("complete", handleComplete, this);
            instance.volume = 100;
        }
    // createjs.Sound.play("sound2");
}













function getIndex(obj) {
    var x = obj.x
    var y = obj.y
    var width = obj.getBounds().width
    var height = obj.getBounds().height
    obj.setBounds(x, y, width, height)
    return obj.getBounds()
}
function tick(event) {
    rotationBoss++
    stage.update();
}