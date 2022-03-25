
export default class Player {

    constructor(id, playerMesh,  scene){
        this.playerMesh = playerMesh;
        this.id = id;
        this.scene = scene;
        this.speed = 1;

        playerMesh.Player = this;

        
    }

    move(scene, inputStates){

        let yMovement = 0;
        let zMovement = 0;

        if (this.playerMesh.position.y > 2){
            zMovement = 0;
            yMovement = -2;
        }

        if(inputStates.up) {
            this.playerMesh.moveWithCollisions(this.playerMesh.frontVector.multiplyByFloats(this.speed, this.speed, this.speed));
        }    
        if(inputStates.down) {
            this.playerMesh.moveWithCollisions(this.playerMesh.frontVector.multiplyByFloats(-this.speed, -this.speed, -this.speed));
        }  
        if(inputStates.left) {
            this.playerMesh.rotation.y -= 0.02;
            this.playerMesh.frontVector = new BABYLON.Vector3(Math.sin(this.playerMesh.rotation.y), 0, Math.cos(this.playerMesh.rotation.y));
        }    
        if(inputStates.right) {
            this.playerMesh.rotation.y += 0.02;
            this.playerMesh.frontVector = new BABYLON.Vector3(Math.sin(this.playerMesh.rotation.y), 0, Math.cos(this.playerMesh.rotation.y));
        }
        

    }

}