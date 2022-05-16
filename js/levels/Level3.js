import AbstractLevel from "./AbstractLevel.js";
import Door from "./door/Door.js";
import Jump from "./door/Jump.js";

export default class Level3 extends AbstractLevel{

    constructor(engine, canvas, id) {
        super(engine, canvas);
        this.createScene(id, engine);
    }

    createScene(id, engine) {

        this.createLoadingOpen()

        this.clearColor = new BABYLON.Color3(0, 0, 0);

        let gravityVector = new BABYLON.Vector3(0,-9.81, 0);
        let physicsPlugin = new BABYLON.CannonJSPlugin();
        this.enablePhysics(gravityVector, physicsPlugin);
        this.assetsManager = new BABYLON.AssetsManager(this);

        this.createLights();
        this.buildWalls(engine, id);

        this.currentPlayer = 0;
    }

    loadSpecificObjects() {
        this.loadSpikes();
        this.loadPlateforms();
        this.loadTriggers();
    }

    loadSpikes() {
        this.spikesMesh = this.getMeshByName("PiegePics");
        this.spikesMesh.actionManager = new BABYLON.ActionManager(this);

        this.spikesMesh.physicsImpostor =  new BABYLON.PhysicsImpostor(this.spikesMesh,
            BABYLON.PhysicsImpostor.MeshImpostor, {
                ignoreParent: true
            }, this);

        for (let i = 0; i < this.players.length; i++) {
            this.spikesMesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                {trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: this.players[i].playerMesh},
                () => {
                    console.log("Player " + this.players[i].id + " impaled himself");
                    console.log(this.getMeshByName("PieceManquante").position);
                }
            ));
        }
    }

    loadPlateforms() {
        this.spikePlateform = this.getMeshByName("PlateformePics");
        this.spikePlateform.physicsImpostor = new BABYLON.PhysicsImpostor(this.spikePlateform,
            BABYLON.PhysicsImpostor.BoxImpostor, {
                ignoreParent: true
            }, this);


        //loadPlateform
        for (let i = 0; i < 3; i++) {
            let jumpPlateform = this.getMeshByName("PlateformeSaut"+(i+1));
            jumpPlateform.physicsImpostor = new BABYLON.PhysicsImpostor(jumpPlateform,
                BABYLON.PhysicsImpostor.BoxImpostor, {
                    ignoreParent: true
                }, this);
        }

        // load jump plateform
        let jumpPlateformPositions = [];
        let jumpPlateformArray = [];
        for (let i = 0; i < 3; i++) {
            jumpPlateformPositions[i] = this.getMeshByName("Jump"+(i+1)).position;
            jumpPlateformArray[i] = this.createPlateformJumpMesh(jumpPlateformPositions[i], "plateform"+(i+1));
            let jumpMaterial = new BABYLON.StandardMaterial("jumpMaterial", this);
            jumpMaterial.diffuseTexture = new BABYLON.Texture("images/Common/jump.png", this);
            jumpPlateformArray[i].material = jumpMaterial;
        }

        this.jumpPlateform = new Jump(jumpPlateformArray, this);
    }

    loadTriggers() {
        this.triggerPlateform = this.getMeshByName("TriggerPlateforme");
        this.missingPiece = this.getMeshByName("PieceManquante");

        // missingPiece.physicsImpostor = new BABYLON.PhysicsImpostor(missingPiece,
        //     BABYLON.PhysicsImpostor.BoxImpostor, {}, this);
        this.missingPiece.checkCollisions = true;

        this.triggerPlateform.actionManager = new BABYLON.ActionManager(this);
        this.triggerPlateform.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            {trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: this.missingPiece},
            () => {
                console.log("Plateforme débloquée");
            }
        ));
    }

    setButtonAndDoor() {
        let door = this.getMeshByName("Porte1");
        let doorMaterial= new BABYLON.StandardMaterial("doorMaterial", this);

        doorMaterial.diffuseTexture = new BABYLON.Texture("images/Common/doorTexture.jpg", this)
        doorMaterial.diffuseColor =  new BABYLON.Color3(1,0.5,0);
        door.material = doorMaterial;

        door.physicsImpostor = new BABYLON.PhysicsImpostor(door,
            BABYLON.PhysicsImpostor.BoxImpostor, {
                ignoreParent: true
            }, this);

        let posButton = this.getMeshByName("Button1").position;
        posButton.x = posButton.x +5;
        posButton.z = posButton.z +7;

        let button = this.createButtonMesh(posButton, "button1");

        this.doors[0] = new Door(this, door,[button]);
    }

}
