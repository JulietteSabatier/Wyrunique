
export default class Door{

    constructor(scene, door,  buttons) {
        this.door = door;
        this.open = false;
        this.buttons = buttons;
        for (let i=0; i<buttons.length; i++){
            this.buttons[i]["push"] =false;
        }


    }

    buttonVerifyTouch(scene){
        for (let i=0; i<this.buttons.length; i++){
            if (this.buttons[i].push === true){
                let isPush = false;
                for (let j=0; j<scene.players.length; j++){
                    if (scene.players[j].playerMesh.intersectsMesh(this.buttons[i])){
                        isPush = true;
                        break;
                    }
                }
                if (!isPush) {
                    console.log("player quit button")
                    this.buttons[i].push = false;
                }

            }
            else{
                for (let j=0; j<scene.players.length; j++){
                    if (scene.players[j].playerMesh.intersectsMesh(this.buttons[i])){
                        console.log("player touch button")
                        this.buttons[i].push = true;
                    }
                }
            }
        }
    }

    verifyDoorOpen(scene){
        for (let i=0; i<this.buttons.length; i++){
            if (this.buttons[i].push === false){
                return false;
            }
        }
        this.open = true;
        this.door.dispose();
        return true;
    }








}