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
        this.createLights();
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


    }

    buildWalls() {
        let wall = new BABYLON.MeshBuilder.CreateBox("wall", {height: 20, width: 2, depth: 300}, this);

        let wallMaterial = new BABYLON.StandardMaterial("boxMaterial", this);
        wallMaterial.diffuseTexture = new BABYLON.Texture("images/Wall.jpg", this);
        wallMaterial.diffuseTexture.vScale = 3.0;
        wallMaterial.diffuseTexture.uScale = 3.0;
        wallMaterial.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        wall.material = wallMaterial;

        wall.position = new BABYLON.Vector3(15, 10, 140);
        wall.checkCollisions = true;
        wall.physicsImpostor = new BABYLON.PhysicsImpostor(wall,
            BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0});

        let instance = wall.createInstance("wall2");
        instance.position.x = -15;
        instance.checkCollisions = true;
        instance.physicsImpostor = new BABYLON.PhysicsImpostor(instance,
            BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0});
    }
}