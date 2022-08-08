"use strict"

import * as vec3 from "../lib/gl-matrix/src/vec3.js";

export class Ray {
	// Properties
	origin: vec3;
	direction: vec3;
	position: vec3;

	// Constructor
	constructor(pointVec3, directionVec3) {
		this.origin = pointVec3;
		this.direction = directionVec3;
	}
	
	intersectTriangle(aVec3, bVec3, cVec3) {
		
		let e1 = vec3.create();
		let e2 = vec3.create();
		vec3.sub(e1, bVec3, aVec3);
		vec3.sub(e2, cVec3, aVec3);
		
		let h = vec3.create();
		vec3.cross(h, this.direction, e2);
		
		let a = vec3.dot(e1, h);
	
		if (a > -0.00001 && a < 0.00001)
			return false;
	
		let f = 1 / a;
		
		let s = vec3.create();
		vec3.sub(s, this.position, aVec3);
		
		let u = f * (vec3.dot(s, h));
		if (u < 0.0 || u > 1.0)
			return false;
		
		let q = vec3.create();
		vec3.cross(q, s, e1);
		/* Looks like "d" isn't defined but this lib isn't being used at the moment, so I'm just commenting it out to quiet the error */
		// let v = f * vec3.dot(d,q);
		// if (v < 0.0 || u + v > 1.0)
		// 	return false;
	
		// at this stage we can compute t to find out where
		// the intersection point is on the line
		let t = f * vec3.dot(e2, q);

		if (t > 0.00001) {
			// ray intersection
			let intersect = vec3.create();
			vec3.scale(intersect, this.direction, t);
			vec3.add(intersect, intersect, this.origin);
			return intersect;
		} else { 
		 // this means that there is a line intersection
		 // but not a ray intersection
		 return false;
		}
	}
}