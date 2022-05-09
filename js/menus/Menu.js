import GameState from "../GameState.js";
import Options from "../Options.js";

export default class Menu extends BABYLON.Scene{

    constructor(engine, canvas, begin) {
        super(engine, canvas);

        // Background
        this.clearColor = new BABYLON.Color4(0.2, 0.2, 0.2, 1);

        // Camera
        //let camera = new BABYLON.FreeCamera("fixCamera", new BABYLON.Vector3(0,2,-20), this);
        //this.activeCamera = camera;
        //camera.attachControl(canvas);

        if (begin){
            this.bigBall = new BABYLON.MeshBuilder.CreateSphere("bigBall",
                {
                    segments:32,
                    diameter:10,
                    updatable:true
                }, this);
            this.bigBall.position.x = 0;
            this.bigBall.position.y = 0;
            this.bigBall.position.z = 0;

            this.bigBallMaterial = new BABYLON.StandardMaterial("ballMaterial", this);
            this.bigBallMaterial.diffuseTexture = new BABYLON.Texture("images/Ball.jpg", this);
            //this.bigBallMaterial.emisiveTexture = new BABYLON.Texture("images/Ball.jpg", this);
            this.bigBall.material = this.bigBallMaterial;
        }
        else{
            //this.fallingBalls();
        }
        // Ball


        this.rotateCamera = new BABYLON.ArcRotateCamera("rotateCamera", Math.PI/2,Math.PI/2,20, new BABYLON.Vector3(0,0,0),this)
        this.activeCamera = this.rotateCamera;
        this.rotateCamera.attachControl(canvas);

        // Light
        let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(-1,1,0), this);
        light.diffuse = new BABYLON.Color4(256,256,256, 0);


        // Music
        this.music = new BABYLON.Sound("menuMusic", "musics/Papillon.mp3", this, null,
            {
                loop: true,
                autoplay: true,
                volume: Options.levelMusic
            });



    }

    /////// Animation ///////

    zoom(){
        this.rotateCamera.radius = this.rotateCamera.radius - 0.02;
        this.rotateCamera.alpha = this.rotateCamera.alpha + 0.01 % (Math.PI);

    }

    explosion(){

        BABYLON.ParticleHelper.CreateAsync("explosion", this).then((set) => {
            set.systems.forEach(s => {
                s.disposeOnStop = true;
            });
            BABYLON.setAndStartTimer({
                timeout:4000,
                contextObservable: this.onBeforeRenderObservable,
                onTick: ()=>{
                    this.rotateCamera.alpha = this.rotateCamera.alpha + 0.02 % (Math.PI);
                    set.start()
                },
                onEnded: () => {
                    this.finishExplosion = true;
                }
            })
        });

    }

    fallingBalls(){
        this.sphere1 = this.createSphere(10,5);

        this.createSphere(10, -5);
        this.createSphere(5, 20);
    }

    createSphere(x,y){
        let sphere1 = BABYLON.MeshBuilder.CreateSphere( "sphere",
            {
                segments:32,
                diameter: 1,
                updatable:true
            }, this);
        sphere1.position.x = x;
        sphere1.position.y = y;
    }

    //////// GUI //////////

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

    async createGuiStartMenu(){
        this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("guiStartMenu", true, this);
        let loadedGui = await this.advancedTexture.parseFromURLAsync("gui/guiTextureStartScene.json");
        this.advancedTexture.startButton = this.advancedTexture.getControlByName("buttonStart");

        this.advancedTexture.startButton.onPointerUpObservable.add( function(){
            GameState.GameState = GameState.CinematicMenu;
            console.log("start to cinematic");
        })
    }

    async createGuiExplicationMenu(){
        this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("guiExplicationMenu", true, this);
        let loadedGui = await this.advancedTexture.parseFromURLAsync("gui/guiTextureExplication.json");
        this.advancedTexture.startButton = this.advancedTexture.getControlByName("playButton");

        this.advancedTexture.startButton.onPointerUpObservable.add(function(){
            GameState.GameState = GameState.MainMenu;
            console.log("explication to main menu");
        })
    }
}

