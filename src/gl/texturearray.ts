"use strict"

import { gl } from "./gl.js";

export class TextureArray {
	// Properties
	width: number;
	height: number;
	depth: number;
	handle: WebGLRenderingContext;

	// Constructor
	// width : width of each texture in the array, in pixels.
	// height : height of each texture in the array, in pixels.
	// depth : the number of (width x height) textures in this array.
	constructor(width, height, depth) {
		this.width = width;
		this.height = height;
		this.depth = depth;
		
		// Generate placeholder textures.
		var pixels = new Uint8Array(width * height * depth * 4);
		for(var i = 0; i < depth; i++) {
			for(var j = 0; j < width * height; j ++) {
				var k = (i * width * height * 4) + (j * 4);
				pixels[k] = 0x00;
				if(j % width == 0 || j < width || j == ((2 * width) + 2)) {
					pixels[k + 1] = 0x80;
					pixels[k + 2] = 0xC0;
				} else if (j % width == (width / 2) 
				       ||  (j >= width * (height / 2) 
					        && j < width * ((height / 2) + 1))) {
					pixels[k + 1] = 0x30;
					pixels[k + 2] = 0x50;
				} else {
					pixels[k + 1] = 0x20;
					pixels[k + 2] = 0x40;
				}
				pixels[k + 3] = 0xFF;
			}
		}
		
		
		// Create the texture handle.
		this.handle = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.handle);
		
		// Initialize the texture.
		gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.RGBA,
		this.width, this.height, this.depth, 0,
		gl.RGBA, gl.UNSIGNED_BYTE, pixels);

		// Set texture properties.
		gl.texParameteri(gl.TEXTURE_2D_ARRAY, 
			gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D_ARRAY, 
			gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D_ARRAY,
			gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D_ARRAY,
			gl.TEXTURE_WRAP_T, gl.REPEAT);
	}
	
	// setImage (image, index)
	// image : The source Image object to copy data from.
	// index : The texture index to copy the data to.
	setImage(image: HTMLImageElement, index: number) {
		if(index < 0 || index >= this.depth) { return; }
		gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.handle);
		
		gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 
		0, 0, index, 
		this.width, this.height, 1,
		gl.RGBA, gl.UNSIGNED_BYTE, 
		image);
	}
}