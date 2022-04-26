export default class AbstractMenu extends BABYLON.Scene{

    constructor(engine, canvas) {
        super(engine, canvas);

        if (this.constructor === AbstractMenu){
            throw new TypeError('Abstract class "AbstractMenu" cannot be instanced directly');
        }

        this.clearColor = new BABYLON.Color4(0.2, 0.2, 0.2, 1);
        let camera = new BABYLON.FreeCamera("fixCamera", new BABYLON.Vector3(0,50,0), this);
        this.activeCamera = camera;
        camera.attachControl(canvas);
        let light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(-1,-1,0), this);
        light.position.z = 2;

    }
}