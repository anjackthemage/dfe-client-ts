/* 
	gl.js				
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	OpengGL Canvas, Context and support functions.							   
   
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
*/

"use strict"

import { gl_state } from "./gl-state.js";
import { terrain_shader } from "./shaders/terrain-shader.js";
import { skybox_shader } from "./shaders/skybox-shader.js";

// The GL DOM Canvas
export var glCanvas = null;
// The GL Context
export var gl = null;

// glCheckError - Check for errors and log them if present.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export function glCheckError(doing) {
	var errorCode = gl.getError();
	if(errorCode === gl.NO_ERROR) return;
	console.log("GL Error from " + doing + " : " + errorCode);
}

// glDebug - Debug console writer for development purposes.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export function glDebug(message) {
	console.log("GL Debug : " + message);
}

// glInit - Initialize WebGL and get a context.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export function glInit() {
	
	console.log("- Initializing OpenGL.");
	
	// Check for WebGL Support
	if(!window.WebGLRenderingContext) {
		glDebug("WebGL Rendering Context not Supported.");
		return false;
	}

	// Attempt to get WebGL context.
	glCanvas = document.getElementById("GL_CANVAS");
	gl = glCanvas.getContext("webgl2");
	if(!gl) {
		glDebug("Unable to Create OpenGL Context.");
		return false;
	}
	// Initialize rendering state.
	gl_state.initialize();
	
	// Initialize shaders.
	terrain_shader.initialize();
	skybox_shader.initialize();
	
	// Setup mouse locking for input.
	glCanvas.onclick = function() { 
		glCanvas.requestPointerLock(); 
	};
	return true;
};

// glCompile - Compile a Shader
// ARGS :
// string sourceCode : the source code of the shader to compile.
// int type : the type of shader to comple, one of VERTEX_SHADER or
//   FRAGMENT_SHADER
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export function glCompile(sourceCode, type) {
	// Compile the shader
	var shader = gl.createShader(type);
	gl.shaderSource(shader, sourceCode);
	gl.compileShader(shader);
	// Check for any compilation errors.
	if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		glDebug("Error compiling " +
		  (type == gl.VERTEX_SHADER ? "vertex" : "fragment") + " shader : " +
			gl.getShaderInfoLog(shader));
	}
	return shader;
};

// glCreateProgram - Creates a GL Shader Program
// ARGS :
// string vertexSource : Source code of the vertex shader program
// string fragmentSource : Source code of the fragment shader program
// RETURNS:
// A compiled shader program.
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
export function glCreateProgram(vertexSource, fragmentSource) {
	var program = gl.createProgram();
	// Compile the shader programs.
	var vShader = glCompile(vertexSource, gl.VERTEX_SHADER);
	var fShader = glCompile(fragmentSource, gl.FRAGMENT_SHADER);
	// Attach and link the shaders to complete the program.
	gl.attachShader(program, vShader);
	gl.attachShader(program, fShader);
	gl.linkProgram(program);
	return program;
};