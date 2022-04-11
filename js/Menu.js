export default class Menu {

    static createMainMenuGui(scene, engine, canvas){
        // Gui
        let mainMenu = {};


        let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("mainMenuUi", true, scene);
        advancedTexture.idealWidth = 1500;
        mainMenu["gui"] = advancedTexture;
        // Name Game

        let text1 = new BABYLON.GUI.TextBlock();
        text1.text = "Wyrunique";
        text1.color = "white";
        text1.fontSize = 100;
        text1.top = "-300px";
        text1.left = "0px";
        advancedTexture.addControl(text1);

        // Play
        mainMenu["play"] = new BABYLON.GUI.Button.CreateSimpleButton("play", "Play");
        mainMenu["play"].width = "150px"
        mainMenu["play"].height = "40px";
        mainMenu["play"].color = "white";
        mainMenu["play"].cornerRadius = 20;
        mainMenu["play"].background = "green";
        mainMenu["play"].top = "-100px";
        mainMenu["play"].left = "0px";
        advancedTexture.addControl(mainMenu["play"]);

        // Options
        mainMenu["options"] = BABYLON.GUI.Button.CreateSimpleButton("options", "Options");
        mainMenu["options"].width = "150px"
        mainMenu["options"].height = "40px";
        mainMenu["options"].color = "white";
        mainMenu["options"].cornerRadius = 20;
        mainMenu["options"].background = "green";
        mainMenu["options"].top = "0px";
        mainMenu["options"].left = "0px";
        advancedTexture.addControl(mainMenu["options"]);

        // Commands
        mainMenu["commands"] = BABYLON.GUI.Button.CreateSimpleButton("but3", "Commands");
        mainMenu["commands"].width = "150px"
        mainMenu["commands"].height = "40px";
        mainMenu["commands"].color = "white";
        mainMenu["commands"].cornerRadius = 20;
        mainMenu["commands"].background = "green";
        mainMenu["commands"].top = "100px";
        mainMenu["commands"].left = "0px";
        advancedTexture.addControl(mainMenu["commands"]);

        return mainMenu;
    }



    static createLevelMenu(levels, scene, engine, canvas){
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
        let chooseLevel = new BABYLON.GUI.ScrollViewer("chosseLevel");
        chooseLevel.width = "1000px";
        chooseLevel.height = "500px";
        chooseLevel.background = "black";

        let gridLevel = new BABYLON.GUI.Grid()
        gridLevel.height = (levels.length * 80)+"px";

        for (let i=0; i<levels.length; i++){
            let level = levels[i];
            gridLevel.addRowDefinition(80, true);
            let rect = new BABYLON.GUI.Rectangle();
            if (i%2 === 0){
                rect.background = "blue";

            }
            else if (i%2 === 1){
                rect.background = "red";
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
            let textNameLevel = new BABYLON.GUI.TextBlock("nameLevel", level);
            nameLevel.addControl(textNameLevel);
            grid.addControl(nameLevel, 0, 1);
            rect.addControl(grid);

            gridLevel.addControl(rect, i);
        }
        chooseLevel.addControl(gridLevel);
        advancedTexture.addControl(chooseLevel);


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

}

