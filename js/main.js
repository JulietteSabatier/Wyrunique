import Level from "./level.js";
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

        players[currentPlayer].Player.merge(scene, players, cameras, currentPlayer)
        //mergePlayers(scene);

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

/// Create environement
function createScene() {
    let scene = new BABYLON.Scene(engine);
    scene.assetManager = configureAssetManager(scene);
    // background
    scene.clearColor = new BABYLON.Color3(1, 0, 1);

    var gravityVector = new BABYLON.Vector3(0,-9.81, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    scene.enablePhysics(gravityVector, physicsPlugin);

    let ground = createGround(scene);
    let freeCamera = createFreeCamera(scene);

    createAllSpheres(scene);

    //scene.activeCamera = freeCamera;
    scene.activeCamera = cameras[0];
    currentPlayer = 0;
    createLights(scene);

   return scene;
}

function createGround(scene) {
    const groundOptions = { width:2000, height:2000, subdivisions:20, minHeight:0, maxHeight:100};
    //scene is optional and defaults to the current scene
    const ground = BABYLON.MeshBuilder.CreateGround("ground", groundOptions, scene);
    const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("images/woodFloor.jpg");
    ground.material = groundMaterial;
    ground.material.diffuseTexture.uScale = 10;
    ground.material.diffuseTexture.vScale = 10;

    // to be taken into account by collision detection
    ground.checkCollisions = true;
    //groundMaterial.wireframe=true;
    // for physic engine
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground,
        BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0 }, scene);
    return ground;
}

/*
function createLabyrinthe(scene) {
    const labyrintheOptions = { width:2000, height:2000, subdivisions:200, minHeight:0, maxHeight:100};
    const labyrinthe = BABYLON.MeshBuilder.CreateGroundFromHeightMap("gdhm", 'images/Labyrinthe.bmp', labyrintheOptions, scene);
    const labyrintheMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    labyrintheMaterial.diffuseTexture = new BABYLON.Texture("images/woodFloor.jpg");
    labyrinthe.material = labyrintheMaterial;
    labyrinthe.material.diffuseTexture.uScale = 10;
    labyrinthe.material.diffuseTexture.vScale = 10;

    // to be taken into account by collision detection
    labyrinthe.checkCollisions = true;
    //labyrintheMaterial.wireframe=true;
    // for physic engine
    labyrinthe.physicsImpostor = new BABYLON.PhysicsImpostor(labyrinthe,
        BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0 }, scene);
    return labyrinthe;
}*/

/*
function createSphere(scene) {
    let ball = new BABYLON.MeshBuilder.CreateSphere("PlayerSphere", {diameter: 5}, scene);
    let sphereMaterial = new BABYLON.StandardMaterial("sphereMaterial", scene);
    sphereMaterial.diffuseTexture = new BABYLON.Texture("images/Ball.jpg", scene);
    ball.material = sphereMaterial;

    ball.position.y = 3;
    ball.frontVector = new BABYLON.Vector3(0, 0, 1);

    ball.physicsImpostor = new BABYLON.PhysicsImpostor(ball,
        BABYLON.PhysicsImpostor.SphereImpostor, { mass: 10, nativeOptions: {linearDamping: 0.35, angularDamping: 0.35} }, scene);

    return ball;
}*/

function createSphere(scene, players, cameras, name, nb, pos_y, pos_x, pos_z, diffuseColor){

    let sphereMesh = new BABYLON.MeshBuilder.CreateSphere("PlayerSphere", {diameter: 5}, scene);
    let sphere = new Player(nb, sphereMesh, scene);
    sphereMesh.position.y = pos_y;
    sphereMesh.position.x = pos_x;
    sphereMesh.position.z = pos_z;
    sphereMesh.frontVector = new BABYLON.Vector3(0, 0, 1);

    let sphereMaterial = new BABYLON.StandardMaterial("sphereMaterial", scene);
    sphereMaterial.diffuseTexture = new BABYLON.Texture("images/Ball.jpg", scene);
    sphereMaterial.diffuseColor = diffuseColor;
    sphereMesh.material = sphereMaterial;

    sphereMesh.physicsImpostor = new BABYLON.PhysicsImpostor(sphereMesh,
        BABYLON.PhysicsImpostor.SphereImpostor, { mass: 10, nativeOptions: {linearDamping: 0.35, angularDamping: 0.35} }, scene);

    players.push(sphereMesh);

    let followCamera = createFollowCamera(scene, sphereMesh);
    cameras.push(followCamera);

    sphereMesh.showBoundingBox = true;
}

