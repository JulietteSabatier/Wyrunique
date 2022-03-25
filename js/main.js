import Player from "./Player.js"

let canvas;
let engine;
let scene;
let inputStates = {};
let currentPlayer;
let players = {};
let nb_player;
let cameras = {};
window.onload = startGame;

function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);
    scene = createScene();
    currentPlayer = 0;
    nb_player = 2;

    let sphere = scene.getMeshByName("player");
    // prevent the pointer to go outside the game window
    modifySetting();


    // main animation loop 60 times/s
    engine.runRenderLoop(() => {
        let deltaTime = engine.getDeltaTime();

        movePlayer(currentPlayer, scene, inputStates);

        console.log("currentPlayer: "+currentPlayer);
        scene.render();
    });
}

/// Create environement
function createScene() {
    let scene = new BABYLON.Scene(engine);
    // background
    scene.clearColor = new BABYLON.Color3(1, 0, 1);
    let ground = createGround(scene);
    let light = createLight(scene);
    let freeCamera = createFreeCamera(scene);


    let sphereMesh1 = new BABYLON.MeshBuilder.CreateSphere("player1",{ diameter:2, segments:32}, scene);
    let sphere1 = new Player(1, sphereMesh1,  scene);
    sphereMesh1.position.y = 0.9;
    sphereMesh1.position.x = 5;
    sphereMesh1.frontVector = new BABYLON.Vector3(0, 0, 1);
    players[0] = sphereMesh1;
    let followCamera1 = createFollowCamera(scene, sphereMesh1);
    cameras[0] = followCamera1;

    let sphereMesh2 = new BABYLON.MeshBuilder.CreateSphere("player2",{ diameter:2, segments:32}, scene);
    let sphere2 = new Player(2, sphereMesh2,  scene);
    sphereMesh2.position.y = 0.9;
    sphereMesh2.frontVector = new BABYLON.Vector3(0, 0, 1);
    players[1] = sphereMesh2;
    let followCamera2 = createFollowCamera(scene, sphereMesh2);
    cameras[1] = followCamera2;

    scene.activeCamera = followCamera1;

    return scene;
}

function createGround(scene){
    const groundOptions = { width:60, height:60 };
    let ground = BABYLON.MeshBuilder.CreateGround("theGround", groundOptions, scene);
    ground.checkCollisions = true;
    return ground
}

function createLight(scene){
    const direction = new BABYLON.Vector3(0,1,0);
    let light = new BABYLON.HemisphericLight("theLight", direction, scene);

    light.intensity = 0.3
    light.diffuse = new BABYLON.Color3(1, 1, 1); 
    return light;
} 

function createFreeCamera(scene){
    const position = new BABYLON.Vector3(0, 50, 0);
    let freeCamera = new BABYLON.FreeCamera("freeCamera", position, scene);
    freeCamera.setTarget(BABYLON.Vector3.Zero());

    freeCamera.attachControl(canvas);

    freeCamera.checkCollisions = true; // don't cross ground
    freeCamera.applyGravity = true; // don't fly

    // Key for camera movement
    freeCamera.keysUp.push('z'.charCodeAt(0));
    freeCamera.keysDown.push('s'.charCodeAt(0));
    freeCamera.keysLeft.push('q'.charCodeAt(0));
    freeCamera.keysRight.push('d'.charCodeAt(0));
    freeCamera.keysUp.push('Z'.charCodeAt(0));
    freeCamera.keysDown.push('S'.charCodeAt(0));
    freeCamera.keysLeft.push('Q'.charCodeAt(0));
    freeCamera.keysRight.push('D'.charCodeAt(0));

    return freeCamera;
}

function createFollowCamera(scene, target){

    let followCamera = new BABYLON.FollowCamera("followCamera", target.position, scene, target);

    followCamera.radius = 20; // how far from the object to follow
	followCamera.heightOffset = 8; // how high above the object to place the camera
	followCamera.rotationOffset = 180; // the viewing angle
	followCamera.cameraAcceleration = .1; // how fast to move
	followCamera.maxCameraSpeed = 5; // speed limit

    return followCamera;
}


/// Gestion Player
function movePlayer(numPlayer, scene, inputStates){
    let player = players[numPlayer];
    if (player){
        player.Player.move(scene, inputStates);
    }
}



window.addEventListener("resize", () => {
    engine.resize()
})

function modifySetting(){

    // Lock the pointer
    scene.onPointerDown = () => {
        if (!scene.alreadyLocked) {
            console.log("requesting pointer lock");
            canvas.requestPointerLock();
        }
        else{
            console.log("Pointer already locked");
        }
    }

    document.addEventListener("pointerlockchange", () => {
        let element = document.pointerLockElement || null;
        if (element) {
            scene.alreadyLocked = true;
        }
        else{
            scene.alreadyLocked = false;
        }
    })

    // key listener
    inputStates.left = false;
    inputStates.right = false;
    inputStates.up = false;
    inputStates.down = false;
    inputStates.space = false;

    //add the listener to the main, window object, and update the states
    window.addEventListener('keydown', (event) => {
        if ((event.key === "ArrowLeft") || (event.key === "q")|| (event.key === "Q")) {
            inputStates.left = true;
        } else if ((event.key === "ArrowUp") || (event.key === "z")|| (event.key === "Z")){
            inputStates.up = true;
        } else if ((event.key === "ArrowRight") || (event.key === "d")|| (event.key === "D")){
            inputStates.right = true;
        } else if ((event.key === "ArrowDown")|| (event.key === "s")|| (event.key === "S")) {
            inputStates.down = true;
        } else if (event.key === " ") {
            inputStates.space = true;
        } else if (event.key === "&") {
            inputStates.tab = true;
            currentPlayer = (currentPlayer+1)%nb_player;
            scene.activeCamera = cameras[currentPlayer];
        }
    }, false);
    
    //if the key will be released, change the states object 
    window.addEventListener('keyup', (event) => {
        if ((event.key === "ArrowLeft") || (event.key === "q")|| (event.key === "Q")) {
            inputStates.left = false;
        } else if ((event.key === "ArrowUp") || (event.key === "z")|| (event.key === "Z")){
            inputStates.up = false;
        } else if ((event.key === "ArrowRight") || (event.key === "d")|| (event.key === "D")){
            inputStates.right = false;
        } else if ((event.key === "ArrowDown")|| (event.key === "s")|| (event.key === "S")) {
            inputStates.down = false;
        }  else if (event.key === " ") {
            inputStates.space = false;
        } else if (event.key === "&") {
            inputStates.tab = false;
        }
    }, false);
}