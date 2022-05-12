
export default class Door{

    constructor(scene, doorName, nbButton, buttonsName) {
        this.scene = scene;
        this.door = scene.getMeshByName(doorName);
        this.door["open"] = false;
        this.buttons = [];
        for (let i=0; i<nbButton; i++){
            this.buttons[i] = this.scene.getMeshByName(buttonsName[i]);
            this.buttons[i]["push"] =false;
        }
    }

    verifyOpen(){
        let open = true;
        for (let i=0; i<this.buttons.length; i++){
            if (this.buttons[i].push === false){
                open = false;
                break;
            }
        }
        if (open){
            this.door.open = true;
        }
    }






}