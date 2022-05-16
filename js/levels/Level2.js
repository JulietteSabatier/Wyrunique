import AbstractLevel from "./AbstractLevel.js";
import Door from "./door/Door.js";

export default class Level2 extends AbstractLevel{

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
        this.endPosition = new BABYLON.Vector3(0, 15, 250);
        //let finished = this.createAdvancedTexture("gui/guiTextureLevel.json", "guiLevel");
    }

    setButtonAndDoor() {
        let door = this.getMeshByName("Porte1");
        let doorMaterial= new BABYLON.StandardMaterial("doorMaterial", this);

        doorMaterial.diffuseTexture = new BABYLON.Texture("images/doorTexture.jpg", this)
        doorMaterial.diffuseColor =  new BABYLON.Color3(1,0.5,0);
        door.material = doorMaterial;

        door.physicsImpostor = new BABYLON.PhysicsImpostor(door,
            BABYLON.PhysicsImpostor.BoxImpostor, {
                ignoreParent: true
            }, this);

        let posButton1 = this.getMeshByName("Button1").position;
        let button1 = this.createButtonMesh(posButton1, "button1");
        let posButton2 = this.getMeshByName("Button2").position;
        let button2 = this.createButtonMesh(posButton2, "button2")

        this.doors[0] = new Door(this, door,[button1,button2]);
    }

}
