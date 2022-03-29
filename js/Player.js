
export default class Player {

    constructor(id, playerMesh,  scene){
        this.playerMesh = playerMesh;
        this.id = id;
        this.scene = scene;
        this.speed = 0.5;

        playerMesh.Player = this;

        
    }

    move(scene, inputStates){

        let camera = scene.activeCamera;
        this.playerMesh.frontVector = camera.getDirection(new BABYLON.Vector3(0, 0, 1));
        this.playerMesh.frontVector.y = 0;
        this.playerMesh.frontVector.normalize();
        let forceMagnitude = 500;
        let contactLocalRefPoint = BABYLON.Vector3.Zero();
        let forceDirection = BABYLON.Vector3.Zero();

        if(inputStates.up) {
            forceDirection = this.playerMesh.frontVector;
        }
        else if(inputStates.down) {
            forceDirection = this.playerMesh.frontVector.negate();
        }
        if(inputStates.right) {
            forceDirection.x = this.playerMesh.frontVector.z;
            forceDirection.z = -this.playerMesh.frontVector.x;
        }
        else if(inputStates.left) {
            //TODO voir pour inverser cosinus ou sinus
            forceDirection.x = -this.playerMesh.frontVector.z;
            forceDirection.z = this.playerMesh.frontVector.x;
        }
        //console.log(forceDirection);
        this.playerMesh.physicsImpostor.applyForce(forceDirection.scale(forceMagnitude), this.playerMesh.getAbsolutePosition().add(contactLocalRefPoint));

    }

}