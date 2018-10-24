// @ts-check

// global variables
var app;

var PIXI; // created elsewhere
var TWEEN; // created elsewhere

var playerSprite;
var boxSprite;

var hasStarted = false;
var message;

var canvasWidth, canvasHeight;

// keyboard
var leftKey, rightKey, upKey, downKey, aKey, wKey, sKey, dKey, spaceKey;

var testTween;
var coords;

var hasInteractedOnce = false;

// called once when the application starts
function applicationStart() {

    //Create a Pixi Application
    canvasWidth = document.documentElement.clientWidth;
    canvasHeight = document.documentElement.clientHeight;

    PIXI.utils.skipHello();

    app = new PIXI.Application({
        forceCanvas: true,
        width: canvasWidth,
        height: canvasHeight
    });

    //app.renderer.backgroundColor = 0x9F7971;
    app.renderer.backgroundColor = 0xC4AE95;

    app.renderer.view.style.position = "absolute";
    app.renderer.view.style.display = "block";
    app.renderer.autoResize = true;
    app.renderer.resize(window.innerWidth, window.innerHeight);

    //Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(app.view);

    PIXI.loader
        .add("images/player.png")
        .add("images/box.jpg")
        .load(loadingFinished);

    app.ticker.add(gameLoop);
}

// called when all textures have been loaded
function loadingFinished() {
    playerSprite = new PIXI.Sprite(
        PIXI.loader.resources["images/player.png"].texture
    );

    addBox();

    app.stage.addChild(playerSprite);

    // set scale
    // playerSprite.scale.x = 1;
    // playerSprite.scale.y = 1;

    // set position
    playerSprite.x = 300;
    playerSprite.y = 300;

    // set rotation
    // playerSprite.rotation = 0.5;

    // set pivot point of sprite to center
    playerSprite.anchor.x = 0.5;
    playerSprite.anchor.y = 0.5;

    hasStarted = true;

    playerSprite.vx = 1;
    playerSprite.vy = 1;

    let style = new PIXI.TextStyle({
        fontFamily: "Arial",
        fontSize: 36,
        fill: "white",
        // stroke: '#ff3300',
        // strokeThickness: 4,
        // dropShadow: true,
        // dropShadowColor: "#000000",
        // dropShadowBlur: 4,
        // dropShadowAngle: Math.PI / 6,
        // dropShadowDistance: 6,
    });

    message = new PIXI.Text("Hello!", style);
    app.stage.addChild(message);
    message.position.set(54, 96);

    spaceKey = keyboard(KeyCodes.space)
    leftKey = keyboard(KeyCodes.left);
    upKey = keyboard(KeyCodes.up);
    rightKey = keyboard(KeyCodes.right);
    downKey = keyboard(KeyCodes.down);
    aKey = keyboard(KeyCodes.a);
    wKey = keyboard(KeyCodes.w);
    sKey = keyboard(KeyCodes.s);
    dKey = keyboard(KeyCodes.d);

    coords = { x: 0, y: 0 };
    testTween = new TWEEN.Tween(coords)
        .to({ x: 700, y: 200 }, 500)
        .easing(TWEEN.Easing.Elastic.In)
        .onUpdate(function () {
            boxSprite.visible = true;
            boxSprite.position.set(coords.x, coords.y);
        })
        // .onComplete(function() {
        //     testTween.start();
        // })
        .onComplete(function () { coords.x = 0; coords.y = 0; });

    testTween.chain(testTween);
    testTween.start();

    spaceKey.press = spaceKeyPressed;

    boxSprite.interactive = true;
    boxSprite.on('pointerdown', () => { punchObject(boxSprite, 400) });

    // PIXI.sound.add('bird', 'sounds/blip.wav');
    // PIXI.sound.play('bird');

    // PIXI.sound.Sound.from({
    //     url: 'sounds/blip.wav',
    //     autoPlay: true,
    //     complete: function() {
    //         console.log('Sound finished');
    //     }
    // });
    var audio = new Audio('sounds/blip.wav');

    app.stage.interactive = true;
    app.stage.on('pointerdown', () => {
        hasInteractedOnce = true;
        audio.play();
        console.log("play audio");
    })
}

function spaceKeyPressed() {
    punchObject(playerSprite, 500);
}

function punchObject(spriteObject, time) {
    let parameters = { size: 1 };
    var tween = new TWEEN.Tween(parameters)
        .to({ size: 2 }, time)
        .easing(TWEEN.Easing.Elastic.Out)
        .onUpdate(function () {
            spriteObject.scale.x = parameters.size;
            spriteObject.scale.y = parameters.size;
        })
        .chain(new TWEEN.Tween(parameters)
            .to({ size: 1 }, time * 0.35)
            .easing(TWEEN.Easing.Elastic.Out)
            .onUpdate(function () {
                spriteObject.scale.x = parameters.size;
                spriteObject.scale.y = parameters.size;
            }));
    tween.start();
}

function addBox() {
    boxSprite = new PIXI.Sprite(PIXI.loader.resources["images/box.jpg"].texture);
    app.stage.addChild(boxSprite);
    boxSprite.x = 200;
    boxSprite.y = 200;

    boxSprite.anchor.x = 0.5;
    boxSprite.anchor.y = 0.5;

    boxSprite.hitArea = new PIXI.Rectangle(-boxSprite.width * 0.5, -boxSprite.height * 0.5, boxSprite.width, boxSprite.height);

    boxSprite.visible = false;
}

function gameLoop(delta) {
    if (hasStarted) {

        let speed = 15;

        let vx = 0;
        if (leftKey.isDown || aKey.isDown) {
            vx = -1;
        }
        if (rightKey.isDown || dKey.isDown) {
            vx = 1;
        }

        let vy = 0;
        if (upKey.isDown || wKey.isDown) {
            vy = -1;
        }
        if (downKey.isDown || sKey.isDown) {
            vy = 1;
        }

        playerSprite.vx = vx * speed;
        playerSprite.vy = vy * speed;

        playerSprite.x += playerSprite.vx * delta;
        playerSprite.y += playerSprite.vy * delta;

        keepObjectOnStage(playerSprite);

        TWEEN.update(app.ticker.lastTime);
    }
}

function keepObjectOnStage(spriteObject) {
    let marginX = spriteObject.width * 0.5;
    let marginY = spriteObject.height * 0.5;

    if (spriteObject.x < marginX) {
        spriteObject.x = marginX;
    }
    if (spriteObject.x > canvasWidth - marginX) {
        spriteObject.x = canvasWidth - marginX;
    }

    if (spriteObject.y < marginY) {
        spriteObject.y = marginY;
    }
    if (spriteObject.y > canvasHeight - marginY) {
        spriteObject.y = canvasHeight - marginY;
    }
}