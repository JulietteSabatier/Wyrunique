export default class Level {
    constructor(id, scene) {
        this.id = id;
        this.scene = scene;

        this.buildWalls();
    }

    buildWalls() {
        let wall = new BABYLON.MeshBuilder.CreateBox("wall", {height: 20, width: 2, depth: 300}, this.scene);
        wall.position = new BABYLON.Vector3(15, 10, 140);
        wall.physicsImpostor = new BABYLON.PhysicsImpostor(wall,
            BABYLON.PhysicsImpostor.BoxImpostor, {mass: 100});

        var instance = wall.createInstance("wall2");
        instance.position.x = -15;
        instance.physicsImpostor = new BABYLON.PhysicsImpostor(instance,
            BABYLON.PhysicsImpostor.BoxImpostor, {mass: 100});
    }
}