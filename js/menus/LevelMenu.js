import GameState from "../GameState.js";
import AbstractMenu from "./AbstractMenu.js";

export default class LevelMenu extends AbstractMenu{

    constructor(engine, canvas) {
        super(engine, canvas);
        let finished = this.createAdvancedTexture("gui/guiTextureLevelMenu.json", "guiLevelMenu");
    }

    async createAdvancedTexture(path, name){
        this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(name, true, this.scene);
        let loadedGui = await this.advancedTexture.parseFromURLAsync(path);

        this.returnButton = this.advancedTexture.getControlByName("returnButton");
        this.level1Button = this.advancedTexture.getControlByName("buttonLevel1");
        this.level2Button = this.advancedTexture.getControlByName("buttonLevel2");

        this.returnButton.onPointerUpObservable.add( function () {
            GameState.GameState = GameState.MainMenu;
            console.log("level to main");
        });
        this.level1Button.onPointerUpObservable.add( function (){
            GameState.GameState = GameState.Level;
            GameState.numLevel = 0;
            console.log("level to 1");
        });
        this.level2Button.onPointerUpObservable.add( function (){
            GameState.GameState = GameState.Level;
            GameState.numLevel = 1;
            console.log("level to 2");
        });
    }


}