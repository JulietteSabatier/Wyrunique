import Player from "./Player.js";
import { loadNextLevel } from "./main.js";

export default class Level {
    constructor(id, scene) {
        this.id = id;
        this.scene = scene;
        this.canFinish = false;

        this.buildWalls();
        this.createAllSpheres(scene);
    }

    buildWalls() {
        let wall = new BABYLON.MeshBuilder.CreateBox("wall", {height: 20, width: 2, depth: 300}, this.scene);

        let wallMaterial = new BABYLON.StandardMaterial("boxMaterial", this.scene);
        wallMaterial.diffuseTexture = new BABYLON.Texture("images/Wall.jpg", this.scene);
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

        this.scene.shadowGenerator.addShadowCaster(wall);
        this.scene.shadowGenerator.addShadowCaster(instance);
    }

    createEnd(scene) {
        if (!this.canFinish) {

            let particleSystem = new BABYLON.ParticleSystem("particles", 500); // on construction
            particleSystem.particleTexture = new BABYLON.Texture("images/Particle.jpg", scene);
            particleSystem.emitter = new BABYLON.Vector3(0, 15, 300);
            particleSystem.emitRate = 200;

            particleSystem.direction1 = new BABYLON.Vector3(-7, -5, 10);
            particleSystem.direction2 = new BABYLON.Vector3(7, -5, -10);

            particleSystem.minLifeTime = 0.3;
            particleSystem.maxLifeTime = 1.5;

            particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
            particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
            particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

            particleSystem.start();
            this.canFinish = true;
        }
    }

    checkIfFinish() {
        let player = this.scene.players[0];

        if (player.intersectsPoint(new BABYLON.Vector3(0, 0, 300))) {
            loadNextLevel();
        }
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

        this.scene.shadowGenerator.addShadowCaster(sphereMesh);
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
            BABYLON.Tools.ToRadians(70),
            70,
            target.position,
            scene);

        camera.checkCollisions = true;
        camera.panningAxis = new BABYLON.Vector3(0, 0, 0);
        camera.lockedTarget = target;
        camera.cameraAcceleration = 0.1; // how fast to move
        camera.maxCameraSpeed = 5; // speed limit
        camera.lowerRadiusLimit = 30;
        camera.upperRadiusLimit = 100;
        camera.upperBetaLimit = (Math.PI / 2);
        camera.attachControl(scene.canvas, false, false, 0);

        return camera;
    }
}