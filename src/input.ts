"use strict"
var mouseLock = false;

var glCanvas = document.getElementById('GL_CANVAS') as HTMLCanvasElement;

var input = {
	rise : false,
	fall : false,
	forward : false,
	back : false,
	left : false,
	right : false,
	jump : false,
	mdX : 0,
	mdY : 0
};

function handleKeyDown(kbArgs) {
	switch(kbArgs.code) {
		case "KeyA":
			input.left = true;
			break;
		case "KeyD":
			input.right = true;
			break;
		case "KeyW":
			input.forward = true;
			break;
		case "KeyS":
			input.back = true;
			break;
		case "KeyR":
			input.rise = true;
			break;
		case "KeyF":
			input.fall = true;
			break;
		case "Space":
			input.jump = true;
			break;
		default:
			break;
	};
};

function handleKeyUp(kbArgs) {
	switch(kbArgs.code) {
		case "KeyA":
			input.left = false;
			break;
		case "KeyD":
			input.right = false;
			break;
		case "KeyW":
			input.forward = false;
			break;
		case "KeyS":
			input.back = false;
			break;
		case "KeyR":
			input.rise = false;
			break;
		case "KeyF":
			input.fall = false;
			break;
		case "Space":
			input.jump = false;
			break;
		default:
			break;
	};
}

function mouseLockChanged() {
	if(document.pointerLockElement === glCanvas) {
		mouseLock = true;
		document.addEventListener("mousemove", mouseMove, false);
		console.log("Locked");
	} else {
		mouseLock = false;
		document.removeEventListener("mousemove", mouseMove, false);
		console.log("Unlocked");
	}
};

function mouseMove(mouseArgs) {
	if(mouseLock === true) {
		input.mdX = mouseArgs.movementX;
		input.mdY = mouseArgs.movementY;
	}
};

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);
document.addEventListener("pointerlockchange", mouseLockChanged);