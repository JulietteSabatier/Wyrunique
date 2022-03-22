export default class Me {
    constructor(meMesh, id, scene){
        this.meMesh = meMesh;
        this.id = id;
        this.scene = scene;

        meMesh.Me = this;
        this.meMesh.scaling = new BABYLON.Vector3(1,1,1);

    }



}