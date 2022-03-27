import Player from "./Player.js"

let canvas;
let engine;
let scene;
let inputStates = {};
let currentPlayer;
let players;
let cameras;

window.onload = startGame;

function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);

    players = [];
    cameras = [];

    scene = createScene(players, cameras);

    // prevent the pointer to go outside the game window
    modifySetting();

    scene.toRender = () => {
        let deltaTime = engine.getDeltaTime();
        console.log(currentPlayer);
        movePlayer(currentPlayer, scene, inputStates);
       
        mergePlayers(scene);

        scene.render();
    }

    scene.assetManager.load();

}


function configureAssetManager(scene){
    let assetsManager = new BABYLON.AssetsManager(scene);

    assetsManager.onProgress = function(remainingCount, totalCount, lastFinishedTask){
        engine.loadingUIText = " We are loading the scene. " + remainingCount + " out of " + totalCount + " items still need to be loaded";
    };

    assetsManager.onFinish = function(tasks) {
        engine.runRenderLoop(function(){
            scene.toRender();
        });
    };

    return assetsManager;
}

function mergePlayers(scene){

    for (let i=0; i < players.length; i=i+1){
        if (i != currentPlayer){
            let x = Object.values(players[i].getBoundingInfo()["boundingBox"]["centerWorld"])[1];
            let y =Object.values(players[i].getBoundingInfo()["boundingBox"]["centerWorld"])[2];
            let z = Object.values(players[i].getBoundingInfo()["boundingBox"]["centerWorld"])[3];
            if (!(x==0 && y==0 && z==0)){       // weirdly at the begin of the game x,y,z are at 0,0,0 and it touch the first ball
                if (players[currentPlayer].intersectsPoint({x,y,z}, true)){    
                    
                    players[i].dispose();
                    cameras[i].dispose();
                
                    players.splice(i, 1);
                    cameras.splice(i, 1);
                    if (i < currentPlayer){
                        currentPlayer = currentPlayer - 1;
                    }
                }
            }
        }
    }
}


/// Create environement
function createScene() {
    let scene = new BABYLON.Scene(engine);
    scene.assetManager = configureAssetManager(scene);
    // background
    scene.clearColor = new BABYLON.Color3(1, 0, 1);
    let ground = createGround(scene);
    let light = createLight(scene);
    let freeCamera = createFreeCamera(scene);

    createAllSpheres(scene);

    //scene.activeCamera = freeCamera;
    scene.activeCamera = cameras[0];
    currentPlayer = 0;

    return scene;
}

function createSphere(scene, players, cameras, name, nb, pos_y, pos_x, pos_z, diffuseColor){

    let sphereMesh = new BABYLON.MeshBuilder.CreateSphere(name, {diameter:2, segments:32}, scene);
    let sphere = new Player(nb, sphereMesh, scene);
    sphereMesh.position.y = pos_y;
    sphereMesh.position.x = pos_x;
    sphereMesh.position.z = pos_z;
    sphereMesh.frontVector = new BABYLON.Vector3(0, 0, 1);
    
    let sphereMaterial = new BABYLON.StandardMaterial("sphereMaterial", scene);
    sphereMaterial.diffuseColor = diffuseColor;
    sphereMesh.material = sphereMaterial;

    players.push(sphereMesh);

    let followCamera = createFollowCamera(scene, sphereMesh);
    cameras.push(followCamera);

    sphereMesh.showBoundingBox = true;
}

function createAllSpheres(scene){
    // Sphere 1    
    createSphere(scene, players, cameras, "player1", 0, 1, 5, 0, new BABYLON.Color3(1, 0, 0)); // rouge
    // Sphere 2
    createSphere(scene, players, cameras, "player2", 1, 1, 0, 0, new BABYLON.Color3(0, 1, 0));  // vert
    // Sphere 3
    createSphere(scene, players, cameras, "player3", 2, 1, -5, 0, new BABYLON.Color3(0, 0, 1)); // bleu
    // Sphere 4
    createSphere(scene, players, cameras, "player4", 3, 1, 5, 10, new BABYLON.Color3(1, 0, 1)); // violet
    // Sphere 5
    createSphere(scene, players, cameras, "player4", 5, 1, -5, -5, new BABYLON.Color3(0, 1, 1)); // cyan
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
            currentPlayer = (currentPlayer+1)%players.length;
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