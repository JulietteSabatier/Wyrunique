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
        advancedTexture.idealWidth = 1500;

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

    createLevelMenu(levels){
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
        advancedTexture.idealWidth = 2000;

        // Text name game
        var text1 = new BABYLON.GUI.TextBlock();
        text1.text = "Wyrunique";
        text1.color = "white";
        text1.fontSize = 100;
        text1.top = "-400px";
        text1.left = "0px";
        advancedTexture.addControl(text1);

        // Text choose level
        let text2 = new BABYLON.GUI.TextBlock();
        text2.text = "Choose your level:";
        text2.color = "white";
        text2.fontSize = 40;
        text2.top = "-300px";
        text2.left = "-350px";
        advancedTexture.addControl(text2);

        // Scroll level
        let chooseLevel = new BABYLON.GUI.ScrollViewer("chosseLevel");
        chooseLevel.width = "1000px";
        chooseLevel.height = "500px";
        chooseLevel.background = "black";

        let gridLevel = new BABYLON.GUI.Grid()
        gridLevel.height = (levels.length * 80)+"px";

        for (let i=0; i<levels.length; i++){
            let level = levels[i];
            gridLevel.addRowDefinition(80, true);
            let rect = new BABYLON.GUI.Rectangle();
            if (i%2 === 0){
                rect.background = "blue";

            }
            else if (i%2 === 1){
                rect.background = "red";
            }

            let grid = new BABYLON.GUI.Grid();
            grid.addColumnDefinition(100, true);

            // Num level
            let numLevel = new BABYLON.GUI.Rectangle();
            let textNumLevel = new BABYLON.GUI.TextBlock("numLevel", ""+i);
            numLevel.addControl(textNumLevel);
            grid.addControl(numLevel, 0, 0);

            // Name level
            grid.addColumnDefinition(700, true);
            let nameLevel = new BABYLON.GUI.Rectangle();
            let textNameLevel = new BABYLON.GUI.TextBlock("nameLevel", level);
            nameLevel.addControl(textNameLevel);
            grid.addControl(nameLevel, 0, 1);
            rect.addControl(grid);

            gridLevel.addControl(rect, i);
        }
        chooseLevel.addControl(gridLevel);
        advancedTexture.addControl(chooseLevel);


        // Button return
        let button3 = BABYLON.GUI.Button.CreateSimpleButton("but3", "Return");
        button3.width = "150px"
        button3.height = "60px";
        button3.color = "white";
        button3.cornerRadius = 20;
        button3.background = "green";
        button3.top = "300px";
        button3.left = "400px";
        button3.onPointerUpObservable.add(function() {
            alert("Change scene to main menu");
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

