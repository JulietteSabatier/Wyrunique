
export default class Door{

    constructor(scene, door,  buttons) {
        this.door = door;
        this.open = false;
        this.buttons = buttons;
        console.log(buttons);
        for (let i=0; i<buttons.length; i++){
            this.buttons[i]["push"] =false;
        }
    }

    buttonVerifyTouch(scene){
        for (let i=0; i<this.buttons.length; i++){
            if (this.buttons[i].push === true){
                if (!scene.players[scene.currentPlayer].playerMesh.intersectsMesh(this.buttons[i])){
                    this.buttons[i].push = false;
                }
            }
            else{
                if (scene.players[scene.currentPlayer].playerMesh.intersectsMesh(this.buttons[i])){
                    this.buttons[i].push = true;
                }
            }
        }
    }

    verifyDoorOpen(scene){
        for (let i=0; i<this.buttons.length; i++){
            if (this.buttons[i].push === false){
                return;
            }
        }
        this.open = true;
        this.door.dispose();
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
            this.open = true;
        }
    }






}