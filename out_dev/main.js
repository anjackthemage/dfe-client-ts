"use strict";
import { gl_state } from "./gl/gl-state.js";
import { game } from "./game/game.js";
import { glInit, glDebug } from "./gl/gl.js";
var Game = new game();
function gameLoop() {
    Game.update();
    gl_state.render();
    // Request callback on next animation frame.
    window.requestAnimationFrame(gameLoop);
}
;
Game.initialize();
if (glInit() === false) {
    glDebug("OpenGL failed to initialize.");
}
else {
    glDebug("OpenGL initialized.");
}
window.requestAnimationFrame(gameLoop);
//# sourceMappingURL=main.js.map