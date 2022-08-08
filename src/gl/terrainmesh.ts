"use strict"

import * as vec3 from "../lib/gl-matrix/src/vec3.js";

export class TerrainMesh {
	// Properties
	width: number;
	height: number;
	verts: Float32Array;
	tileIds: Float32Array;
	normals: Float32Array;
	indices: Uint16Array;
	
	constructor(width, height) {
		this.width = width;
		this.height = height;
		
		// TODO: Remove this test code!
		
		// Build the vertex array.
		this.verts = new Float32Array(width * height * 3);

		// Build the tile id array
		this.tileIds = new Float32Array(width * height * 3);
		for(var i = 0; i < this.tileIds.length; i++) {
			this.tileIds[i] = 1;
		}
		
		// Build and calculate the normal array.
		var norm = vec3.create();
		var i = 0;
		for(var z = 0; z < this.height; z++)
			for(var x = 0; x < this.width; x++) {
				this.verts[i] = x ;
				this.verts[i + 1] = 0;
				this.verts[i + 2] = z;
				i += 3;
			}

		var h = 0;
		for(var z = 16; z < 240; z++) {
			for(var x = 16; x < 240; x++) 
			{
					h = Math.sin(x / (Math.PI * 2)) + Math.cos(z / (Math.PI * 2)) + 2;
					h = h * 4;
					this.setHeight(z, x + 1 , h);
			}
		}

		
		var u, d, l, r;
		i = 0;
		this.normals = new Float32Array(width * height * 3);
		for(var z = 0; z < this.height; z++)
			for(var x = 0; x < this.width; x++) {
				l = this.getHeight(x - 1, z);
				r = this.getHeight(x + 1, z);
				u = this.getHeight(x, z - 1);
				d = this.getHeight(x, z + 1);
				norm[0] = l - r;
				norm[1] = 2.0;
				norm[2] = u - d;
				vec3.normalize(norm, norm);
				this.normals[i] = norm[0];
				this.normals[i + 1] = norm[1];
				this.normals[i + 2] = norm[2];
				i += 3;
			}
		
		// Build the index array.
		this.indices = new Uint16Array(((width - 1) * 6) * (height - 1));
		i = 0;
		var org = 0;
		for(var row = 0; row < this.height - 1; row++) {
			for(var col = 0; col < this.width - 1; col++) {
				org = (row * width) + col;
				// Triangle 1 of the quad.
				this.indices[i + 0] = org;
				this.indices[i + 1] = org + this.width;
				this.indices[i + 2] = org + 1;
				// Triangle 2 of the quad.
				this.indices[i + 3] = org + this.width;
				this.indices[i + 4] = org + this.width + 1;
				this.indices[i + 5] = org + 1;
				i += 6;
			}
		}
	}
	
	getHeightVec3(position) {
		let x = position[0] >> 0;
		let z = position[2] >> 0;
		let xf = position[0] - x;
		let zf = position[2] - z;
		
		// Select the vertexes of interest.
		let tl, tr, bl, br;
		
		// Find the vertex indexes.
		tl = (x + (z  * this.width)) * 3;
		tr = tl + 3;
		bl = tl + (this.width * 3);
		br = bl + 3;
		
		// Get the heights from the mesh.
		tl = this.verts[tl + 1];
		tr = this.verts[tr + 1];
		bl = this.verts[bl + 1];
		br = this.verts[br + 1];
		
		let h0 = tl + (xf * (tr - tl));
		let h1 = bl + (xf * (br - bl));
		
		return h0 + (zf * (h1 - h0));
	}
	
	getNormal(x, z) {
		let xf = x - (x >> 0);
		let zf = z - (z >> 0);
		x = x >> 0;
		z = z >> 0;
		// Select the vertexes of interest.
		let tl, tr, bl, br;
		
		// Find the vertex indexes.
		let a, b, c;
		if((xf + zf) < 1) {
			// a top triangle
			a = (x + (z  * this.width)) * 3;
			b = a + 3;
			c = a + (this.width * 3);
		} else {
			// a bottom triangle
			a = ((x + 1) + ((z + 1) * this.width)) * 3;
			b = a - 3;
			c = a - (this.width * 3);
		}
		let pa = vec3.fromValues(this.verts[a], this.verts[a + 1], this.verts[a + 2]);
		let pb = vec3.fromValues(this.verts[b], this.verts[b + 1], this.verts[b + 2]);
		let pc = vec3.fromValues(this.verts[c], this.verts[c + 1], this.verts[c + 2]);
		
		vec3.sub(pb, pb, pa);
		vec3.sub(pa, pc, pa);
		vec3.cross(pa, pa, pb);
		vec3.normalize(pa, pa);

		return pa;
	}
	
	getHeight(x, z) {
		x = x >> 0;
		z = z >> 0;
		x = Math.min(Math.max(x, 0), this.width - 1);
		z = Math.min(Math.max(z, 0), this.height - 1);
		return this.verts[((x + (z * this.width)) * 3) + 1];
	}
	
	setHeight(x, z, height) {
		x = Math.min(Math.max(x, 0), this.width - 1);
		z = Math.min(Math.max(z, 0), this.height - 1);
		this.verts[((x + (z * this.width)) * 3) + 1] = height;
	}
};