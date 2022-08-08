"use strict";
import { gl, glCreateProgram } from "../gl.js";
import { CubeMap } from "../cubemap.js";
// Skybox Shader : static class for rendering the skybox.
export class skybox_shader {
    // Initialization function
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    static initialize() {
        this.program = glCreateProgram(this.vs_code, this.fs_code);
        gl.useProgram(this.program);
        this.texture = new CubeMap();
        // Get uniform locations
        this.u_vMatrix = gl.getUniformLocation(this.program, "vMatrix");
        this.u_pMatrix = gl.getUniformLocation(this.program, "pMatrix");
        this.u_skybox = gl.getUniformLocation(this.program, "skybox");
        // Get attribute location
        this.i_position = gl.getAttribLocation(this.program, "position");
        this.verts = new Float32Array([
            -1, 1, 1,
            -1, 1, -1,
            -1, -1, 1,
            -1, -1, -1,
            1, 1, 1,
            1, 1, -1,
            1, -1, 1,
            1, -1, -1, // 7 : RBN
        ]);
        this.indices = new Uint8Array([
            // Far Face
            0, 2, 4, 4, 2, 6,
            // Near Face
            1, 3, 5, 5, 3, 7,
            // Left Face
            0, 2, 1, 1, 2, 3,
            // Right Face
            4, 6, 5, 5, 6, 7,
            // Top Face
            5, 1, 4, 4, 1, 0,
            // Bottom Face
            2, 3, 7, 7, 6, 2
        ]);
        // Create the skybox quad.
        this.vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.verts, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        // Create the skybox indices
        this.iBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
    // Render function
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    static render(world, view, projection) {
        gl.useProgram(this.program);
        gl.uniformMatrix4fv(this.u_vMatrix, false, view);
        gl.uniformMatrix4fv(this.u_pMatrix, false, projection);
        gl.enableVertexAttribArray(this.i_position);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
        gl.vertexAttribPointer(this.i_position, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0);
    }
}
// Vertex Shader Code
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
skybox_shader.vs_code = `#version 300 es
	precision lowp float;
	
	uniform mat4 vMatrix;
	uniform mat4 pMatrix;
	
	in vec3 position;
	
	out vec3 f_vPos;
	
	void main() {
		
		f_vPos = (pMatrix * vec4(position, 1)).xyz;
		gl_Position = pMatrix * vMatrix * vec4(position, 1) ;
	}`;
// Fragment Shader Code 
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
skybox_shader.fs_code = `#version 300 es
	precision lowp float;
	
	uniform lowp samplerCube skybox;
	
	in vec3 f_vPos;
	
	out vec4 fragColor;
	
	void main() {
		fragColor = texture(skybox, normalize(f_vPos));
	}`;
;
//# sourceMappingURL=skybox-shader.js.map