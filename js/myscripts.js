
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


var protagonist, widthP, heightP
var life = 3, immortal = false
var monsters = [], boundsMonsters = [], containerMonsters, widthM, heightM
var dx = 5, dy = 5
var arrBullet = []


var speed = 2


var totalWalls = 0
var totalBullet = 0








function init() {
    createjs.CSSPlugin.install();
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

    createBackground()

    createMonster(1)
    creatProtagonist()
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", stage);
}

function createBackground() {
    var image = new Image();
    image.src = "../img/bg.png";
    image.onload = function () {
        var bg = new createjs.Bitmap(image);
        bg.scaleX = widthCV / image.width;
        bg.scaleY = heightCV / image.height;
        stage.addChild(bg);
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

        protagonist.on("pressmove", function (evt) {
            evt.target.x = evt.stageX - 50;
            evt.target.y = evt.stageY - 50;
        });
        stage.update();
    }
}


function createMonster(exp) {
    var image = new Image();
    image.src = "../img/e" + exp + ".png";
    var monster
    image.onload = function () {
        monster = new createjs.Bitmap(image);
        monster.scaleX = 0.2;
        monster.scaleY = 0.2;
        widthM = image.width * 0.2
        heightM = image.height * 0.2
        monster.x = 0
        monster.y = 0


        monster.setBounds(monster.x, monster.y, widthM, heightM)
        monsters.push(monster)

        for (let i = 1; i < 6; i++) {
            var monsterClone = monsters[monsters.length - 1].clone();
            monsterClone.x = monsters[monsters.length - 1].x + widthM
            monsterClone.y = monster.y
            monsterClone.setBounds(monsterClone.x, monsterClone.y, widthM, heightM)
            monsters.push(monsterClone)
        }
        containerMonsters = new createjs.Container();
        monsters.forEach(monster => {
            containerMonsters.addChild(monster)
        });
        stage.addChild(containerMonsters);
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

    setInterval(function () {
        var xMax = monsters[monsters.length - 1].x + monsters[monsters.length - 1].getBounds().width
        var xMin = monsters[0].x
        // var width = monsters[monsters.length - 1].x - containerMonsters.x

        if ((widthCV - range) <= (xMax + speed)) calculation = false
        if ((xMin - speed) <= range) calculation = true
        console.log('calculation: ' + calculation);
        calculation ? monsterMoveRight() : monsterMoveLeft()
        stage.update();
    }, 20);
    setInterval(function () {
        monsters.forEach(monster => {
            monster.y += speed
        });
        stage.update();
    }, 500);

    // wall.x = 400
    // wall.y = 600

    // createjs.Tween.get(wall, { loop: -1, reversed: true })
    //     .to({ x: widthCV - range - wall.getBounds().width }, 1000, createjs.Ease.linear)
    //     .to({ x: defaultX }, 1000, createjs.Ease.linear)
    //     .addEventListener("change", handleChange);
    // function handleChange(event) {
    //     // console.log(event.target.target.x);
    // }
    // createjs.Tween.get(wall)
    //     .to({ y: wall.y + height }, 100000 / speed, createjs.Ease.linear)
    //     .addEventListener("change", handleChange);
    // function handleChange(event) {
    //     setInterval(
    //         () => {
    //             console.log('x: ' + event.target.target.x + '     y: ' + event.target.target.y);
    //             console.log('  ');
    //         }, 100);
    // }
}
function monsterMoveLeft() {
    monsters.forEach(monster => {
        monster.x -= speed
    });
}
function monsterMoveRight() {
    monsters.forEach(monster => {
        monster.x += speed
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
    checkIntersection()
    fire()
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
        console.log('get bullet arr');
        var bullet = arrBullet.pop()
        bullet.x = protagonist.x + protagonist.getBounds().width / 2
        bullet.y = protagonist.y
        bullet.alpha = 1
        moveBullet(bullet)
    } else {
        createBullet(protagonist)
        console.log('create new bullet');
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
    monsters.forEach(monster => {
        var impinge = getIndex(monster).intersects(bullet.getBounds())
        if (impinge) {
            monsterDie(monster)
            bulletDie(bullet)
        }
    });


}

function monsterDie(monster) {
    monsters.splice(monsters.indexOf(monster), 1);
    containerMonsters.removeChild(monster);
    if (monsters.length == 0) stage.removeChild(containerMonsters)


}
function bulletDie(obj) {
    console.log('call die');
    obj.x = widthCV + obj.getBounds().width * 2
    obj.y = heightCV
    obj.alpha = 0
    arrBullet.push(obj)
    console.log('arrBullet.length ');
    console.log(arrBullet.length);
}





function move(dx, dy) {
    if (Keys.up) protagonist.y -= dy;
    else if (Keys.down) protagonist.y += dy;
    if (Keys.left) protagonist.x -= dx;
    else if (Keys.right) protagonist.x += dx;
    stage.update();
}

function checkIntersection() {
    monsters.forEach(monster => {
        var impinge = getIndex(monster).intersects(protagonist.getBounds())
        if (impinge == true && immortal == false) {
            console.log('trừ mạng');
            monsterDie(monster)
            immortal = true
            life -= 1
            var tween1 = createjs.Tween.get(protagonist, { loop: -1, reversed: true })
                .to({ alpha: 0 }, 100, createjs.Ease.linear)
                .to({ alpha: 1 }, 100, createjs.Ease.linear)
            setTimeout(
                function () {
                    immortal = false
                    tween1.setPaused(true);
                }, 3000);
        }
    });
}

var myVar = setInterval(function () { console.log(life); }, 3000);
function fire() {
    if (life < 0) {
        clearInterval(myVar);
        console.log('hết mạng')
    }
}





