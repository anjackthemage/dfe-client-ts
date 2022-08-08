"use strict"

// Default Vertex Shader
var vs_default = `
	attribute vec2 position;
	void main() {
		gl_Position = vec4(position.x, position.y, 0.5, 1.0);
	}
`;

// Default Fragment Shader
var fs_default = `
	void main() {
		gl_FragColor = vec4(0, 0.5, 1, 1);
	}
`;