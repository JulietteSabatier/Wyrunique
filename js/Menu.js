export default class Menu {

    constructor(inputStates, canvas, engine) {
        this.inputStates = inputStates;
        this.canvas = canvas;
        this.engine = engine;
    }

    createMainMenu(){
        let scene = new BABYLON.Scene(this.engine);
        scene.assetManager = this.configureAssetManager(scene, this.engine);
        scene.clearColor = new BABYLON.Color3(100,10,10);

        this.createCamera(scene, this.canvas, this.engine);
        this.createLight(scene);

        return scene;
    }

    createCamera(scene, canvas, engine){
        let camera = new BABYLON.FreeCamera("fixCamera", new BABYLON.Vector3(0, 50, 0), scene, scene);
        scene.activeCamera = camera;
        camera.attachControl(canvas);
    }

    createLight(scene){
        let light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(0,-5,0), scene);
        light.position._y = -5;
    }

    configureAssetManager(scene, engine){
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

}

