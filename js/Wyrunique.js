import GameState from "./GameState.js";
import MainMenu from "./menus/MainMenu.js";
import LevelMenu from "./menus/LevelMenu.js";
import OptionMenu from "./menus/OptionMenu.js";
import CommandMenu from "./menus/CommandMenu.js";
import Level1 from "./levels/Level1.js";
import Level2 from "./levels/Level2.js";

let canvas;
let engine;
let inputStates = {};

let scene;

let levels;

window.onload = startGame;

function startGame(){



    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);

//   levels[0] = new LevelMenu(engine, canvas, 0)
//   modifySetting(levels[0].scene);
//   levels[1] = new LevelMenu(engine, canvas, 1)
//   modifySetting(levels[1].scene);

    scene = new MainMenu(engine, canvas);

    engine.runRenderLoop(function() {
        let deltaTime = engine.getDeltaTime();

        if (GameState.precGameState !== GameState.GameState){
            scene.dispose();
            scene.advancedTexture.dispose();

            switch (GameState.GameState){
                case GameState.MainMenu:
                    scene = new MainMenu(engine, canvas);
                    GameState.precGameState = GameState.MainMenu;
                break;
                case GameState.LevelMenu:
                    scene = new LevelMenu(engine, canvas);
                    GameState.precGameState = GameState.LevelMenu;
                break;
                case GameState.CommandMenu:
                    scene = new CommandMenu(engine, canvas);
                    GameState.precGameState = GameState.CommandMenu;
                break;
                case GameState.OptionMenu:
                    scene = new OptionMenu(engine, canvas);
                    GameState.precGameState = GameState.OptionMenu;
                break;
                case GameState.Level:
                    switch (GameState.numLevel){
                        case 0:
                            scene = new Level1(engine, canvas);
                            GameState.precGameState = GameState.Level;
                        break;
                        case 1:
                            scene = new Level2(engine, canvas);
                            GameState.precGameState = GameState.Level;
                        break;
                    }
                break;
            }
            modifySetting(scene);
        }

        if (GameState.GameState === GameState.Level){

            if (GameState.restartLevel){
                switch (GameState.numLevel){
                    case 0:
                        scene = new Level1(engine, canvas);
                    break;
                    case 1:
                        scene = new Level2(engine, canvas);
                    break;
                }
                GameState.restartLevel = false;
            }

            movePlayer();
            mergePlayer();
        }
        scene.render();
    })
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


function modifySetting(scene){

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
        if ((event.key === "ArrowLeft") || (event.key === "q")|| (event.key === "Q")) {
            inputStates.left = true;
        } else if ((event.key === "ArrowUp") || (event.key === "z")|| (event.key === "Z")){
            inputStates.up = true;
        } else if ((event.key === "ArrowRight") || (event.key === "d")|| (event.key === "D")){
            inputStates.right = true;
        } else if ((event.key === "ArrowDown")|| (event.key === "s")|| (event.key === "S")) {
            inputStates.down = true;
        } else if (event.key === " ") {
            inputStates.space = true;
        } else if (event.key === "&") {
            inputStates.one = true;
        }
    }, false);

    //if the key will be released, change the states object
    window.addEventListener('keyup', (event) => {
        if ((event.key === "ArrowLeft") || (event.key === "q")|| (event.key === "Q")) {
            inputStates.left = false;
        } else if ((event.key === "ArrowUp") || (event.key === "z")|| (event.key === "Z")){
            inputStates.up = false;
        } else if ((event.key === "ArrowRight") || (event.key === "d")|| (event.key === "D")){
            inputStates.right = false;
        } else if ((event.key === "ArrowDown")|| (event.key === "s")|| (event.key === "S")) {
            inputStates.down = false;
        }  else if (event.key === " ") {
            inputStates.space = false;
        } else if (event.key === "&") {
            if (inputStates.one === true){
                //levels[GnumLevelShow].currentPlayer = (levels[numLevelShow].currentPlayer + 1) % levels[numLevelShow].players.length;
                //console.log("Switching to player/camera " + levels[numLevelShow].currentPlayer);
                //levels[numLevelShow].scene.activeCamera = levels[numLevelShow].cameras[levels[numLevelShow].currentPlayer];
            }
            inputStates.one = false;
        }
    }, false);
}