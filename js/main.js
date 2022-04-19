import Level from "./level.js";
import Menu from "./Menu.js";

let canvas;
let engine;
let inputStates = {};

let typeSceneShow;
let typeSceneClick;
let typeGuiShow;
let typeGuiClick;
let numLevelShow;
let numLevelClick;

let levels = [];
let menuScenes = [];
let advancedTexture;

window.onload = startGame;

function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);

    levels.push(new Level(0,engine, "The beginning"));
    modifySetting(levels[0].scene);
    levels.push(new Level(1, engine, "The following"));
    modifySetting(levels[1].scene);


    // Init to menu
    typeSceneShow = 0;
    typeSceneClick = 0;
    // Init to main menu
    typeGuiClick = 0;
    typeGuiShow = 0;
    // Init num level
    numLevelClick = 0;
    numLevelShow = 0;


    menuScenes.push(createMainMenu());
    menuScenes.push(createMainMenu());
    menuScenes.push(createMainMenu());
    menuScenes.push(createMainMenu());


    advancedTexture = createGuiMenu(0);
    setButtonGuiMenu();
    menuScenes[0].render();

    //createFreeCamera();


    engine.runRenderLoop(function () {
        let deltaTime = engine.getDeltaTime();
        if (typeSceneShow !== typeSceneClick){ // changer scene
            if ((typeSceneClick === 0) && (typeSceneShow === 1)){ // change from level to menu
                menuScenes[1].render(); // print level menu
                typeGuiShow = 1;
                typeGuiClick = 1;
            }
            else if ((typeSceneClick === 1) && (typeSceneShow === 0)){   // change from menu to level
                levels[numLevelShow].scene.render();     // current level
            }
            typeSceneShow = typeSceneClick;
        }
        else if (typeSceneShow === 0){  // scene menu
            if (typeGuiShow !== typeGuiClick){  // change menu
                advancedTexture["gui"].dispose();
                advancedTexture = createGuiMenu(typeGuiClick);
                setButtonGuiMenu()
                menuScenes[typeGuiClick].render();
                typeGuiShow = typeGuiClick;
            }
        }
        else if (typeSceneShow === 1){  // scene level
            levels[numLevelShow].scene.render();
            movePlayer(levels[typeSceneShow].currentPlayer, levels[numLevelShow], inputStates)
            //movePlayer(scene.currentPlayer, scene, inputStates);
            mergePlayer();

        }
    })

}

function createGuiMenu(numScene){
    switch (numScene){
        case 0:
            return Menu.createMainMenuGui(menuScenes[numScene]);
        case 1:
            return Menu.createLevelMenu(levels, menuScenes[numScene]);
        case 2:
            return Menu.createOptionsMenu(menuScenes[numScene]);
        case 3:
            return Menu.createCommandsMenu(menuScenes[numScene]);
    }
}

function setButtonGuiMenu(){

    if (typeGuiClick === 0){    // Main menu
        advancedTexture["play"].onPointerUpObservable.add(function(){
            typeGuiClick = 1;
            console.log("change to level menu");
        });

        advancedTexture["commands"].onPointerUpObservable.add(function (){
            typeGuiClick = 2;
            typeSceneShow = 0;
            console.log("Change to commands");
        });

        advancedTexture["options"].onPointerUpObservable.add(function (){
            typeGuiClick = 3;
            typeSceneShow = 0;
            console.log("Change to options");
        });
    }
    else if (typeGuiClick === 1){   // Level menu
        advancedTexture["return"].onPointerUpObservable.add(function(){
            typeGuiClick = 0;
            typeSceneClick = 0;
            console.log("Return level");
        });

        for (let i=0; i<levels.length; i++){
            advancedTexture["levels"][i].onPointerUpObservable.add(function(){
                numLevelShow = i;
                typeSceneClick = 1;

            })
        }
    }
    else if (typeGuiClick === 2){   // Command menu
        advancedTexture["return"].onPointerUpObservable.add(function(){
            typeGuiClick = 0;
            console.log("Return command");
        });
    }
    else if (typeGuiClick === 3){   // Options menu
        advancedTexture["return"].onPointerUpObservable.add(function(){
            typeGuiClick = 0;
            console.log("Return options");
        });
    }
}

function createMainMenu(){
    let scene = new BABYLON.Scene(engine);
    // background
    scene.clearColor = new BABYLON.Color3(0.2,0.2,0.2);

    let camera = new BABYLON.FreeCamera("fixCamera", new BABYLON.Vector3(0, 50, 0), scene, scene);
    scene.activeCamera = camera;
    camera.attachControl(canvas);

    createLights(scene);

    return scene;
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


/// Create environment
function createScene(id, name) {
    let scene = new BABYLON.Scene(engine);
    modifySetting(scene);
    //scene.assetManager = configureAssetManager(scene);
    // background
    if (id === 0){
        scene.clearColor = new BABYLON.Color3(1, 0, 1);
    }
    else{
        scene.clearColor = new BABYLON.Color3(1, 0, 0);
    }

    let gravityVector = new BABYLON.Vector3(0,-9.81, 0);
    let physicsPlugin = new BABYLON.CannonJSPlugin();
    levels[id].scene.enablePhysics(gravityVector, physicsPlugin);


    let ground = createGround(scene);
    let freeCamera = createFreeCamera(scene);

    levels[id] =  new Level(id, engine, name);


    //scene.activeCamera = freeCamera;
    levels[id].currentPlayer = 0;
    levels[id].scene.activeCamera = levels[id].cameras[0];
    createLights(levels[id].scene);

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
    return ground;
}


/// Gestion Player
function movePlayer(numPlayer, scene, inputStates){
    let player = levels[numLevelShow].players[levels[numLevelShow].currentPlayer];
    if (player){
        player.move(levels[numLevelShow].scene, inputStates);
    }
}

function mergePlayer(){
    let player = levels[numLevelShow].players[levels[numLevelShow].currentPlayer];
    if (player){
        player.merge(levels[numLevelShow].scene,
            levels[numLevelShow].players,
            levels[numLevelShow].cameras,
            levels[numLevelShow].currentPlayer);
    }
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
*/

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
    camera.keysUp.push('o'.charCodeAt(0));
    camera.keysDown.push('l'.charCodeAt(0));
    camera.keysLeft.push('k'.charCodeAt(0));
    camera.keysRight.push('m'.charCodeAt(0));
    camera.keysUp.push('O'.charCodeAt(0));
    camera.keysDown.push('L'.charCodeAt(0));
    camera.keysLeft.push('K'.charCodeAt(0));
    camera.keysRight.push('M'.charCodeAt(0));

    return camera;
}


window.addEventListener("resize", () => {
    engine.resize()
})

function modifySetting(scene){

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
            levels[numLevelShow].currentPlayer = (levels[numLevelShow].currentPlayer + 1) % levels[numLevelShow].players.length;
            console.log("Switching to camera " + levels[numLevelShow].currentPlayer);
            levels[numLevelShow].scene.activeCamera = levels[numLevelShow].cameras[levels[numLevelShow].currentPlayer];

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