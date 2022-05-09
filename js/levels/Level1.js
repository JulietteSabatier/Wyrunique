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
        this.buildWalls();

        // Sphere 1
        this.createSphere("player1", 0, 5, 0, 0, new BABYLON.Color3(0, 0, 0)); // rouge
        // Sphere 2
        this.createSphere("player2", 1, 5, 245, 245, new BABYLON.Color3(0, 1, 0));  // vert
        // Sphere 3
        this.createSphere("player3", 2, 5, 245, -245, new BABYLON.Color3(0, 0, 1)); // bleu
        // Sphere 4
        this.createSphere("player4", 3, 5, -245, 245, new BABYLON.Color3(1, 0, 1)); // violet
        // Sphere 5
        this.createSphere("player5", 5, 5, -245, -245, new BABYLON.Color3(0, 1, 1)); // cyan


        this.activeCamera = this.cameras[0];


    }

    buildWalls() {
        let labTask = this.assetsManager.addMeshTask("maze task", "", "assets/", "Level1.babylon");
        labTask.onSuccess = function (task) {

            let mazeMesh = task.loadedMeshes[0];
            //let mazeMaterial = new BABYLON.StandardMaterial("mazeMaterial", this.scene);
            mazeMesh.material.diffuseTexture = new BABYLON.Texture("images/Level1_color.png", this.scene);
            mazeMesh.material.bumpTexture = new BABYLON.Texture("images/Level1_normal.png");
            //mazeMesh.material = mazeMaterial;

            mazeMesh.position = new BABYLON.Vector3.Zero();
            mazeMesh.scaling = new BABYLON.Vector3(100, 100, 100);

            mazeMesh.physicsImpostor = new BABYLON.PhysicsImpostor(mazeMesh,
                BABYLON.PhysicsImpostor.MeshImpostor, {mass: 0});
        }
        labTask.onError = function (task, message, exception) {
            console.log(message, exception);

        }
        this.assetsManager.load();
    }
}