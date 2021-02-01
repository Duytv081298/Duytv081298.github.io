
var width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

var height = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;

// var width= window.screen.width
// var height= window.screen.height

var heightCV = height
var widthCV = height / 1.7

var Keys = {
    up: false,
    down: false,
    left: false,
    right: false
};
var stage


var protagonist, widthP, heightP
var life = 3, scores = 0, immortal = false, life_Text, scores_Text
var monsters = [], widthM, heightM, exp = 1
var dx = 5, dy = 5
var arrBullet = []


var speed = 2


var totalWalls = 0
var totalBullet = 0



function init() {
    createjs.CSSPlugin.install();
    createjs.RotationPlugin.install();
    var canvas = document.getElementById("demoCanvas");
    canvas.height = height;
    canvas.width = widthCV
    console.log('canvas.height: ' + canvas.height);
    console.log('canvas.width: ' + canvas.width);

    stage = new createjs.Stage("demoCanvas");


    // var setCreateWall = setInterval(
    //     () => {
    //         if (totalWalls < 50) {
    //             createWall()
    //             totalWalls++
    //         } else clearInterval(setCreateWall);
    //     }, 5000 / speed);

    createLogo()
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", stage);
}

function createLogo() {
    var image = new Image();
    image.src = "../img/logo.png";
    image.onload = function () {
        var logo = new createjs.Bitmap(image)
        logo.scaleX = 0;
        logo.scaleY = 0;
        stage.addChild(logo);
        logo.x = (stage.canvas.width - logo.image.width * logo.scaleX) / 2;
        logo.y = (stage.canvas.height - logo.image.height * logo.scaleY) / 2;
        stage.update();

        var tween = createjs.Tween.get(logo)
            .to({ scaleX: 0.5, scaleY: 0.5, x: logo.x / 2, y: logo.y / 2 }, 500, createjs.Ease.linear)
            .to({ scaleX: 1, scaleY: 1, x: 0, y: logo.y / 2 }, 500, createjs.Ease.linear)
            .call(
                () => {
                    var tween = createjs.Tween.get(logo, { loop: -1 })
                        .to({ alpha: 0 }, 100, createjs.Ease.linear)
                        .to({ alpha: 1 }, 100, createjs.Ease.linear)
                });
        setTimeout(
            function () {
                tween.setPaused(true);
                stage.removeChild(logo)
                start()
            }, 3000);
    }
}
function start() {
    createBackground()
    createMonster(exp)
    creatProtagonist()
}



function createBackground() {
    var image = new Image();
    image.src = "../img/bg.png";
    image.onload = function () {
        var bg = new createjs.Bitmap(image);
        bg.scaleX = widthCV / image.width;
        bg.scaleY = heightCV / image.height;
        life_Text = new createjs.Text(life, "20px Arial", "#ff7700");
        life_Text.x = 30;
        life_Text.y = 20
        scores_Text = new createjs.Text('Scores: ' + scores, "20px Arial", "#ff7700");
        scores_Text.x = widthCV - 100;
        scores_Text.y = 20
        stage.addChild(bg, life_Text, scores_Text);
        stage.update();
    }
}
function creatProtagonist() {
    var image = new Image();
    image.src = "../img/plane.png";
    image.onload = function () {
        protagonist = new createjs.Bitmap(image);
        protagonist.scaleX = 0.3;
        protagonist.scaleY = 0.3;
        widthP = image.width * 0.3
        heightP = image.height * 0.3
        protagonist.x = (widthCV - image.width * 0.3) / 2
        protagonist.y = heightCV - image.height * 0.5
        stage.addChild(protagonist);
        protagonist.setBounds(protagonist.x, protagonist.y, widthP, heightP);


        protagonist.on("pressmove", function (evt) {
            evt.target.x = evt.stageX - 50;
            evt.target.y = evt.stageY - 50;
            protagonist.setBounds(evt.stageX - 50, evt.stageX - 50, widthP, heightP);

        });
        stage.update();
    }
}


