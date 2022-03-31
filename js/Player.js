
export default class Player {

    constructor(id, playerMesh,  scene){
        this.playerMesh = playerMesh;
        this.id = id;
        this.scene = scene;
        this.speed = 0.5;

        playerMesh.Player = this;

        
    }

    /*mergePlayers(scene){

        for (let i=0; i < players.length; i=i+1){
            if (i !== currentPlayer){
                let x = Object.values(players[i].getBoundingInfo()["boundingBox"]["centerWorld"])[1];
                let y = Object.values(players[i].getBoundingInfo()["boundingBox"]["centerWorld"])[2];
                let z = Object.values(players[i].getBoundingInfo()["boundingBox"]["centerWorld"])[3];
                if (!(x === 0 && y === 0 && z === 0)){       // weirdly at the beginning of the game x,y,z are at 0,0,0 and it touches the first ball
                    if (players[currentPlayer].intersectsPoint({x,y,z}, true)){

                        players[i].dispose();
                        //cameras[i].dispose();

                        players.splice(i, 1);
                        cameras.splice(i, 1);
                        if (i < currentPlayer){
                            currentPlayer = currentPlayer - 1;
                        }
                    }
                }
            }
        }
    }*/

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

    merge(scene, players, cameras, currentPlayer) {
        for (let i=0; i < players.length; i=i+1){
            if (i !== currentPlayer){
                if (players[currentPlayer].intersectsMesh(players[i], true)){
                    console.log("touch player: "+i);
                    players[i].dispose();
                    cameras[i].dispose();

                    players.splice(i, 1);
                    cameras.splice(i, 1);
                    if (i < currentPlayer){
                        currentPlayer = currentPlayer - 1;
                    }
                }

            }
        }
    }
}