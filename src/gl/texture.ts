"use strict"

import { gl } from "./gl.js";

class Texture {
	// Properties
	width: number;
	height: number;
	pixelData: Uint8Array;
	handle: WebGLRenderingContext;

	// Constructor
	constructor() {
		
		// Placeholder texture defaults.
		const level = 0;
		const internalFormat = gl.RGBA8;
		const width = 2048;
		const height = 2048;
		const border = 0;
		const srcFormat = gl.RGBA;
		const srcType = gl.UNSIGNED_BYTE;

		this.width = width;
		this.height = height;
		// Checkerboard pattern
		this.pixelData = new Uint8Array(width * height * 4);
		var i = 0;
		for(var y = 0; y < width; y++) {
			for(var x = 0; x < height; x++) {
				if((x + y) % 2 == 0) {
					this.pixelData[i + 0] = Math.random() * 0x30;
					this.pixelData[i + 1] = 0x40 + Math.random() * 0x50;
					this.pixelData[i + 2] = Math.random() * 0x40;
				} else {
					this.pixelData[i + 0] = Math.random() * 0x30;
					this.pixelData[i + 1] = 0x40 + Math.random() * 0x40;
					this.pixelData[i + 2] = Math.random() * 0x30;
				}
				this.pixelData[i + 3] = 255;
				
				i += 4;
			}
		}
			
		
		// Create the texture handle and bind it.
		this.handle = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.handle);
		// Write the pixel data.
		gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, 
			border, srcFormat, srcType, this.pixelData);
		// Set texture properties.
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	}
}