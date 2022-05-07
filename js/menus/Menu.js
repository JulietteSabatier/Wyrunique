import GameState from "../GameState.js";
import Options from "../Options.js";

export default class Menu extends BABYLON.Scene{

    constructor(engine, canvas) {
        super(engine, canvas);

        this.clearColor = new BABYLON.Color4(0.2, 0.2, 0.2, 1);
        let camera = new BABYLON.FreeCamera("fixCamera", new BABYLON.Vector3(0,50,0), this);
        this.activeCamera = camera;
        camera.attachControl(canvas);
        let light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(-1,-1,0), this);
        light.position.z = 2;

        this.music = new BABYLON.Sound("menuMusic", "musics/Papillon.mp3", this, null,
            {
                loop: true,
                autoplay: true,
                volume: Options.levelMusic
            });
    }

    async createGuiMainMenu(){
        this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(name, true, this);
        let loadedGui = await this.advancedTexture.parseFromURLAsync("gui/guiTextureMainMenu.json");

        this.advancedTexture.levelMenuButton = this.advancedTexture.getControlByName("levelButton");
        this.advancedTexture.commandMenuButton = this.advancedTexture.getControlByName("commandsButton");
        this.advancedTexture.optionMenuButton = this.advancedTexture.getControlByName("OptionButton");

        this.advancedTexture.levelMenuButton.onPointerUpObservable.add( function () {
            GameState.GameState = GameState.LevelMenu;
            console.log("main to level");
        })
        this.advancedTexture.commandMenuButton.onPointerUpObservable.add(function () {
            GameState.GameState = GameState.CommandMenu;
            console.log("main to command");
        });
        this.advancedTexture.optionMenuButton.onPointerUpObservable.add(function () {
            GameState.GameState = GameState.OptionMenu;
            console.log("main to options");
        });


    }

    async createGuiLevelMenu(){
        this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(name, true, this);
        let loadedGui = await this.advancedTexture.parseFromURLAsync("gui/guiTextureLevelMenu.json");

        this.advancedTexture.returnButton = this.advancedTexture.getControlByName("returnButton");
        this.advancedTexture.level1Button = this.advancedTexture.getControlByName("buttonLevel1");
        this.advancedTexture.level2Button = this.advancedTexture.getControlByName("buttonLevel2");

        this.advancedTexture.returnButton.onPointerUpObservable.add( function () {
            GameState.GameState = GameState.MainMenu;
            console.log("level to main");
        });
        this.advancedTexture.level1Button.onPointerUpObservable.add( function (){
            GameState.GameState = GameState.Level;
            GameState.numLevel = 0;
            console.log("level to 1");
        });
        this.advancedTexture.level2Button.onPointerUpObservable.add( function (){
            GameState.GameState = GameState.Level;
            GameState.numLevel = 1;
            console.log("level to 2");
        });
    }

    async createGuiOptionMenu(){
    this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(name, true, this);
    let loadedGui = await this.advancedTexture.parseFromURLAsync("gui/guiTextureOptionMenu.json");


    this.advancedTexture.returnButton = this.advancedTexture.getControlByName("returnButton");
    this.advancedTexture.sliderMusicVolume = this.advancedTexture.getControlByName("sliderMusicVolume");
    this.advancedTexture.sliderEffectVolume = this.advancedTexture.getControlByName("sliderEffectVolume");

    this.advancedTexture.sliderMusicVolume.isThumbClamped= true;
    this.advancedTexture.sliderMusicVolume.value = Options.levelMusic;

    this.advancedTexture.sliderEffectVolume.isThumbClamped= true;
    this.advancedTexture.sliderEffectVolume.value = Options.levelSoundEffect;

    this.advancedTexture.returnButton.onPointerUpObservable.add( function () {
        GameState.GameState = GameState.MainMenu;
        console.log("option to main");
    });
    this.advancedTexture.sliderMusicVolume.onValueChangedObservable.add(function(value) {
        Options.levelMusic = value;
    });
    this.advancedTexture.sliderEffectVolume.onPointerUpObservable.add( function (){
        Options.soundEffectChanged = true;
    })
    this.advancedTexture.sliderEffectVolume.onValueChangedObservable.add(function(value){
        Options.levelSoundEffect = value;
    });
    }

    async createGuiCommandMenu(){
        this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(name, true, this);
        let loadedGui = await this.advancedTexture.parseFromURLAsync("gui/guiTextureCommandMenu.json");
        this.advancedTexture.returnButton = this.advancedTexture.getControlByName("returnButton");

        this.advancedTexture.returnButton.onPointerUpObservable.add( function () {
            GameState.GameState = GameState.MainMenu;
            console.log("commands to main");
        });
    }

}

