import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import MainMenu from "./MainMenu";
import HW4Scene from "./HW4Scene";
import MainHW4Scene from "./MainHW4Scene";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Scene2 from "./Scene2";
import Scene6 from "./Scene6";
import Scene5 from "./Scene5";
import Scene4 from "./Scene4";
import Scene3 from "./Scene3";
import Scene7 from "./Scene7";
import Scene8 from "./Scene8";
import Scene9 from "./Scene9";
import Scene10 from "./Scene10";
import Scene11 from "./Scene11";
import Scene12 from "./Scene12";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
//NOTE Later on we would need to import the other levels scenes

export default class LevelsScreen extends Scene {

    private background: Layer;
    private levelsscreen: Layer;
    private levelsCompleted: number;
    public initScene(options: Record<string, any>): void {
        //this is where we can initialize and pass some information to the main menu scene and by proxy send it to the level select
        if(options!== undefined){
            this.levelsCompleted = options.completedLevels;
        }
        
    }
    
    
    public loadScene(){
        this.load.image("LevelsScreen","hw4_assets/sprites/LevelsScreen.png");
    }    

    public startScene(): void {
        const center = this.viewport.getCenter();
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);

        this.levelsscreen = this.addUILayer("levelsScreen");
        this.background = this.addUILayer("background");

        this.background.setDepth(0);
        this.levelsscreen.setDepth(1);

        let backgroundSprite = this.add.sprite("LevelsScreen", "background");
        backgroundSprite.positionX = center.x;
        backgroundSprite.positionY = center.y;
        backgroundSprite.scale.set(.77,.77);
    

        const menuButton =  this.add.uiElement(UIElementType.BUTTON, "levelsScreen", {position: new Vec2(center.x, center.y + 400), text: "Back to Main Menu"});
        menuButton.size.set(300,50);
        menuButton.borderWidth = 2;
        menuButton.borderColor = Color.BLACK;
        menuButton.backgroundColor = Color.BLACK;
        menuButton.onClickEventId = "start";

        //REVISIT
        //Might want to switch  these to sprites that can be clicked/check if when mouse is clicked its inside
        //the boundingRect of the sprite
        


        const level1Button = this.add.uiElement(UIElementType.BUTTON, "levelsScreen", {position: new Vec2(center.x-344, center.y - 380), text: "Level 1"});
        level1Button.size.set(205,205);
        level1Button.borderWidth = 2;
        level1Button.borderColor = Color.TRANSPARENT;
        level1Button.backgroundColor = Color.BLACK;
        level1Button.onClickEventId = "level 1";
        if(this.levelsCompleted<1){
            level1Button.visible = false;
        }

        const level2Button = this.add.uiElement(UIElementType.BUTTON, "levelsScreen", {position: new Vec2(center.x-110, center.y - 380), text: "Level 2"});
        level2Button.size.set(205,205);
        level2Button.borderWidth = 2;
        level2Button.borderColor = Color.TRANSPARENT;
        level2Button.backgroundColor = Color.BLACK;
        level2Button.onClickEventId = "level 2";

        if(this.levelsCompleted<2){
            level2Button.visible = false;
        }

        const level3Button = this.add.uiElement(UIElementType.BUTTON, "levelsScreen", {position: new Vec2(center.x+120, center.y - 380), text: "Level 3"});
        level3Button.size.set(205,205);
        level3Button.borderWidth = 2;
        level3Button.borderColor = Color.TRANSPARENT;
        level3Button.backgroundColor = Color.BLACK;
        level3Button.onClickEventId = "level 3";
        if(this.levelsCompleted<3){
            level3Button.visible = false;
        }

        const level4Button = this.add.uiElement(UIElementType.BUTTON, "levelsScreen", {position: new Vec2(center.x+340, center.y - 380), text: "Level 4"});
        level4Button.size.set(205,205);
        level4Button.borderWidth = 2;
        level4Button.borderColor = Color.TRANSPARENT;
        level4Button.backgroundColor = Color.BLACK;
        level4Button.onClickEventId = "level 4"
        if(this.levelsCompleted<4){
            level4Button.visible = false;
        }


        const level5Button = this.add.uiElement(UIElementType.BUTTON, "levelsScreen", {position: new Vec2(center.x-344, center.y-100), text: "Level 5"});
        level5Button.size.set(205,205);
        level5Button.borderWidth = 2;
        level5Button.borderColor = Color.TRANSPARENT;
        level5Button.backgroundColor = Color.BLACK;
        level5Button.onClickEventId = "level 5"
        if(this.levelsCompleted<5){
            level5Button.visible = false;
        }

        const level6Button = this.add.uiElement(UIElementType.BUTTON, "levelsScreen", {position: new Vec2(center.x-110, center.y-100), text: "Level 6"});
        level6Button.size.set(205,205);
        level6Button.borderWidth = 2;
        level6Button.borderColor = Color.TRANSPARENT;
        level6Button.backgroundColor = Color.BLACK;
        level6Button.onClickEventId = "level 6"
        if(this.levelsCompleted<6){
            level6Button.visible = false;
        }

