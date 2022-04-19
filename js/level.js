import Player from "./Player.js";

export default class Level {
    constructor(id, engine, name) {
        this.id = id;
        this.scene = new BABYLON.Scene(engine);
        this.name = name;
        this.currentPlayer = 0;
        this.players = [];
        this.cameras = [];

        this.createScene( id);
        this.buildWalls();
        this.createAllSpheres(this.scene, id);

    }

    createScene(engine, id) {
        if (id === 0) {
            this.scene.clearColor = new BABYLON.Color3(1, 0, 1);
        }
        else{
            this.scene.clearColor = new BABYLON.Color3(1, 0, 0);
        }

        let gravityVector = new BABYLON.Vector3(0,-9.81, 0);
        let physicsPlugin = new BABYLON.CannonJSPlugin();
        this.scene.enablePhysics(gravityVector, physicsPlugin);
        this.createGround(this.scene);

        this.currentPlayer = 0;
        this.scene.activeCamera = this.cameras[0];

        this.createLights(this.scene);
    }


    buildWalls() {
        let wall = new BABYLON.MeshBuilder.CreateBox("wall", {height: 20, width: 2, depth: 300}, this.scene);
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

    createSphere(scene, name, nb, pos_y, pos_x, pos_z, diffuseColor) {

        let sphereMesh = new BABYLON.MeshBuilder.CreateSphere(name, {diameter: 5}, scene);

        sphereMesh.position.y = pos_y;
        sphereMesh.position.x = pos_x;
        sphereMesh.position.z = pos_z;
        sphereMesh.frontVector = new BABYLON.Vector3(0, 0, 1);

        let sphereMaterial = new BABYLON.StandardMaterial("sphereMaterial", scene);
        sphereMaterial.diffuseTexture = new BABYLON.Texture("images/Ball.jpg", scene);
        sphereMaterial.diffuseColor = diffuseColor;
        sphereMesh.material = sphereMaterial;

        sphereMesh.physicsImpostor = new BABYLON.PhysicsImpostor(sphereMesh,
            BABYLON.PhysicsImpostor.SphereImpostor, {
                mass: 10,
                nativeOptions: {linearDamping: 0.35, angularDamping: 0.35}
            }, scene);

        let sphere = new Player(nb, sphereMesh, scene);
        this.players.push(sphere);
        let followCamera = this.createFollowCamera(scene, sphereMesh);

        sphereMesh.showBoundingBox = false;
    }

    createAllSpheres(scene, id) {
        if (id === 0) {
            // Sphere 1
            this.createSphere(scene, "player1", 0, 5, 0, 0, new BABYLON.Color3(1, 0, 0)); // rouge
            // Sphere 2
            this.createSphere(scene, "player2", 1, 5, 0, 20, new BABYLON.Color3(0, 1, 0));  // vert
            // Sphere 3
            this.createSphere(scene, "player3", 2, 5, 0, 30, new BABYLON.Color3(0, 0, 1)); // bleu
            // Sphere 4
            this.createSphere(scene, "player4", 3, 5, 0, 40, new BABYLON.Color3(1, 0, 1)); // violet
            // Sphere 5
            this.createSphere(scene, "player5", 5, 5, 0, 50, new BABYLON.Color3(0, 1, 1)); // cyan
        } else {
            this.createSphere(scene, "player1", 0, 5, 0, 0, new BABYLON.Color3(1, 0, 0)); // rouge
            // Sphere 2
            this.createSphere(scene, "player2", 1, 5, 0, 20, new BABYLON.Color3(0, 1, 0));  // vert
        }

    }

    createFollowCamera(scene, target) {
        let camera = new BABYLON.ArcRotateCamera("playerFollowCamera",
            BABYLON.Tools.ToRadians(-90), // -90
            BABYLON.Tools.ToRadians(20),
            70, // 70
            target.position,
            scene);

        camera.attachControl(false, false, 0);
        camera.panningAxis = new BABYLON.Vector3(0, 0, 0);
        camera.lockedTarget = target;
        camera.cameraAcceleration = 0.1; // how fast to move
        camera.maxCameraSpeed = 5; // speed limit

        this.cameras.push(camera);
        return camera;
    }


    createGround(scene) {
        const groundOptions = { width:2000, height:2000, subdivisions:20, minHeight:0, maxHeight:100};
        //scene is optional and defaults to the current scene
        let ground = BABYLON.MeshBuilder.CreateGround("ground", groundOptions, scene);
        let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("images/woodFloor.jpg", scene);
        groundMaterial.diffuseTexture.uScale = 10;
        groundMaterial.diffuseTexture.vScale = 10;
        ground.material = groundMaterial;

        // to be taken into account by collision detection
        ground.checkCollisions = true;
        //groundMaterial.wireframe=true;
        // for physic engine
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground,
            BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0 }, scene);
        return ground;
    }

    createLights(scene) {
        // i.e sun light with all light rays parallels, the vector is the direction.
        let light0 = new BABYLON.DirectionalLight("dir0", new BABYLON.Vector3(-1, -1, 0), scene);
        light0.position.z = 2;

    }
}