function createAllSpheres(scene){
    // Sphere 1
    createSphere(scene, players, cameras, "player1", 0, 5, 0, 0, new BABYLON.Color3(1, 0, 0)); // rouge
    // Sphere 2
    createSphere(scene, players, cameras, "player2", 1, 5, 10, 10, new BABYLON.Color3(0, 1, 0));  // vert
    // Sphere 3
    createSphere(scene, players, cameras, "player3", 2, 5, -10, -10, new BABYLON.Color3(0, 0, 1)); // bleu
    // Sphere 4
    createSphere(scene, players, cameras, "player4", 3, 5, -10, 10, new BABYLON.Color3(1, 0, 1)); // violet
    // Sphere 5
    createSphere(scene, players, cameras, "player4", 5, 5, 10, -10, new BABYLON.Color3(0, 1, 1)); // cyan
}

/// Gestion Player
function movePlayer(numPlayer, scene, inputStates){
    let player = players[numPlayer];
    if (player){
        player.Player.move(scene, inputStates);
    }
}

function createMirror(scene, renderList) {
    var mirror = BABYLON.MeshBuilder.CreatePlane("mirror", {height: 30, width: 12}, scene);
    mirror.position.z = 10;
    mirror.position.y = 15;

    let mirrorMaterial = new BABYLON.StandardMaterial("mirrorMaterial", scene);

    // 1024 = size of the dynamically generated mirror texture
    mirrorMaterial.reflectionTexture = new BABYLON.MirrorTexture("mirrorTexture", 1024, scene, true);

    //Following lines from https://playground.babylonjs.com/#1YAIO7#5
    //Ensure working with new values for mirror by computing and obtaining its worldMatrix
    mirror.computeWorldMatrix(true);
    var mirror_worldMatrix = mirror.getWorldMatrix();

    //Obtain normals for plane and assign one of them as the normal
    var mirror_vertexData = mirror.getVerticesData("normal");
    var mirrorNormal = new BABYLON.Vector3(mirror_vertexData[0], mirror_vertexData[1], mirror_vertexData[2]);
    //Use worldMatrix to transform normal into its current value
    mirrorNormal = new BABYLON.Vector3.TransformNormal(mirrorNormal, mirror_worldMatrix)

    mirrorMaterial.reflectionTexture.mirrorPlane = new BABYLON.Plane.FromPositionAndNormal(mirror.position,
                                                                                            mirrorNormal.scale(-1));
	mirror.material = mirrorMaterial;

    mirror.material.reflectionTexture.renderList = renderList;

    return mirror;
}


function createLights(scene) {
    // i.e sun light with all light rays parallels, the vector is the direction.
    let light0 = new BABYLON.DirectionalLight("dir0", new BABYLON.Vector3(-1, -1, 0), scene);
    light0.position.z = 2;

}

function createFreeCamera(scene) {
    let camera = new BABYLON.FreeCamera("freeCamera", new BABYLON.Vector3(0, 50, 0), scene);
    camera.attachControl(canvas);
    // prevent camera to cross ground
    camera.checkCollisions = true;
    // avoid flying with the camera
    camera.applyGravity = true;

    // Add extra keys for camera movements
    // Need the ascii code of the extra key(s). We use a string method here to get the ascii code
    camera.keysUp.push('z'.charCodeAt(0));
    camera.keysDown.push('s'.charCodeAt(0));
    camera.keysLeft.push('q'.charCodeAt(0));
    camera.keysRight.push('d'.charCodeAt(0));
    camera.keysUp.push('Z'.charCodeAt(0));
    camera.keysDown.push('S'.charCodeAt(0));
    camera.keysLeft.push('Q'.charCodeAt(0));
    camera.keysRight.push('D'.charCodeAt(0));

    return camera;
}

function createFollowCamera(scene, target) {
    let camera = new BABYLON.ArcRotateCamera("playerFollowCamera",
                                                BABYLON.Tools.ToRadians(-90),
                                                BABYLON.Tools.ToRadians(20),
                                                70,
                                                scene.getMeshByName("PlayerSphere").position,
                                                scene);


    camera.attachControl(canvas, false, false, 0);
    camera.panningAxis = new BABYLON.Vector3(0, 0, 0);
    camera.lockedTarget = scene.getMeshByName("PlayerSphere");
	camera.cameraAcceleration = 0.1; // how fast to move
	camera.maxCameraSpeed = 5; // speed limit

    return camera;
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