        const level7Button = this.add.uiElement(UIElementType.BUTTON, "levelsScreen", {position: new Vec2(center.x+120, center.y-100), text: "Level 7"});
        level7Button.size.set(205,205);
        level7Button.borderWidth = 2;
        level7Button.borderColor = Color.TRANSPARENT;
        level7Button.backgroundColor = Color.BLACK;
        level7Button.onClickEventId = "level 7";
        if(this.levelsCompleted<7){
            level7Button.visible = false;
        }

        const level8Button = this.add.uiElement(UIElementType.BUTTON, "levelsScreen", {position: new Vec2(center.x+340, center.y-100), text: "Level 8"});
        level8Button.size.set(205,205);
        level8Button.borderWidth = 2;
        level8Button.borderColor = Color.TRANSPARENT;
        level8Button.backgroundColor = Color.BLACK;
        level8Button.onClickEventId = "level 8";

        if(this.levelsCompleted<8){
            level8Button.visible = false;
        }

        const level9Button = this.add.uiElement(UIElementType.BUTTON, "levelsScreen", {position: new Vec2(center.x-344, center.y + 190), text: "Level 9"});
        level9Button.size.set(205,205);
        level9Button.borderWidth = 2;
        level9Button.borderColor = Color.TRANSPARENT;
        level9Button.backgroundColor = Color.BLACK;
        level9Button.onClickEventId = "level 9";
        if(this.levelsCompleted<9){
            level9Button.visible = false;
        }

        const level10Button = this.add.uiElement(UIElementType.BUTTON, "levelsScreen", {position: new Vec2(center.x-110, center.y + 190), text: "Level 10"});
        level10Button.size.set(205,205);
        level10Button.borderWidth = 2;
        level10Button.borderColor = Color.TRANSPARENT;
        level10Button.backgroundColor = Color.BLACK;
        level10Button.onClickEventId = "level 10"
        if(this.levelsCompleted<10){
            level10Button.visible = false;
        }


        const level11Button = this.add.uiElement(UIElementType.BUTTON, "levelsScreen", {position: new Vec2(center.x+120, center.y + 190), text: "Level 11"});
        level11Button.size.set(205,205);
        level11Button.borderWidth = 2;
        level11Button.borderColor = Color.TRANSPARENT;
        level11Button.backgroundColor = Color.BLACK;
        level11Button.onClickEventId = "level 11"
        if(this.levelsCompleted<11){
            level11Button.visible = false;
        }

        const level12Button = this.add.uiElement(UIElementType.BUTTON, "levelsScreen", {position: new Vec2(center.x+340, center.y + 190), text: "Level 12"});
        level12Button.size.set(205,205);
        level12Button.borderWidth = 2;
        level12Button.borderColor = Color.TRANSPARENT;
        level12Button.backgroundColor = Color.BLACK;
        level12Button.onClickEventId = "level 12"
        if(this.levelsCompleted<12){
            level12Button.visible = false;
        }

        


        this.receiver.subscribe("start");
        this.receiver.subscribe("level 1");
        this.receiver.subscribe("level 2");
        this.receiver.subscribe("level 3");
        this.receiver.subscribe("level 4");
        this.receiver.subscribe("level 5");
        this.receiver.subscribe("level 6");
        this.receiver.subscribe("level 7");
        this.receiver.subscribe("level 8");
        this.receiver.subscribe("level 9");
        this.receiver.subscribe("level 10");
        this.receiver.subscribe("level 11");
        this.receiver.subscribe("level 12");
    }

    public updateScene(deltaT: number): void {
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }

    public handleEvent(event: GameEvent): void {
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "mainMenuMusic"});
        switch(event.type){
            case "start":
                this.sceneManager.changeToScene(MainMenu,{completedLevels: this.levelsCompleted},{});
                break;
            case "level 1":
                //REVISIT this is where we will need to import level 1 and switch to that
                this.sceneManager.changeToScene(MainHW4Scene,{completedLevels: this.levelsCompleted},{})
                break;
            case "level 2":
                this.sceneManager.changeToScene(Scene2,{completedLevels: this.levelsCompleted},{})
                break;
            case "level 3":
                this.sceneManager.changeToScene(Scene3,{completedLevels: this.levelsCompleted},{})
                break;
            case "level 4":
                this.sceneManager.changeToScene(Scene4,{completedLevels: this.levelsCompleted},{})
                break;
            case "level 5":
                this.sceneManager.changeToScene(Scene5,{completedLevels: this.levelsCompleted},{})
                break;
            case "level 6":
                this.sceneManager.changeToScene(Scene6,{completedLevels: this.levelsCompleted},{})
                break;
            case "level 7":
                //REVISIT this is where we will need to import level 1 and switch to that
                this.sceneManager.changeToScene(Scene7,{completedLevels: this.levelsCompleted},{})
                break;
            case "level 8":
                this.sceneManager.changeToScene(Scene8,{completedLevels: this.levelsCompleted},{})
                break;
            case "level 9":
                this.sceneManager.changeToScene(Scene9,{completedLevels: this.levelsCompleted},{})
                break;
            case "level 10":
                this.sceneManager.changeToScene(Scene10,{completedLevels: this.levelsCompleted},{})
                break;
            case "level 11":
                this.sceneManager.changeToScene(Scene11,{completedLevels: this.levelsCompleted},{})
                break;
            case "level 12":
                this.sceneManager.changeToScene(Scene12,{completedLevels: this.levelsCompleted},{})
                break;
        }
    }



}