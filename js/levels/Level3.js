import AbstractLevel from "./AbstractLevel.js";
import Door from "./door/Door.js";

export default class Level3 extends AbstractLevel{

    constructor(engine, canvas, id) {
        super(engine, canvas);
        this.createScene(id, engine);
    }

    createScene(id, engine) {
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
        let spikesMesh = this.getMeshByName("PiegePics");
        spikesMesh.actionManager = new BABYLON.ActionManager(this);

        spikesMesh.physicsImpostor =  new BABYLON.PhysicsImpostor(spikesMesh,
            BABYLON.PhysicsImpostor.MeshImpostor, {
                ignoreParent: true
            }, this);

        for (let i = 0; i < this.players.length; i++) {
            spikesMesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                {trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: this.players[i].playerMesh},
                () => {
                    console.log("Player " + this.players[i].id + " impaled himself");
                    console.log(this.getMeshByName("PieceManquante").position);
                }
            ));
        }
    }

    loadPlateforms() {
        let spikePlateform = this.getMeshByName("PlateformePics");
        spikePlateform.physicsImpostor = new BABYLON.PhysicsImpostor(spikePlateform,
            BABYLON.PhysicsImpostor.BoxImpostor, {
                ignoreParent: true
            }, this);

        for (let i = 1; i <= 3; i++) {
            let jumpPlateform = this.getMeshByName("PlateformeSaut"+i);
            jumpPlateform.physicsImpostor = new BABYLON.PhysicsImpostor(jumpPlateform,
                BABYLON.PhysicsImpostor.BoxImpostor, {
                    ignoreParent: true
                }, this);
        }
    }

    loadTriggers() {
        let triggerPlateform = this.getMeshByName("TriggerPlateforme");
        let missingPiece = this.getMeshByName("PieceManquante");

        // missingPiece.physicsImpostor = new BABYLON.PhysicsImpostor(missingPiece,
        //     BABYLON.PhysicsImpostor.BoxImpostor, {}, this);
        missingPiece.checkCollisions = true;

        triggerPlateform.actionManager = new BABYLON.ActionManager(this);
        triggerPlateform.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
            {trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: missingPiece},
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
        let button = this.createButtonMesh(posButton, "button1");

        this.doors[0] = new Door(this, door,[button]);
    }

}
