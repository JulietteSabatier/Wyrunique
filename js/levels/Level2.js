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
        this.assetsManager = new BABYLON.AssetsManager(this);

        // let ground = this.createGround();
        this.createLights();
        this.buildWalls();
        this.currentPlayer = 0;

        this.createSphere("player6", 0, 5, 0, 0, new BABYLON.Color3(1, 0, 0)); // rouge
        // Sphere 2
        this.createSphere("player7", 1, 5, 0, 20, new BABYLON.Color3(0, 1, 0));  // vert


        this.activeCamera = this.cameras[0];


    }

    buildWalls() {
        let labTask = this.assetsManager.addMeshTask("maze task", "", "assets/", "Level2.babylon");
        labTask.onSuccess = function (task) {

            let mazeMesh = task.loadedMeshes[0];
            //let mazeMaterial = new BABYLON.StandardMaterial("mazeMaterial", this.scene);
            mazeMesh.material.diffuseTexture = new BABYLON.Texture("images/Maze_color_2.png", this.scene);
            mazeMesh.material.bumpTexture = new BABYLON.Texture("images/Maze_Normal_4k_2_object.png");
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