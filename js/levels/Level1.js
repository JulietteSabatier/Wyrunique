import AbstractLevel from "./AbstractLevel.js";
import Door from "./door/Door.js";

export default class Level1 extends AbstractLevel{

    constructor(engine, canvas, id) {
        super(engine, canvas);

        this.doors = [];

        this.createScene(id, engine);
    }

    createScene(id, engine) {
        this.clearColor = new BABYLON.Color3(0, 0, 0);

        let gravityVector = new BABYLON.Vector3(0,-9.81, 0);
        let physicsPlugin = new BABYLON.CannonJSPlugin();
        this.enablePhysics(gravityVector, physicsPlugin);
        this.assetsManager = new BABYLON.AssetsManager(this);
        //this.assetsManager.useDefaultLoadingScreen = false;

        this.createLights();
        this.buildWalls(engine, id);


    }

    createDoors(nb){
        this.doors[nb] = new Door(this, "door", "button1", "button2");
    }
}
