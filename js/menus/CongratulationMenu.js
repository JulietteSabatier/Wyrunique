import AbstractMenu from "./AbstractMenu.js";
import GameState from "../GameState.js";

export default class CongratulationMenu extends AbstractMenu{

    constructor(engine, canvas) {
        super(engine, canvas);
        let finished = this.createAdvancedTexture("gui/guiTextureCongratulation.json", "congratulationMenu");
    }

    async createAdvancedTexture(path, name){
        this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(name, true, this);
        let loadedGui = await this.advancedTexture.parseFromURLAsync(path);

        this.returnMenuButton = this.advancedTexture.getControlByName("returnMenuButton");
        this.restartLevelButton = this.advancedTexture.getControlByName("restartLevelButton");

        this.returnMenuButton.onPointerUpObservable.add(function (){
            GameState.GameState = GameState.LevelMenu;
            console.log("congratulation to level menu");
        })

        this.restartLevelButton.onPointerUpObservable.add(function (){
            GameState.GameState = GameState.Level;
            console.log("congratulation to level");
        })
    }
}