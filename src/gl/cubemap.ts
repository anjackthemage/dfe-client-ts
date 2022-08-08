"use strict"

import { gl } from "./gl.js";

export class CubeMap {
	// Properties
	width: number;
	height: number;
	handle: WebGLRenderingContext;

	// Constructor
	constructor() {
		
		// Placeholder texture defaults.
		const level = 0;
		const internalFormat = gl.RGBA8;
		const width = 512;
		const height = 512;
		const border = 0;
		const srcFormat = gl.RGBA;
		const srcType = gl.UNSIGNED_BYTE;

		this.width = width;
		this.height = height;
		
		// Create the texture handle and bind it.
		this.handle = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.handle);
		
		// Generate placeholder cubemap textures.
		var pixels = new Uint8Array(width * height * 4);
		for(var face = 0; face < 6; face++) {
			var i = 0;
			for(var y = 0; y < this.height; y++) {
				for(var x =0; x < this.width; x++) {
					if(face != 3) {
						if(Math.random() > (0.95 + (y * 0.0002))) {
							var r = Math.random() * 64;
							pixels[i] = r;
							pixels[i + 1] = r;
							pixels[i + 2] = r;
							pixels[i + 3] = 255;
						}  else {
							pixels[i] = 0;
							pixels[i + 1] = 0;
							pixels[i + 2] = y / 32;
							pixels[i + 3] = 255;
						}
					} else {
							pixels[i] = 0;
							pixels[i + 1] = 0;
							pixels[i + 2] = 256 / 16;
							pixels[i + 3] = 255;
					}
					i += 4;
					
				}
			}
			// Write the pixel data.
			gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + face, 
			0, gl.RGBA, this.width, this.height,
			0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
		}
		// Set texture properties.
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	}
}