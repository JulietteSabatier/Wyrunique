import Player from "../Player.js";
import GameState from "../GameState.js";
import Options from "../Options.js";

export default class AbstractLevel extends BABYLON.Scene{

    constructor(engine, canvas, id){
        super(engine, canvas);

        if (this.constructor === AbstractLevel){
            throw new TypeError('Abstract class "AbstractMenu" cannot be instanced directly');
        }

        this.id = id;
        this.name = null;
        this.players = [];
        this.cameras = [];
        this.currentPlayer = 0;
        this.canFinish = false;

        let finished = this.createAdvancedTexture("gui/guiTextureLevel.json", "guiLevel");

        this.effectSoundTrack = new BABYLON.SoundTrack(this);

        let music = new BABYLON.Sound("menuMusic", "musics/Funambule1.mp3", this, null,
            {
                loop: true,
                autoplay:true,
                volume: Options.levelMusic
            });

        console.log(Options.levelSoundEffect)
        this.mergeSound = new BABYLON.Sound("mergeSound",
            "musics/mixkit-fast-small-sweep-transition-166.wav",
            this,
        null,
            {
                volume: Options.levelSoundEffect
            }
            );
        this.effectSoundTrack.addSound(this.mergeSound);
    }

    async createAdvancedTexture(path, name){
        this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(name, true, this);
        let loadedGui = await this.advancedTexture.parseFromURLAsync(path);


        this.quitButton = this.advancedTexture.getControlByName("quitButton");
        this.restartButton = this.advancedTexture.getControlByName("restartButton");

        if (name === "guiLevel"){
            this.nbBallText = this.advancedTexture.getControlByName("textNbBall");
            this.nbBallText.text = this.players.length;
        }

        this.quitButton.onPointerUpObservable.add(function (){
            GameState.GameState = GameState.LevelMenu;
            console.log("level to level menu");
        })
        this.restartButton.onPointerUpObservable.add(function (){
            GameState.restartLevel = true;
            console.log("restart level");
        })

    }


    createSphere(name, nb, pos_y, pos_x, pos_z, diffuseColor){
        let sphereMesh = new BABYLON.MeshBuilder.CreateSphere(name, {diameter: 5}, this);

        sphereMesh.position.y = pos_y;
        sphereMesh.position.x = pos_x;
        sphereMesh.position.z = pos_z;
        sphereMesh.frontVector = new BABYLON.Vector3(0, 0, 1);

        let sphereMaterial = new BABYLON.StandardMaterial("sphereMaterial", this);
        sphereMaterial.diffuseTexture = new BABYLON.Texture("images/Ball.jpg", this);
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
    }

    createGround() {
        const groundOptions = { width:2000, height:2000, subdivisions:20, minHeight:0, maxHeight:100};
        //scene is optional and defaults to the current scene
        let ground = BABYLON.MeshBuilder.CreateGround("ground", groundOptions, this);
        let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", this);
        groundMaterial.diffuseTexture = new BABYLON.Texture("images/woodFloor.jpg", this);
        groundMaterial.diffuseTexture.uScale = 10;
        groundMaterial.diffuseTexture.vScale = 10;
        ground.material = groundMaterial;

        // to be taken into account by collision detection
        ground.checkCollisions = true;
        //groundMaterial.wireframe=true;
        // for physic engine
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground,
            BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0 }, this);
        return ground;
    }

    createLights(scene) {
        // i.e sun light with all light rays parallels, the vector is the direction.
        let light0 = new BABYLON.DirectionalLight("dir0", new BABYLON.Vector3(-1, -1, 0), this);
        light0.position.z = 2;

    }

    createFollowCamera(scene, target) {
        let camera = new BABYLON.ArcRotateCamera("playerFollowCamera",
            BABYLON.Tools.ToRadians(-90), // -90
            BABYLON.Tools.ToRadians(70),    // 20
            70, // 70
            target.position,
            this);

        camera.checkCollisions = true;
        camera.panningAxis = new BABYLON.Vector3(0, 0, 0);
        camera.lockedTarget = target;
        camera.cameraAcceleration = 0.1; // how fast to move
        camera.maxCameraSpeed = 5; // speed limit
        camera.lowerRadiusLimit = 30;
        camera.upperRadiusLimit = 100;
        camera.upperBetaLimit = (Math.PI / 2);
        camera.attachControl(this.canvas, false, false, 0);

        return camera;
    }

    createEnd() {
        if (!this.canFinish) {

            const faceUV = [];
            faceUV[0] =	new BABYLON.Vector4(0, 0, 0, 0);
            faceUV[1] =	new BABYLON.Vector4(1, 0, 0.25, 1); // x, z swapped to flip image
            faceUV[2] = new BABYLON.Vector4(0, 0, 0.24, 1);

            const colors = [];
            colors[0] = new BABYLON.Vector4(0, 0, 0, 0);
            colors[1] = new BABYLON.Vector4(0, 0, 0, 0);
            colors[2] = new BABYLON.Vector4(0, 0, 0, 0);

            let cylinderMaterial = new BABYLON.StandardMaterial("cylinderMaterial", this);
            cylinderMaterial.diffuseTexture = new BABYLON.Texture("images/finishZone.png", this);

            this.finishBox = new BABYLON.MeshBuilder.CreateCylinder("finishSphere", {height: 10, diameter: 25, faceUV: faceUV, faceColors: colors}, this);
            this.finishBox.position = new BABYLON.Vector3(0, 5, 300);
            this.finishBox.material = cylinderMaterial;
            this.canFinish = true;
        }
    }


    buildWalls() {
        let wall = new BABYLON.MeshBuilder.CreateBox("wall", {height: 20, width: 2, depth: 300}, this);
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

    changePlayer(){
        this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
        console.log("Switching to player/camera " + this.currentPlayer);
        this.activeCamera = this.cameras[this.currentPlayer];
        return true;
    }

}