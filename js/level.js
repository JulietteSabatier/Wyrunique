import Player from "./Player.js";

export default class Level {
    constructor(id, scene) {
        this.id = id;
        this.scene = scene;

        this.buildWalls();
        this.createAllSpheres(scene);
        this.createGui();

    }

    buildWalls() {
        let wall = new BABYLON.MeshBuilder.CreateBox("wall", {height: 20, width: 2, depth: 300}, this.scene);
        wall.position = new BABYLON.Vector3(15, 10, 140);
        wall.checkCollisions = true;
        wall.physicsImpostor = new BABYLON.PhysicsImpostor(wall,
            BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0});

        var instance = wall.createInstance("wall2");
        instance.position.x = -15;
        instance.checkCollisions = true;
        instance.physicsImpostor = new BABYLON.PhysicsImpostor(instance,
            BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0});
    }

    createSphere(scene, players, cameras, name, nb, pos_y, pos_x, pos_z, diffuseColor){

        let sphereMesh = new BABYLON.MeshBuilder.CreateSphere(name, {diameter: 5}, scene);
        let sphere = new Player(nb, sphereMesh, scene);
        sphereMesh.position.y = pos_y;
        sphereMesh.position.x = pos_x;
        sphereMesh.position.z = pos_z;
        sphereMesh.frontVector = new BABYLON.Vector3(0, 0, 1);

        let sphereMaterial = new BABYLON.StandardMaterial("sphereMaterial", scene);
        sphereMaterial.diffuseTexture = new BABYLON.Texture("images/Ball.jpg", scene);
        sphereMaterial.diffuseColor = diffuseColor;
        sphereMesh.material = sphereMaterial;

        sphereMesh.physicsImpostor = new BABYLON.PhysicsImpostor(sphereMesh,
            BABYLON.PhysicsImpostor.SphereImpostor, { mass: 10, nativeOptions: {linearDamping: 0.35, angularDamping: 0.35} }, scene);

        players.push(sphereMesh);

        let followCamera = this.createFollowCamera(scene, sphereMesh);
        sphereMesh.showBoundingBox = true;
    }

    createAllSpheres(scene){
        // Sphere 1
        this.createSphere(scene, scene.players, scene.cameras, "player1", 0, 5, 0, 0, new BABYLON.Color3(1, 0, 0)); // rouge
        // Sphere 2
        this.createSphere(scene, scene.players, scene.cameras, "player2", 1, 5, 0, 20, new BABYLON.Color3(0, 1, 0));  // vert
        // Sphere 3
        this.createSphere(scene, scene.players, scene.cameras, "player3", 2, 5, 0, 30, new BABYLON.Color3(0, 0, 1)); // bleu
        // Sphere 4
        this.createSphere(scene, scene.players, scene.cameras, "player4", 3, 5, 0, 40, new BABYLON.Color3(1, 0, 1)); // violet
        // Sphere 5
        this.createSphere(scene, scene.players, scene.cameras, "player5", 5, 5, 0, 50, new BABYLON.Color3(0, 1, 1)); // cyan
    }


    createFollowCamera(scene, target) {
        let camera = new BABYLON.ArcRotateCamera("playerFollowCamera",
            BABYLON.Tools.ToRadians(-90),
            BABYLON.Tools.ToRadians(20),
            70,
            target.position,
            scene);

        camera.attachControl(scene.canvas, false, false, 0);
        camera.panningAxis = new BABYLON.Vector3(0, 0, 0);
        camera.lockedTarget = target;
        camera.cameraAcceleration = 0.1; // how fast to move
        camera.maxCameraSpeed = 5; // speed limit

        return camera;
    }

    createGui(){
        let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("globalUI",);
        let button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Click Me");
        button1.width = "150px"
        button1.height = "40px";
        button1.color = "white";
        button1.cornerRadius = 20;
        button1.background = "green";
        button1.onPointerUpObservable.add(function() {
            alert("you did it!");
        });
        advancedTexture.addControl(button1);

    }
}