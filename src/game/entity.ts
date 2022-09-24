"use strict"

import * as vec3 from "../lib/gl-matrix/src/vec3.js";
import { terrain_shader } from "../gl/shaders/terrain-shader.js";
import { physics } from "../game/physics.js";

export class Entity {
	// Properties
	position: vec3;
	velocity: vec3;
	
	heading: number;
	
	onGround: boolean;

	eyeHeight: number;
	viewAngles: vec3;

	constructor() {
		this.position = vec3.create();
		this.velocity = vec3.create();
		this.heading = 0;
		this.onGround = false;
	}
	
	update(game) {
		// Apply gravity.
		vec3.add(this.velocity, this.velocity, game.gravity);
		// Apply velocity.
		vec3.add(this.position, this.position, this.velocity);
	}
};

export class Player extends Entity {
	constructor() {
		super();
		this.eyeHeight = 4;
		this.viewAngles = vec3.create();
	}
	
	update(game) {

		// Process player input.
		let v = vec3.create();
		
		let right = vec3.fromValues(1, 0, 0);
		vec3.rotateY(right, right, v, -this.viewAngles[1]);
		
		let up = vec3.fromValues(0, 1, 0);
		let forward = vec3.fromValues(0, 0, -1);
		vec3.rotateY(forward, forward, v, -this.viewAngles[1]);
		
		if(input.rise) { this.position[1] += 0.1; }
		if(input.fall) { this.position[1] -= 0.1; }
		
		vec3.scale(v, forward, 0.05);
		
		if(this.onGround === true) {
			if(input.forward) {
				vec3.add(this.velocity, this.velocity, v);
			} else if(input.back) {
				vec3.sub(this.velocity, this.velocity, v);
			}
			
			vec3.scale(v, right, 0.05);
			if(input.left) { 
				vec3.sub(this.velocity, this.velocity, v);
			} else if(input.right) { 
				vec3.add(this.velocity, this.velocity, v);
			}
		}
		
		if(input.jump) {
			if(this.velocity[1] == 0) {
				this.velocity[1] = 0.25;
			}
		}
		
		// #TODO: We should genericize this to support friction per environment (air, water, etc.)
		// #TODO: This is framerate dependent. We should be factoring in the delta time here.
		// For now, lets only apply friction if we're "on the ground"
		if (this.onGround) {
			// Apply friction.
			this.velocity[0] *= 0.9;
			this.velocity[2] *= 0.9;
		} else {
			this.velocity[0] *= 0.99;
			this.velocity[0] *= 0.99;
		}
		
		// Apply gravity.
		vec3.add(this.velocity, this.velocity, game.gravity);
		//physics.rollOnTerrain(this, terrain_shader.mesh);
		physics.walkOnTerrain(this, terrain_shader.mesh);

		
		this.viewAngles[0] += (input.mdY * 0.005);
		this.viewAngles[1] += (input.mdX * 0.005);
		input.mdX = 0;
		input.mdY = 0;
	}
};