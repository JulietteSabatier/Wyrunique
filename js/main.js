import Level from "./level.js";
import Menu from "./Menu.js";

let canvas;
let engine;
let scene;
let inputStates = {};
let currentPlayer;
let players = [];
let cameras = [];

let levelScenes = [];

let typeSceneShow;
let typeSceneClick;
let typeGuiShow;
let typeGuiClick;
let numLevelShow;
let numLevelClick;

let menuScenes = [];
let advancedTexture = [];

window.onload = startGame;

function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);

    levelScenes.push(createScene1());
    levelScenes.push(createScene2());

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




    // prevent the pointer to go outside the game window
    modifySetting();

    advancedTexture[0] = Menu.createMainMenuGui(menuScenes[0]);
    advancedTexture[1] = Menu.createLevelMenu(levelScenes, menuScenes[1]);
    advancedTexture[2] = Menu.createCommandsMenu(menuScenes[2]);
    advancedTexture[3] = Menu.createOptionsMenu(menuScenes[3]);
    setButtonGuiMenu();

    menuScenes[0].render();

    engine.runRenderLoop(function () {
        let deltaTime = engine.getDeltaTime();

        if (typeSceneShow !== typeSceneClick){ // changer scene
            if ((typeSceneClick === 0)){ // change to menu
                menuScenes[1].render(); // print level menu
                typeGuiShow = 1;
                typeGuiClick = 1;
            }
            else if (typeGuiClick === 1){   // change to level
                levelScenes[numLevelShow].render();     // current level
            }
            typeSceneShow = typeSceneClick;
        }
        else if (typeSceneShow === 0){  // scene menu
            if (typeGuiShow !== typeGuiClick){  // change menu
                menuScenes[typeGuiClick].render();
                typeGuiShow = typeGuiClick;
            }
        }
        else if (typeSceneShow === 1){  // scene level
            /*
            movePlayer(currentPlayer, scene, inputStates);
            mergePlayer();
            */
        }

    })

}

function setButtonGuiMenu(){
    // Main menu
    advancedTexture[0]["play"].onPointerUpObservable.add(function(){
        typeGuiClick = 1;
    });

    advancedTexture[0]["commands"].onPointerUpObservable.add(function (){
        typeGuiClick = 2;
        console.log("Change to commands");
    });

    advancedTexture[0]["options"].onPointerUpObservable.add(function (){
        typeGuiClick = 3;
        console.log("Change to options")
    });

    // Level menu
    advancedTexture[1]["return"].onPointerUpObservable.add(function(){
        typeGuiClick = 0;
    });

    for (let i=0; i<levelScenes.length; i++){
        advancedTexture[1]["levels"][i].onPointerUpObservable.add(function(){
            numLevelShow = i;
            typeSceneClick = 1;
        })
    }

    // Command menu
    advancedTexture[2]["return"].onPointerUpObservable.add(function(){
        typeGuiClick = 0;
    });

    // Options menu
    advancedTexture[3]["return"].onPointerUpObservable.add(function(){
        typeGuiClick = 0;
    });
}


function createMenuScene(){
    let menuScene = new BABYLON.Scene(engine);
    menuScene.assetManager = configureAssetManager(menuScene);

    menuScene.clearColor = new BABYLON.Color3(0.2, 0.2, 0.2);

    let freeCameraMenu = new BABYLON.FreeCamera("freeCameraMenu", new BABYLON.Vector3(0,50,0), menuScene);
    menuScene.activeCamera = freeCameraMenu;

    let light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(0,-5,0), menuScene);
    light.position._y = -5;

    return menuScene;
}

function createMainMenu(){
    scene = new BABYLON.Scene(engine);
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
function createScene() {
    let scene = new BABYLON.Scene(engine);
    //scene.assetManager = configureAssetManager(scene);
    // background
    scene.clearColor = new BABYLON.Color3(1, 0, 1);

    let gravityVector = new BABYLON.Vector3(0,-9.81, 0);
    let physicsPlugin = new BABYLON.CannonJSPlugin();
    scene.enablePhysics(gravityVector, physicsPlugin);

    let ground = createGround(scene);
    let freeCamera = createFreeCamera(scene);
    scene.players = players;
    scene.cameras = cameras;

    let currentLevel = new Level(1, scene);

    //scene.activeCamera = freeCamera;
    scene.activeCamera = cameras[0];
    currentPlayer = 0;
    createLights(scene);

   return scene;
}

function createScene1(){
    let scene = new BABYLON.Scene(engine);
    // background
    scene.clearColor = new BABYLON.Color3(1, 0, 1);

    let freeCamera = createFreeCamera(scene);

    scene.activeCamera = freeCamera;
    createLights(scene);

    return scene;
}

function createScene2(){
    let scene = new BABYLON.Scene(engine);
    // background
    scene.clearColor = new BABYLON.Color3(0, 0, 1);

    let freeCamera = createFreeCamera(scene);

    scene.activeCamera = freeCamera;
    createLights(scene);

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