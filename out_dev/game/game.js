"use strict";
import * as vec3 from "../lib/gl-matrix/src/vec3.js";
import * as quat from "../lib/gl-matrix/src/quat.js";
import { Player } from "./entity.js";
import { gl_state } from "../gl/gl-state.js";
export class game {
    constructor() {
        this.eyeHeight = 4;
        this.player = new Player();
    }
    initialize() {
        this.viewAngles = vec3.create();
        this.position = vec3.create();
        this.gravity = vec3.fromValues(0, -0.01, 0);
        // Create player entity.
        this.player = new Player();
        this.player.position[0] = 128;
        this.player.position[1] = 128;
    }
    update() {
        let p = this.player;
        p.update(this);
        // Calculate view Quaternion from viewAngle radians.
        let qView = quat.create();
        let v = vec3.create();
        quat.rotateX(qView, qView, p.viewAngles[0]);
        quat.rotateY(qView, qView, p.viewAngles[1]);
        let eyeLoc = vec3.clone(p.position);
        eyeLoc[1] += this.eyeHeight;
        gl_state.setView(vec3.negate(v, eyeLoc), qView);
    }
}
;
//# sourceMappingURL=game.js.map