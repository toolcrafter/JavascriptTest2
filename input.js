/* collection of methods related to input

    usage:

    let left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40);

      if (left.IsDown)
      {
          // code
      }
*/

var KeyCodes = Object.freeze({ "left": 37, "right": 39, "down": 40, "up": 38, "a": 65, "w": 87, "s": 83, "d": 68, "space": 32 })

function keyboard(keyCode) {

    let key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;

    // downHandler
    key.downHandler = event => {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        // event.preventDefault();
    };

    // upHandler
    key.upHandler = event => {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        // event.preventDefault();
    };

    // attach event listeners
    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );

    return key;
}