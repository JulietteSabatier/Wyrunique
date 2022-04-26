import GameState from "../GameState.js";
import AbstractMenu from "./AbstractMenu.js";

export default class CommandMenu extends AbstractMenu{

    constructor(engine, canvas) {
        super(engine, canvas);
        let finished = this.createAdvancedTexture("gui/guiTextureCommandMenu.json", "guiCommandMenu");
    }

    async createAdvancedTexture(path, name) {
        this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(name, true, this.scene);
        let loadedGui = await this.advancedTexture.parseFromURLAsync(path);

        this.returnButton = this.advancedTexture.getControlByName("returnButton");

        this.returnButton.onPointerUpObservable.add( function () {
            GameState.GameState = GameState.MainMenu;
            console.log("commands to main");
        });
    }
}