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

    scene = createScene();

    // prevent the pointer to go outside the game window
    modifySetting();

    scene.toRender = () => {
        let deltaTime = engine.getDeltaTime();
        movePlayer(currentPlayer, scene, inputStates);

        mergePlayer();

        if (scene.currentLevel.canFinish) {
            scene.currentLevel.checkIfFinish();
        }

        scene.render();
    }

    scene.assetManager.load();

}


function configureAssetManager(scene){
    let assetsManager = new BABYLON.AssetsManager(scene);

    assetsManager.onProgress = function(remainingCount, totalCount, lastFinishedTask){
        engine.loadingUIText = "We are loading the scene. " + remainingCount + " out of " + totalCount + " items still need to be loaded";
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
    scene.shadowsEnabled = true;


    let gravityVector = new BABYLON.Vector3(0,-9.81, 0);
    let physicsPlugin = new BABYLON.CannonJSPlugin();
    scene.enablePhysics(gravityVector, physicsPlugin);

    createLights(scene);
    let ground = createGround(scene);
    let freeCamera = createFreeCamera(scene);
    scene.players = players;

    scene.cameras = cameras;

    scene.currentLevel = new Level(1, scene);
    scene.activeCamera = cameras[0];
    currentPlayer = 0;

   return scene;
}

function createGround(scene) {
    const groundOptions = { width:2000, height:2000, subdivisions:20, minHeight:0, maxHeight:100};
    //scene is optional and defaults to the current scene
    const ground = BABYLON.MeshBuilder.CreateGround("ground", groundOptions, scene);
    const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("images/woodFloor.jpg", scene);
    ground.material = groundMaterial;
    ground.material.diffuseTexture.uScale = 10;
    ground.material.diffuseTexture.vScale = 10;

    // to be taken into account by collision detection
    ground.checkCollisions = true;
    //groundMaterial.wireframe=true;
    // for physic engine
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground,
        BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0 }, scene);

    ground.receiveShadows = true;
    return ground;
}


/// Gestion Player
function movePlayer(numPlayer, scene, inputStates){
    let player = players[numPlayer];
    if (player){
        player.Player.move(scene, inputStates);
    }
}

function mergePlayer(){
    let player = players[currentPlayer];
    if (player){
        player.Player.merge(scene, players, cameras, currentPlayer);
    }
}


export function loadNextLevel() {
    players = [];
    cameras = [];
    scene = createScene()
}


function createLights(scene) {
    // i.e sun light with all light rays parallels, the vector is the direction.
    let light = new BABYLON.DirectionalLight("dir0", new BABYLON.Vector3(-1, -1, 0), scene);
    light.position.z = 2;

    scene.shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    scene.shadowGenerator.useBlurExponentialShadowMap = true;
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


window.addEventListener("resize", () => {
    engine.resize()
})

function modifySetting(){

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
            console.log("Switching to camera " + currentPlayer);
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