/* 
	gl-state.js				
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	gl_state global
	
	Holds the rendering state, properties and rendering calls.
   
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/

"use strict"

import * as mat4 from "../lib/gl-matrix/src/mat4.js";
import { terrain_shader } from "./shaders/terrain-shader.js";
import { gl, glCanvas } from "./gl.js";
import { skybox_shader } from "./shaders/skybox-shader.js";

export class gl_state {
	static FOV: number;
	static mat_world: any;
	static mat_view : any;
	static mat_project : any;
	
	static initialize() {
		// Setup the camera.
		this.FOV = Math.PI / 2.8;
		this.mat_world = mat4.create();
		this.mat_view = mat4.create();
		this.mat_project = mat4.create();
		mat4.perspective(this.mat_project, this.FOV, 
		glCanvas.width / glCanvas.height, 0.0625, 256);
	}
	
	static setView(vPosition, qView) {
		this.mat_world = mat4.fromTranslation(this.mat_world, vPosition);
		this.mat_view = mat4.fromQuat(this.mat_view, qView);
	}
	
// glRender - Render loop, hooks a requestAnimationFrame callback from the
//				    browser window.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	static render() {		
		// Clear all buffers.
		gl.clearDepth(255);
		gl.depthFunc(gl.LESS);
	
		gl.clearColor(0, 0.1, 0.2, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		// Draw to the entire canvas.
		gl.viewport(0, 0, glCanvas.width, glCanvas.height);
		
		gl.disable(gl.DEPTH_TEST);
		skybox_shader.render(this.mat_world, this.mat_view, this.mat_project);
		gl.enable(gl.DEPTH_TEST);
		terrain_shader.render(this.mat_world, this.mat_view, this.mat_project);
	
		gl.flush();
	}
};