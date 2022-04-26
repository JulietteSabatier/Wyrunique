import GameState from "../GameState.js";
import AbstractMenu from "./AbstractMenu.js";

export default class MainMenu extends AbstractMenu{

    constructor(engine, canvas) {
        super(engine, canvas);
        let finished = this.createAdvancedTexture("gui/guiTextureMainMenu.json", "guiMainMenu");
    }

    async createAdvancedTexture(path, name){
        this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(name, true, this.scene);
        let loadedGui = await this.advancedTexture.parseFromURLAsync(path);

        this.levelMenuButton = this.advancedTexture.getControlByName("levelButton");
        this.commandMenuButton = this.advancedTexture.getControlByName("commandsButton");
        this.optionMenuButton = this.advancedTexture.getControlByName("OptionButton");

        this.levelMenuButton.onPointerUpObservable.add( function () {
            GameState.GameState = GameState.LevelMenu;
            console.log("main to level");
        })
        this.commandMenuButton.onPointerUpObservable.add(function () {
            GameState.GameState = GameState.CommandMenu;
            console.log("main to command");
        });
        this.optionMenuButton.onPointerUpObservable.add(function () {
            GameState.GameState = GameState.OptionMenu;
            console.log("main to options");
        });

    }

}