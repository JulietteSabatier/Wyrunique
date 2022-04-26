import AbstractLevel from "./AbstractLevel.js";

export default class Level2 extends AbstractLevel{

    constructor(engine, canvas) {
        super(engine, canvas);

        this.createScene();
    }

    createScene(id, engine) {
        this.clearColor = new BABYLON.Color3(1, 0, 0);

        let gravityVector = new BABYLON.Vector3(0,-9.81, 0);
        let physicsPlugin = new BABYLON.CannonJSPlugin();
        this.enablePhysics(gravityVector, physicsPlugin);

        let ground = this.createGround();
        this.createLights(this.scene);
        this.buildWalls();
        this.currentPlayer = 0;

        this.createSphere("player6", 0, 5, 0, 0, new BABYLON.Color3(1, 0, 0)); // rouge
        // Sphere 2
        this.createSphere("player7", 1, 5, 0, 20, new BABYLON.Color3(0, 1, 0));  // vert


        this.activeCamera = this.cameras[0];
        //this.scene.activeCamera = this.createFreeCamera(this.scene);


    }

}