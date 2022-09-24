"use strict";
import * as vec3 from "../../lib/gl-matrix/src/vec3.js";
import { TextureArray } from "../texturearray.js";
import { TerrainMesh } from "../terrainmesh.js";
import { gl, glCreateProgram } from "../gl.js";
// Terrain Shader : Static class for rendering game terrain.
export class terrain_shader {
    static initialize() {
        // Test texture
        this.terrainTexture = new TextureArray(32, 32, 256);
        var img = new Image();
        img.onload = (event) => { this.terrainTexture.setImage(img, 0); };
        img.src = "images/test-tileset.png";
        // Compile the shader.
        this.program = glCreateProgram(this.vs_code, this.fs_code);
        gl.useProgram(this.program);
        // Get the uniform locations for the view and projection matrixes.
        this.u_wMatrix = gl.getUniformLocation(this.program, "wMatrix");
        this.u_vMatrix = gl.getUniformLocation(this.program, "vMatrix");
        this.u_pMatrix = gl.getUniformLocation(this.program, "pMatrix");
        this.u_diffuse = gl.getUniformLocation(this.program, "diffuse");
        // Lighting colors.
        this.u_aLightColor = gl.getUniformLocation(this.program, "aLightColor");
        this.u_dLightColor = gl.getUniformLocation(this.program, "dLightColor");
        this.u_dLightDir = gl.getUniformLocation(this.program, "dLightDir");
        // Array indexes.
        this.i_position = gl.getAttribLocation(this.program, "position");
        this.i_normal = gl.getAttribLocation(this.program, "normal");
        this.i_tileId = gl.getAttribLocation(this.program, "tileId");
        // Initialize lighting colors and directions.
        // Ambient light color
        this.aLightColor = vec3.create();
        vec3.set(this.aLightColor, 0.7, 0.7, 0.2);
        // Directional light color
        this.dLightColor = vec3.create();
        vec3.set(this.dLightColor, 0.1, 0.1, 0.5);
        // Directional light direction
        this.dLightDir = vec3.create();
        vec3.set(this.dLightDir, 1, 0.45, 0.1);
        vec3.normalize(this.dLightDir, this.dLightDir);
        // Initialize the terrain mesh.
        this.mesh = new TerrainMesh(256, 256);
        // Initialize the vertex buffer.
        this.vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.mesh.verts, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        // Initialize the normal buffer.
        this.nBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.nBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.mesh.normals, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        // Initialize the tileId buffer.
        this.tBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.mesh.tileIds, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        // Initialize the index buffer.
        this.iBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
    static render(world, view, projection) {
        gl.useProgram(this.program);
        gl.uniformMatrix4fv(this.u_wMatrix, false, world);
        gl.uniformMatrix4fv(this.u_vMatrix, false, view);
        gl.uniformMatrix4fv(this.u_pMatrix, false, projection);
        gl.uniform3fv(this.u_aLightColor, this.aLightColor);
        gl.uniform3fv(this.u_dLightColor, this.dLightColor);
        gl.uniform3fv(this.u_dLightDir, this.dLightDir);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
        gl.enableVertexAttribArray(this.i_position);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
        gl.vertexAttribPointer(this.i_position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.i_position);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.nBuffer);
        gl.vertexAttribPointer(this.i_normal, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.i_normal);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
        gl.vertexAttribPointer(this.i_tileId, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(this.i_tileId);
        gl.drawElements(gl.TRIANGLES, this.mesh.indices.length, gl.UNSIGNED_SHORT, 0);
    }
    static setAmbient(red, green, blue) {
        this.aLightColor[0] = Math.max(Math.min(red, 1), 0);
        this.aLightColor[1] = Math.max(Math.min(green, 1), 0);
        this.aLightColor[2] = Math.max(Math.min(blue, 1), 0);
    }
    static setDirectionalLightColor(red, green, blue) {
        this.dLightColor[0] = Math.max(Math.min(red, 1), 0);
        this.dLightColor[1] = Math.max(Math.min(green, 1), 0);
        this.dLightColor[2] = Math.max(Math.min(blue, 1), 0);
    }
    static setDirectionalLightDirection(x, y, z) {
        vec3.set(this.dLightDir, x, y, z);
        vec3.normalize(this.dLightDir, this.dLightDir);
    }
}
// Vertex Shader Code
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
terrain_shader.vs_code = `#version 300 es
	precision lowp float;
	uniform mat4 wMatrix;
	uniform mat4 vMatrix;
	uniform mat4 pMatrix;
	
	uniform vec3 aLightColor;
	uniform vec3 dLightColor;
	uniform vec3 dLightDir;
	
	in vec3 position;
	in vec3 normal;
	in vec3 tileId;
	
	out vec4 f_color;
	out vec3 f_pos;
	out vec3 f_normal;
	
	flat out vec3 f_tileId;
	
	void main() {
		
		// Calculate the amount of direcitonal light the vertex receives
		// based on the angle it is to the light direction.
		float dot_light = max(dot(normal, dLightDir), 0.0);
		
		// Calculate the final light color for this vertex based on
		// ambient light + directional light calculations.
		f_color = vec4(aLightColor + (dLightColor * dot_light), 1);
		
		// Pass the vertex's world coordinate, tile id and vertex normal
		// to the fragment shader.
		
		f_pos = vec3(position.x, position.y, position.z);
		f_tileId = tileId;
		f_normal = normal;
		
		// Calculate screen space coordinates for the vertex.
		gl_Position = pMatrix * vMatrix * wMatrix * vec4(position.x, position.y, position.z, 1.0);
		
	}`;
// Fragment Shader Code 
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
terrain_shader.fs_code = `#version 300 es
	precision lowp float;
	
	uniform lowp sampler2DArray diffuse;
	
	in vec3 f_pos;
	in vec4 f_color;
	in vec3 f_normal;
	
	flat in vec3 f_tileId;
	
	out vec4 fragColor;
	
	void main() {
		
		// Texture scaling for 16x16 pixels per unit assuming 32x32 pixel tiles.
		vec3 uv = f_pos / 2.0; 
		
		// Fetch texel color from x, y and z projections.
		vec4 x_color = texture(diffuse, vec3(uv.z, -uv.y, f_tileId.x));
		vec4 y_color = texture(diffuse, vec3(uv.x, uv.z, f_tileId.y));
		vec4 z_color = texture(diffuse, vec3(-uv.y, uv.x, f_tileId.z));
		
		// Calculate triaxis blending for the fragment.
		// vec3 blend = normalize(f_normal * f_normal * f_normal * f_normal);
		vec3 blend = normalize(f_normal * f_normal * f_normal);

		float b = (blend.x + blend.y + blend.z);
		blend /= vec3(b, b, b);
		x_color *= abs(blend.x);
		y_color *= abs(blend.y);
		z_color *= abs(blend.z);
		
		// Write the fragment to the frame buffer.
		fragColor = f_color * vec4(x_color + y_color + z_color);
	}`;
;
//# sourceMappingURL=terrain-shader.js.map