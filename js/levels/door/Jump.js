
export default class Jump{

    constructor(jumpMesh, scene) {
        this.jumpMesh = jumpMesh;

    }

    verifyTouchPlateform(scene){
        for (let i=0; i< this.jumpMesh.length; i++){
            for (let j=0; j<scene.players.length; j++){
                if (scene.players[j].playerMesh.intersectsPoint(this.jumpMesh[i].position)){

                    let impulseVector = new BABYLON.Vector3(0,1,0).scale(80);
                    let contactVector = scene.players[j].playerMesh.getAbsolutePosition();
                    scene.players[j].playerMesh.physicsImpostor.applyImpulse(impulseVector, contactVector)
                    console.log("saut");
                }
            }
        }

    }

}