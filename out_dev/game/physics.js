"use strict";
import * as vec3 from "../lib/gl-matrix/src/vec3.js";
export class physics {
    static rollOnTerrain(entity, terrainMesh) {
        // Find the terrain height for the current position.
        let minHeight = Math.max(terrainMesh.getHeightVec3(entity.position), 0);
        if (entity.position[1] <= minHeight) {
            // Apply the normal of the current terrain tris to velocity.
            let n = terrainMesh.getNormal(entity.position[0], entity.position[2]);
            vec3.normalize(n, n);
            let t = vec3.dot(entity.velocity, n);
            vec3.scale(n, n, t);
            vec3.sub(entity.velocity, entity.velocity, n);
            entity.position[1] = minHeight;
            entity.velocity[1] = 0;
        }
        // Apply velocity.
        vec3.add(entity.position, entity.position, entity.velocity);
    }
    static walkOnTerrain(entity, terrainMesh) {
        // Find the change in slope.
        let nPos = vec3.clone(entity.position);
        vec3.add(nPos, nPos, entity.velocity);
        nPos[1] = terrainMesh.getHeightVec3(nPos);
        let slope = nPos[1] - entity.position[1];
        if (slope <= 0) {
            // No need to modify the velocity.
        }
        else if (slope > 0) {
            if (slope >= 0.2) {
                entity.velocity[1] -= 0.1;
                // Apply the normal of the current terrain tris to velocity.
                let n = terrainMesh.getNormal(entity.position[0], entity.position[2]);
                vec3.normalize(n, n);
                let t = vec3.dot(entity.velocity, n);
                vec3.scale(n, n, t);
                vec3.sub(entity.velocity, entity.velocity, n);
            }
            else {
                // Apply some resistence to the velocity.
                entity.velocity[0] /= (1 + slope);
                entity.velocity[2] /= (1 + slope);
            }
            if (Math.abs(entity.velocity[0]) < 0.001)
                entity.velocity[0] = 0;
            if (Math.abs(entity.velocity[2]) < 0.001)
                entity.velocity[2] = 0;
        }
        // Apply velocity.
        vec3.add(entity.position, entity.position, entity.velocity);
        // Find the terrain height for the current position.
        let minHeight = Math.max(terrainMesh.getHeightVec3(entity.position), 0);
        if (entity.position[1] <= minHeight) {
            entity.position[1] = minHeight;
            entity.velocity[1] = 0;
            if (slope < 0.2) {
                entity.onGround = true;
            }
        }
        else {
            entity.onGround = false;
        }
    }
    static fallOnTerrain(entity, terrainMesh) {
    }
}
;
//# sourceMappingURL=physics.js.map