import GameState from "./GameState.js";
import Level1 from "./levels/Level1.js";
import Level2 from "./levels/Level2.js";
import CongratulationMenu from "./menus/CongratulationMenu.js";
import Menu from "./menus/Menu.js";
import Options from "./Options.js";

let canvas;
let engine;
let inputStates = {};

let scene;
window.onload = startGame;


//// ui orange color : #C97B04FF

function startGame(){

    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);
    modifySetting();

    scene = new Menu(engine, canvas);
    scene.createGuiMainMenu().then(r => true);

    engine.runRenderLoop(function() {
        let deltaTime = engine.getDeltaTime();

        if (GameState.precGameState !== GameState.GameState){

            switch (GameState.GameState){
                case GameState.MainMenu:
                    if (GameState.precGameState === GameState.Level || GameState.precGameState === GameState.Congratulation){
                        scene.dispose();
                        scene = new Menu(engine, canvas);
                    }
                    else{
                        scene.advancedTexture.dispose();
                    }
                    scene.createGuiMainMenu().then(r => true);
                    GameState.precGameState = GameState.MainMenu;
                break;
                case GameState.LevelMenu:
                    if (GameState.precGameState === GameState.Level || GameState.precGameState === GameState.Congratulation){
                        scene.dispose();
                        scene = new Menu(engine, canvas);
                    }
                    else{
                        scene.advancedTexture.dispose();
                    }
                    scene.createGuiLevelMenu().then(r => true);
                    GameState.precGameState = GameState.LevelMenu;
                break;
                case GameState.CommandMenu:
                    if (GameState.precGameState === GameState.Level || GameState.precGameState === GameState.Congratulation){
                        scene.dispose();
                        scene = new Menu(engine, canvas);
                    }
                    else{
                        scene.advancedTexture.dispose();
                    }
                    scene.createGuiCommandMenu().then(r => true);
                    GameState.precGameState = GameState.CommandMenu;
                break;
                case GameState.OptionMenu:
                    if (GameState.precGameState === GameState.Level || GameState.precGameState === GameState.Congratulation){
                        scene.dispose();
                        scene = new Menu(engine, canvas);
                    }
                    else{
                        scene.advancedTexture.dispose();
                    }
                     scene.createGuiOptionMenu().then(r => true);
                    GameState.precGameState = GameState.OptionMenu;
                break;
                case GameState.Congratulation:
                    scene.dispose();
                    scene = new CongratulationMenu(engine, canvas);
                    GameState.precGameState = GameState.Congratulation;
                break;
                case GameState.Level:
                    switch (GameState.numLevel){
                        case 0:
                            scene.dispose();
                            scene = new Level1(engine, canvas, 0);
                            GameState.precGameState = GameState.Level;
                        break;
                        case 1:
                            scene.dispose();
                            scene = new Level2(engine, canvas, 1);
                            GameState.precGameState = GameState.Level;
                        break;
                    }
                break;
            }
        }

        if (GameState.GameState === GameState.OptionMenu){
            scene.music.setVolume(Options.levelMusic);

            if (Options.soundEffectChanged){
                scene.soundEffect = new BABYLON.Sound("testSound", "musics/mixkit-retro-game-notification-212.wav", scene, null,
                    {volume: Options.levelSoundEffect}
                );
                //scene.music.pause();
                scene.soundEffect.play();
                //soundEffect.stop(1);
                //scene.music.play();
                Options.soundEffectChanged = false;
            }
        }

        if (GameState.GameState === GameState.Level){

            if (GameState.restartLevel){
                scene.dispose();
                scene.advancedTexture.dispose();

                switch (GameState.numLevel){
                    case 0:
                        scene = new Level1(engine, canvas, 0);
                    break;
                    case 1:
                        scene = new Level2(engine, canvas, 1);
                    break;
                }

                GameState.restartLevel = false;
            }

            movePlayer();
            mergePlayer();
            playerFinishLevel();
        }
        scene.render();
    })
}

function playerFinishLevel(){
    let player = scene.players[scene.currentPlayer];
    if (scene.canFinish){
        if (player){
            let endZone = new BABYLON.Vector3(scene.particleSystem.emitter.x, 0, scene.particleSystem.emitter.z);

            if (player.playerMesh.intersectsPoint(endZone)){
                GameState.GameState = GameState.Congratulation;
            }
        }
    }
}

function movePlayer(){
    let player = scene.players[scene.currentPlayer];
    if (player){
        player.move(scene, inputStates);
    }
}
function mergePlayer(){
    let player = scene.players[scene.currentPlayer];
    if (player){
        player.merge(scene);
    }
}

function modifySetting(){

    // resize
    window.addEventListener("resize", () => {
        engine.resize()
    })

    // key listener
    inputStates.left = false;
    inputStates.right = false;
    inputStates.up = false;
    inputStates.down = false;
    inputStates.space = false;

    //add the listener to the main, window object, and update the states
    window.addEventListener('keydown', (event) => {
        if ((event.key === "q")|| (event.key === "Q")) {
            inputStates.left = true;
        } else if ((event.key === "z")|| (event.key === "Z")){
            inputStates.up = true;
        } else if ((event.key === "d")|| (event.key === "D")){
            inputStates.right = true;
        } else if ((event.key === "s")|| (event.key === "S")) {
            inputStates.down = true;
        } else if (event.key === " ") {
            inputStates.space = true;
        } else if (event.key === "&") {
            inputStates.one = true;
        }
    }, false);

    //if the key will be released, change the states object
    window.addEventListener('keyup', (event) => {
        if ((event.key === "q")|| (event.key === "Q")) {
            inputStates.left = false;
        } else if ((event.key === "z")|| (event.key === "Z")){
            inputStates.up = false;
        } else if ((event.key === "d")|| (event.key === "D")){
            inputStates.right = false;
        } else if ((event.key === "s")|| (event.key === "S")) {
            inputStates.down = false;
        }  else if (event.key === " ") {
            inputStates.space = false;
        } else if (event.key === "&") {
            if (inputStates.one === true){
                    scene.changePlayer();
            }
            inputStates.one = false;
        }
    }, false);
}