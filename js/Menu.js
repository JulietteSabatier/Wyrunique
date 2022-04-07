export default class Menu {

    constructor(inputStates, canvas, engine) {
        this.inputStates = inputStates;
        this.canvas = canvas;
        this.engine = engine;
    }

    createMainMenu(){
        let scene = new BABYLON.Scene(this.engine);
        scene.assetManager = this.configureAssetManager(scene, this.engine);

        // background
        scene.clearColor = new BABYLON.Color3(0.2,0.2,0.2);

        // Camera and light
        let freeCamera = new BABYLON.FreeCamera("freeCamera", new BABYLON.Vector3(0, 50, 0), scene);
        scene.activeCamera = freeCamera;
        this.createLight(scene);

        // Gui
        let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("mainMenuUi", true);

        // Name Game
        var text1 = new BABYLON.GUI.TextBlock();
        text1.text = "Wyrunique";
        text1.color = "white";
        text1.fontSize = 100;
        text1.top = "-300px";
        text1.left = "0px";
        advancedTexture.addControl(text1);

        // Play
        var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Play");
        button1.width = "150px"
        button1.height = "40px";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.background = "green";
        button1.top = "-100px";
        button1.left = "0px";
        button1.onPointerUpObservable.add(function() {
            alert("Change scene to choose level");
        });
        advancedTexture.addControl(button1);

        // Options
        var button2 = BABYLON.GUI.Button.CreateSimpleButton("but2", "Options");
        button2.width = "150px"
        button2.height = "40px";
        button2.color = "white";
        button2.cornerRadius = 20;
        button2.background = "green";
        button2.top = "0px";
        button2.left = "0px";
        button2.onPointerUpObservable.add(function() {
            alert("Change scene to Options");
        });
        advancedTexture.addControl(button2);

        // Commands
        var button3 = BABYLON.GUI.Button.CreateSimpleButton("but3", "Commands");
        button3.width = "150px"
        button3.height = "40px";
        button3.color = "white";
        button3.cornerRadius = 20;
        button3.background = "green";
        button3.top = "100px";
        button3.left = "0px";
        button3.onPointerUpObservable.add(function() {
            alert("Change scene to Commands");
        });
        advancedTexture.addControl(button3);

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