function createMonster(exp) {
    console.log(monsters);
    var arrMonsters = []
    var image = new Image();
    image.src = "../img/e" + exp + ".png";
    var monster
    image.onload = function () {
        monster = new createjs.Bitmap(image);
        monster.scaleX = 0.2;
        monster.scaleY = 0.2;
        widthM = image.width * 0.2
        heightM = image.height * 0.2
        monster.x = -heightM
        monster.y = 0

        monster.setBounds(monster.x, monster.y, widthM, heightM)
        arrMonsters.push(monster)
        stage.addChild(monster);

        for (let i = 1; i < 6; i++) {
            var monsterClone = arrMonsters[arrMonsters.length - 1].clone();
            monsterClone.x = arrMonsters[arrMonsters.length - 1].x + widthM
            monsterClone.y = monster.y
            monsterClone.setBounds(monsterClone.x, monsterClone.y, widthM, heightM)
            arrMonsters.push(monsterClone)
            stage.addChild(monsterClone);
        }
        monsters.push(arrMonsters)
        // containerMonsters = new createjs.Container();
        // monsters.forEach(monster => {
        //     containerMonsters.addChild(monster)
        // });
        // stage.addChild(containerMonsters);
        stage.update();
        monsterMove()
    }
}
function getIndex(obj) {
    var x = obj.x
    var y = obj.y
    var width = obj.getBounds().width
    var height = obj.getBounds().height
    obj.setBounds(x, y, width, height)
    return obj.getBounds()
}

function monsterMove() {
    var calculation = false
    // var range = Math.floor(Math.random() * 50) + 50
    var range = 0
    monsters.forEach(arrMonsters => {
        setInterval(function () {
            if (arrMonsters.length > 0) {
                var xMax = arrMonsters[arrMonsters.length - 1].x + arrMonsters[arrMonsters.length - 1].getBounds().width
                var xMin = arrMonsters[0].x
                // var width = monsters[monsters.length - 1].x - containerMonsters.x


                if ((widthCV - range) <= (xMax + speed)) calculation = false
                if ((xMin - speed) <= range) calculation = true
                calculation ? monsterMoveRight(arrMonsters) : monsterMoveLeft(arrMonsters)
                stage.update();
            }
        }, 20);
        setInterval(function () {
            if (arrMonsters.length > 0) {
                arrMonsters.forEach(monster => {
                    monster.y += speed
                });
                if (monsters[monsters.length - 1][monsters[monsters.length - 1].length - 1].y > heightCV / 6) {
                    exp < 4 ? exp += 1 : exp = 4
                    createMonster(exp)
                }
                stage.update();
            }
        }, 500);
    });
}
function monsterMoveLeft(arrMonsters) {
    arrMonsters.forEach(monster => {
        monster.x -= speed
        checkIntersection(monster)
    });
}
function monsterMoveRight(arrMonsters) {
    arrMonsters.forEach(monster => {
        monster.x += speed
        checkIntersection(monster)

    });
}

window.onkeydown = function (e) {
    var kc = e.keyCode;
    e.preventDefault();
    if (kc === 32) shoot(protagonist)
    else if (kc === 37) Keys.left = true;
    else if (kc === 38) Keys.up = true;
    else if (kc === 39) Keys.right = true;
    else if (kc === 40) Keys.down = true;

    checkMove(dx, dy, protagonist)
    move(dx, dy)
    protagonist.setBounds(protagonist.x, protagonist.y, widthP, heightP);

};

window.onkeyup = function (e) {
    var kc = e.keyCode;
    e.preventDefault();

    if (kc === 37) Keys.left = false;
    else if (kc === 38) Keys.up = false;
    else if (kc === 39) Keys.right = false;
    else if (kc === 40) Keys.down = false;
};

