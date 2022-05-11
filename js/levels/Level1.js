import AbstractLevel from "./AbstractLevel.js";

export default class Level1 extends AbstractLevel{

    constructor(engine, canvas) {
        super(engine, canvas);

        this.createScene()
    }

    createScene() {
        this.clearColor = new BABYLON.Color3(1, 0, 1);

        let gravityVector = new BABYLON.Vector3(0,-9.81, 0);
        let physicsPlugin = new BABYLON.CannonJSPlugin();
        this.enablePhysics(gravityVector, physicsPlugin);
        this.assetsManager = new BABYLON.AssetsManager(this);

        //let ground = this.createGround();
        this.createLights();
        this.buildWalls(1);
    }
}
