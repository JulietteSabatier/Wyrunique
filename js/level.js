import Player from "./Player.js";
import { loadNextLevel } from "./main.js";

export default class Level {
    constructor(id, engine, name) {
        this.id = id;
        this.scene = new BABYLON.Scene(engine);
        this.name = name;
        this.currentPlayer = 0;
        this.players = [];
        this.cameras = [];
        this.canFinish = false;

        this.createScene(id,engine);
    }

    createScene(id, engine) {
        this.scene.dispose();
        this.players = [];
        this.cameras = [];
        this.scene = new BABYLON.Scene(engine)
        if (id === 0) {
            this.scene.clearColor = new BABYLON.Color3(1, 0, 1);
        }
        else{
            this.scene.clearColor = new BABYLON.Color3(1, 0, 0);
        }

        let gravityVector = new BABYLON.Vector3(0,-9.81, 0);
        let physicsPlugin = new BABYLON.CannonJSPlugin();
        this.scene.enablePhysics(gravityVector, physicsPlugin);

        let ground = this.createGround();
        this.createLights(this.scene);
        this.buildWalls();
        this.createAllSpheres(this.scene, id);
        this.currentPlayer = 0;
        this.scene.activeCamera = this.cameras[0];
        //this.scene.activeCamera = this.createFreeCamera(this.scene);
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

    createEnd() {
        if (!this.canFinish) {

            let particleSystem = new BABYLON.ParticleSystem("particles", 500); // on construction
            particleSystem.particleTexture = new BABYLON.Texture("images/Particle.jpg", this.scene);
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

    createSphere(name, nb, pos_y, pos_x, pos_z, diffuseColor){
        let sphereMesh = new BABYLON.MeshBuilder.CreateSphere(name, {diameter: 5}, this.scene);

        sphereMesh.position.y = pos_y;
        sphereMesh.position.x = pos_x;
        sphereMesh.position.z = pos_z;
        sphereMesh.frontVector = new BABYLON.Vector3(0, 0, 1);

        let sphereMaterial = new BABYLON.StandardMaterial("sphereMaterial", this.scene);
        sphereMaterial.diffuseTexture = new BABYLON.Texture("images/Ball.jpg", this.scene);
        sphereMesh.material = sphereMaterial;

        sphereMesh.physicsImpostor = new BABYLON.PhysicsImpostor(sphereMesh,
            BABYLON.PhysicsImpostor.SphereImpostor, {
                mass: 10,
                nativeOptions: {linearDamping: 0.35, angularDamping: 0.35}
            }, this.scene);

        let sphere = new Player(nb, sphereMesh, this.scene);
        this.players.push(sphere);
        let followCamera = this.createFollowCamera(this.scene, sphereMesh);

        sphereMesh.showBoundingBox = false;

        this.scene.shadowGenerator.addShadowCaster(sphereMesh);
    }

    createAllSpheres(scene, id) {
        if (id === 0) {
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
        } else {
            this.createSphere("player6", 0, 5, 0, 0, new BABYLON.Color3(1, 0, 0)); // rouge
            // Sphere 2
            this.createSphere("player7", 1, 5, 0, 20, new BABYLON.Color3(0, 1, 0));  // vert
        }

    }

    createFreeCamera(scene) {
        let camera = new BABYLON.FreeCamera("freeCamera", new BABYLON.Vector3(0, 50, 0), scene);
        camera.attachControl(scene.canvas);
        // prevent camera to cross ground
        camera.checkCollisions = true;
        // avoid flying with the camera
        camera.applyGravity = true;

        // Add extra keys for camera movements
        // Need the ascii code of the extra key(s). We use a string method here to get the ascii code
        camera.keysUp.push('z'.charCodeAt(0));
        camera.keysDown.push('s'.charCodeAt(0));
        camera.keysLeft.push('q'.charCodeAt(0));
        camera.keysRight.push('d'.charCodeAt(0));
        camera.keysUp.push('Z'.charCodeAt(0));
        camera.keysDown.push('S'.charCodeAt(0));
        camera.keysLeft.push('Q'.charCodeAt(0));
        camera.keysRight.push('D'.charCodeAt(0));

        return camera;
    }



    createFollowCamera(scene, target) {
        let camera = new BABYLON.ArcRotateCamera("playerFollowCamera",
            BABYLON.Tools.ToRadians(-90), // -90
            BABYLON.Tools.ToRadians(70),    // 20
            70, // 70
            target.position,
            this.scene);

        camera.checkCollisions = true;
        camera.panningAxis = new BABYLON.Vector3(0, 0, 0);
        camera.lockedTarget = target;
        camera.cameraAcceleration = 0.1; // how fast to move
        camera.maxCameraSpeed = 5; // speed limit
        camera.lowerRadiusLimit = 30;
        camera.upperRadiusLimit = 100;
        camera.upperBetaLimit = (Math.PI / 2);
        camera.attachControl(this.scene.canvas, false, false, 0);

        this.cameras.push(camera);
        return camera;
    }


    createGround() {
        const groundOptions = { width:2000, height:2000, subdivisions:20, minHeight:0, maxHeight:100};
        //scene is optional and defaults to the current scene
        let ground = BABYLON.MeshBuilder.CreateGround("ground", groundOptions, this.scene);
        let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", this.scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("images/woodFloor.jpg", this.scene);
        groundMaterial.diffuseTexture.uScale = 10;
        groundMaterial.diffuseTexture.vScale = 10;
        ground.material = groundMaterial;

        // to be taken into account by collision detection
        ground.checkCollisions = true;
        //groundMaterial.wireframe=true;
        // for physic engine
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground,
            BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0 }, this.scene);
        return ground;
    }

    createLights(scene) {
        // i.e sun light with all light rays parallels, the vector is the direction.
        let light0 = new BABYLON.DirectionalLight("dir0", new BABYLON.Vector3(-1, -1, 0), this.scene);
        light0.position.z = 2;

    }
}
