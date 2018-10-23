// @ts-check

// global variables
var app;
var PIXI;
var playerSprite;

var hasStarted = false;
var message;

var canvasWidth, canvasHeight;

var left, right, up, down; // movement keys

// called once when the application starts
function applicationStart() {

    //Create a Pixi Application
    canvasWidth = document.documentElement.clientWidth;
    canvasHeight = document.documentElement.clientHeight;

    app = new PIXI.Application({
        forceCanvas: true,
        width: canvasWidth,
        height: canvasHeight
    });

    app.renderer.backgroundColor = 0x9F7971;

    app.renderer.view.style.position = "absolute";
    app.renderer.view.style.display = "block";
    app.renderer.autoResize = true;
    app.renderer.resize(window.innerWidth, window.innerHeight);

    //Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(app.view);

    PIXI.loader
        .add("images/player.png")
        .load(loadingFinished);

    app.ticker.add(gameLoop);
}

// called when all textures have been loaded
function loadingFinished() {
    playerSprite = new PIXI.Sprite(
        PIXI.loader.resources["images/player.png"].texture
    );

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
        stroke: '#ff3300',
        strokeThickness: 4,
        dropShadow: true,
        dropShadowColor: "#000000",
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
      });

    message = new PIXI.Text("Hello Pixi!", style);
    app.stage.addChild(message);
    message.position.set(54, 96);

    left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40);
}

function gameLoop(delta) {
    if (hasStarted) {

        let speed = 5;

        let vx = 0;
        if (left.isDown)
        {
            vx = -1;
        }
        if (right.isDown){
            vx = 1;
        }

        let vy = 0;
        if (up.isDown)
        {
            vy = -1;
        }
        if (down.isDown)
        {
            vy = 1;
        }

        playerSprite.vx = vx * speed;
        playerSprite.vy = vy * speed;

        playerSprite.x += playerSprite.vx * delta;
        playerSprite.y += playerSprite.vy * delta;

        containObject(playerSprite);

        message.text = delta;
    }
}

function containObject(spriteObject)
{
    let marginX = spriteObject.with * 0.5;
    let marginY = spriteObject.height * 0.5;

    if (spriteObject.x < marginX)
    {
        spriteObject.x = marginX;    
    }
    if (spriteObject.x > canvasWidth - marginX)
    {
        spriteObject.x = canvasWidth - marginX;
    }

    if (spriteObject.y < marginY)
    {
        spriteObject.y = marginY;    
    }
    if (spriteObject.y > canvasHeight - marginY)
    {
        spriteObject.y = canvasHeight - marginY;
    }
}