function checkMove(dx, dy, obj) {
    if (widthCV <= obj.x + widthP + dx) Keys.right = false
    else if (0 >= obj.x - dx) Keys.left = false
    if (0 >= obj.y - dy) Keys.up = false
    else if (heightCV <= obj.y + heightP + dy) Keys.down = false
}

function shoot(protagonist) {
    if (arrBullet.length > 0) {
        var bullet = arrBullet.pop()
        bullet.x = protagonist.x + protagonist.getBounds().width / 2
        bullet.y = protagonist.y
        bullet.alpha = 1
        moveBullet(bullet)
    } else {
        createBullet(protagonist)
    }
}

function createBullet(protagonist) {
    var image = new Image();
    image.src = "../img/bullet.png";
    image.onload = function () {
        var bullet = new createjs.Bitmap(image);
        bullet.scaleX = 0.2;
        bullet.scaleY = 0.2;
        bullet.x = protagonist.x + protagonist.getBounds().width / 2
        bullet.y = protagonist.y
        bullet.rotation = -90
        stage.addChild(bullet);
        stage.update();
        moveBullet(bullet)
    }
}

function moveBullet(bullet) {
    var move = setInterval(
        function () {
            bullet.y -= 2
            bullet.setBounds(bullet.x, bullet.y, 20, 20);
            checkMonsterBullet(bullet)
            stage.update();
            if (bullet.y < 0) {
                clearInterval(move);
                bulletDie(bullet)
                bullet.setBounds(bullet.x, bullet.y, 20, 20);
            }
        }, 10);


}
function checkMonsterBullet(bullet) {
    monsters.forEach(arrMonster => {
        arrMonster.forEach(monster => {
            var impinge = getIndex(monster).intersects(bullet.getBounds())
            if (impinge) {
                monsterDie(monster)
                bulletDie(bullet)
                updateScores()
            }
        });
    });


}

function monsterDie(monster) {
    for (let index = 0; index < monsters.length; index++) {
        monsters[index].splice(monsters[index].indexOf(monster), 1);
        stage.removeChild(monster)
        if (monsters[index].length == 0) {
            monsters.splice(index, 1);
            exp < 4 ? exp += 1 : exp = 4
            createMonster(exp)
        }
    }
}
function bulletDie(obj) {
    obj.x = widthCV + obj.getBounds().width * 2
    obj.y = heightCV
    obj.alpha = 0
    arrBullet.push(obj)
}





function move(dx, dy) {
    if (Keys.up) protagonist.y -= dy;
    else if (Keys.down) protagonist.y += dy;
    if (Keys.left) protagonist.x -= dx;
    else if (Keys.right) protagonist.x += dx;
    stage.update();
}

function checkIntersection(monster) {
    var impinge = getIndex(monster).intersects(protagonist.getBounds())
    if (impinge == true && immortal == false) {
        monsterDie(monster)
        immortal = true
        updateLife()
        var tween1 = createjs.Tween.get(protagonist, { loop: -1, reversed: true })
            .to({ alpha: 0 }, 100, createjs.Ease.linear)
            .to({ alpha: 1 }, 100, createjs.Ease.linear)
        setTimeout(
            function () {
                immortal = false
                tween1.setPaused(true);
            }, 3000);
    }
}
function updateLife() {
    life -= 1
    if (life < 0) {
        alert("Hết mạng")
    }
    stage.removeChild(life_Text)
    life_Text = new createjs.Text(life, "20px Arial", "#ff7700");
    life_Text.x = 30;
    life_Text.y = 20
    stage.addChild(life_Text);
    stage.update();
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


// var a = [
//     [1,2,3],
//     [],
//     [4,5,6],
//     [7,8,9]
// ]
// a.forEach(element => {
//     console.log(element);
// });

// a.splice(1, 1);
// console.log(a.indexOf([1,2,3]));
// a.forEach(element => {
//     console.log(element);
// });