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

        let ground = this.createGround();
        this.createLights(this.scene);
        this.buildWalls();

        // Sphere 1
        this.createSphere("player1", 0, 5, 0, 0, new BABYLON.Color3(0, 0, 0)); // rouge
        // Sphere 2
        this.createSphere("player2", 1, 5, 0, 20, new BABYLON.Color3(0, 1, 0));  // vert
        // Sphere 3
        this.createSphere("player3", 2, 5, 0, 30, new BABYLON.Color3(0, 0, 1)); // bleu
        // Sphere 4
        this.createSphere("player4", 3, 5, 0, 40, new BABYLON.Color3(1, 0, 1)); // violet
        // Sphere 5
        this.createSphere("player5", 5, 5, 0, 50, new BABYLON.Color3(0, 1, 1)); // cyan


        this.activeCamera = this.cameras[0];
        //this.scene.activeCamera = this.createFreeCamera(this.scene);


    }
}