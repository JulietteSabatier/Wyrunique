export default class Menu {

    constructor(inputStates, canvas, engine) {
        this.inputStates = inputStates;
        this.canvas = canvas;
        this.engine = engine;
    }

    createMainMenu(){
        let scene = new BABYLON.Scene(this.engine);
        scene.clearColor = new BABYLON.Color3(10,10,10);

        this.createCamera(scene);
        this.createLight(scene);

        return scene;
    }

    createCamera(scene){
        scene.activeCamera = new BABYLON.Camera("fixCamera", new BABYLON.Vector3(0, 0, 0), scene, true);
    }

    createLight(scene){
        let light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(0,-5,0), scene);
        light.position._y = -5;
    }


}

