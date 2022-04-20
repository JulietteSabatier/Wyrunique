export default class Menu {

    static createMainMenuGui(scene){
        // Gui
        let mainMenu = {};

        mainMenu["gui"] = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("mainMenuUi", true, scene);
        mainMenu["gui"].idealWidth = 1500;

        // Name Game

        let text1 = new BABYLON.GUI.TextBlock();
        text1.text = "Wyrunique";
        text1.color = "white";
        text1.fontSize = 100;
        text1.top = "-300px";
        text1.left = "0px";
        mainMenu["gui"].addControl(text1);

        // Play
        mainMenu["play"] = new BABYLON.GUI.Button.CreateSimpleButton("play", "Play");
        mainMenu["play"].width = "150px"
        mainMenu["play"].height = "40px";
        mainMenu["play"].color = "white";
        mainMenu["play"].cornerRadius = 20;
        mainMenu["play"].background = "green";
        mainMenu["play"].top = "-100px";
        mainMenu["play"].left = "0px";
        mainMenu["gui"].addControl(mainMenu["play"]);

        // Options
        mainMenu["options"] = BABYLON.GUI.Button.CreateSimpleButton("options", "Options");
        mainMenu["options"].width = "150px"
        mainMenu["options"].height = "40px";
        mainMenu["options"].color = "white";
        mainMenu["options"].cornerRadius = 20;
        mainMenu["options"].background = "green";
        mainMenu["options"].top = "0px";
        mainMenu["options"].left = "0px";
        mainMenu["gui"].addControl(mainMenu["options"]);

        // Commands
        mainMenu["commands"] = BABYLON.GUI.Button.CreateSimpleButton("but3", "Commands");
        mainMenu["commands"].width = "150px"
        mainMenu["commands"].height = "40px";
        mainMenu["commands"].color = "white";
        mainMenu["commands"].cornerRadius = 20;
        mainMenu["commands"].background = "green";
        mainMenu["commands"].top = "100px";
        mainMenu["commands"].left = "0px";
        mainMenu["gui"].addControl(mainMenu["commands"]);

        return mainMenu;
    }

    static createLevelMenu(levels, scene){
        // Gui
        let levelMenu = {}

        let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("mainMenuUi", true, scene);
        advancedTexture.idealWidth = 2000;
        levelMenu["gui"] = advancedTexture;

        // Text name game
        var text1 = new BABYLON.GUI.TextBlock();
        text1.text = "Wyrunique";
        text1.color = "white";
        text1.fontSize = 100;
        text1.top = "-400px";
        text1.left = "0px";
        advancedTexture.addControl(text1);

        // Text choose level
        let text2 = new BABYLON.GUI.TextBlock();
        text2.text = "Choose your level:";
        text2.color = "white";
        text2.fontSize = 40;
        text2.top = "-300px";
        text2.left = "-350px";
        advancedTexture.addControl(text2);

        // Scroll level
        let choseLevel = new BABYLON.GUI.ScrollViewer("choseLevel");
        choseLevel.width = "1000px";
        choseLevel.height = "500px";
        choseLevel.background = "black";

        let gridLevel = new BABYLON.GUI.Grid()
        gridLevel.height = (levels.length * 80)+"px";

        levelMenu["levels"] = [];

        for (let i=0; i<levels.length; i++){
            let level = levels[i];
            gridLevel.addRowDefinition(80, true);
            levelMenu["levels"][i] = BABYLON.GUI.Button.CreateSimpleButton();
            // Background color
            if (i%2 === 0){
                levelMenu["levels"][i].background = "blue";

            }
            else if (i%2 === 1){
                levelMenu["levels"][i].background = "red";
            }

            let grid = new BABYLON.GUI.Grid();
            grid.addColumnDefinition(100, true);

            // Num level
            let numLevel = new BABYLON.GUI.Rectangle();
            let textNumLevel = new BABYLON.GUI.TextBlock("numLevel", ""+i);
            numLevel.addControl(textNumLevel);
            grid.addControl(numLevel, 0, 0);

            // Name level
            grid.addColumnDefinition(700, true);
            let nameLevel = new BABYLON.GUI.Rectangle();
            //let textNameLevel = new BABYLON.GUI.TextBlock("nameLevel", level);
            //nameLevel.addControl(textNameLevel);
            grid.addControl(nameLevel, 0, 1);
            levelMenu["levels"][i].addControl(grid);

            gridLevel.addControl(levelMenu["levels"][i], i);
        }

        choseLevel.addControl(gridLevel);
        advancedTexture.addControl(choseLevel);


        // Button return
        levelMenu["return"] = BABYLON.GUI.Button.CreateSimpleButton("return", "Return");
        //let button3 = BABYLON.GUI.Button.CreateSimpleButton("but3", "Return");
        levelMenu["return"].width = "150px"
        levelMenu["return"].height = "60px";
        levelMenu["return"].color = "white";
        levelMenu["return"].cornerRadius = 20;
        levelMenu["return"].background = "green";
        levelMenu["return"].top = "300px";
        levelMenu["return"].left = "400px";
        advancedTexture.addControl(levelMenu["return"]);

        return levelMenu;
    }

    static createCommandsMenu(scene){
        let commandsMenu = {};

        commandsMenu["gui"] = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("commandMenuUi", true, scene);

        // Text name game
        var text1 = new BABYLON.GUI.TextBlock();
        text1.text = "Wyrunique";
        text1.color = "white";
        text1.fontSize = 100;
        text1.top = "-400px";
        text1.left = "0px";
        commandsMenu["gui"].addControl(text1);

        // Text choose level
        let text2 = new BABYLON.GUI.TextBlock();
        text2.text = "Commands";
        text2.color = "white";
        text2.fontSize = 40;
        text2.top = "-300px";
        text2.left = "-350px";
        commandsMenu["gui"].addControl(text2);

        // Button return
        commandsMenu["return"] = BABYLON.GUI.Button.CreateSimpleButton("return", "Return");
        //let button3 = BABYLON.GUI.Button.CreateSimpleButton("but3", "Return");
        commandsMenu["return"].width = "150px"
        commandsMenu["return"].height = "60px";
        commandsMenu["return"].color = "white";
        commandsMenu["return"].cornerRadius = 20;
        commandsMenu["return"].background = "green";
        commandsMenu["return"].top = "300px";
        commandsMenu["return"].left = "400px";
        commandsMenu["gui"].addControl(commandsMenu["return"]);

        return commandsMenu;
    }

    static createOptionsMenu(scene){
        let optionsMenu = {};

        optionsMenu["gui"] = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("commandMenuUi", true, scene);

        // Text name game
        var text1 = new BABYLON.GUI.TextBlock();
        text1.text = "Wyrunique";
        text1.color = "white";
        text1.fontSize = 100;
        text1.top = "-400px";
        text1.left = "0px";
        optionsMenu["gui"].addControl(text1);

        // Text choose level
        let text2 = new BABYLON.GUI.TextBlock();
        text2.text = "Commands";
        text2.color = "white";
        text2.fontSize = 40;
        text2.top = "-300px";
        text2.left = "-350px";
        optionsMenu["gui"].addControl(text2);

        // Button return
        optionsMenu["return"] = BABYLON.GUI.Button.CreateSimpleButton("return", "Return");
        optionsMenu["return"].width = "150px"
        optionsMenu["return"].height = "60px";
        optionsMenu["return"].color = "white";
        optionsMenu["return"].cornerRadius = 20;
        optionsMenu["return"].background = "green";
        optionsMenu["return"].top = "300px";
        optionsMenu["return"].left = "400px";
        optionsMenu["gui"].addControl(optionsMenu["return"]);

        return optionsMenu;
    }

    static createLevelGui(level){
        let levelGui = {};

        levelGui["gui"] = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("commandMenuUi", true, level.scene);

        levelGui["remainBalls"] = new BABYLON.GUI.TextBlock();
        levelGui["remainBalls"].text = "Remaining balls: "+level.players.length;
        levelGui["remainBalls"].color = "white";
        levelGui["remainBalls"].fontSize = 40;
        levelGui["remainBalls"].top = "-500px";
        levelGui["remainBalls"].left = "-550px"
        levelGui["gui"].addControl(levelGui["remainBalls"]);

        // DropDown
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


}

