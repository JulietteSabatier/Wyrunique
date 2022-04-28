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


/*
    // DropDown to keep if needed
    
        levelGui["levelOption"] =  new BABYLON.GUI.Container();
        levelGui["levelOption"].width = "180px";
        levelGui["levelOption"].top = "20px";
        levelGui["levelOption"].left = "600px";
        levelGui["levelOption"].isHitTestVisible = false;

        // Primary button
        levelGui["levelOptionButton"] = BABYLON.GUI.Button.CreateSimpleButton(null, "Options");
        levelGui["levelOptionButton"].height = "40px";
        levelGui["levelOptionButton"].background = "white";
        levelGui["levelOptionButton"].color = "black";
        levelGui["levelOptionButton"].verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

        // Options panel
        levelGui["levelOptionStack"] = new BABYLON.GUI.StackPanel();
        levelGui["levelOptionStack"].verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        levelGui["levelOptionStack"].top = "40px";
        levelGui["levelOptionStack"].isVisible = false;
        levelGui["levelOptionStack"].isVertical = true;

        // Restart
        levelGui["restartButton"] = BABYLON.GUI.Button.CreateSimpleButton("restart", "Restart");
        levelGui["restartButton"].height = "40px";
        levelGui["restartButton"].paddingTop = "-1px";
        levelGui["restartButton"].background = "white";
        levelGui["restartButton"].color = "black";
        levelGui["levelOptionStack"].addControl(levelGui["restartButton"]);

        // Restart
        levelGui["save"] = BABYLON.GUI.Button.CreateSimpleButton("Save", "Save");
        levelGui["save"].height = "40px";
        levelGui["save"].paddingTop = "-1px";
        levelGui["save"].background = "white";
        levelGui["save"].color = "black";
        levelGui["levelOptionStack"].addControl(levelGui["save"]);

        // Restart
        levelGui["quit"] = BABYLON.GUI.Button.CreateSimpleButton("quit", "Quit");
        levelGui["quit"].height = "40px";
        levelGui["quit"].paddingTop = "-1px";
        levelGui["quit"].background = "white";
        levelGui["quit"].color = "black";
        levelGui["levelOptionStack"].addControl(levelGui["quit"]);

        // Hide and seek stack panel
        levelGui["levelOptionButton"].onPointerUpObservable.add(function() {
            levelGui["levelOptionStack"].isVisible = !levelGui["levelOptionStack"].isVisible;
        });


        // add controls
        levelGui["levelOption"].addControl(levelGui["levelOptionButton"]);
        levelGui["levelOption"].addControl(levelGui["levelOptionStack"]);
        levelGui["gui"].addControl(levelGui["levelOption"]);


        return levelGui;

    }

    // dropdown find on playground
    // https://www.babylonjs-playground.com/#H10NI4#3

 */