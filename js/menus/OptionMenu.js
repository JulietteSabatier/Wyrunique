import GameState from "../GameState.js";
import AbstractMenu from "./AbstractMenu.js";

export default class OptionMenu extends AbstractMenu{

    constructor(engine, canvas) {
        super(engine, canvas);
        let finished = this.createAdvancedTexture("gui/guiTextureOptionMenu.json", "guiOptionMenu");
    }

    async createAdvancedTexture(path, name){
        this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(name, true, this.scene);
        let loadedGui = await this.advancedTexture.parseFromURLAsync(path);

        this.returnButton = this.advancedTexture.getControlByName("returnButton");

        this.returnButton.onPointerUpObservable.add( function () {
            GameState.GameState = GameState.MainMenu;
            console.log("option to main");
        });
    }

}