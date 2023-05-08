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
        


        const level1Button = this.add.uiElement(UIElementType.BUTTON, "levelsScreen", {position: new Vec2(center.x-320, center.y - 318), text: "Level 1"});
        level1Button.size.set(255,255);
        level1Button.borderWidth = 2;
        level1Button.borderColor = Color.TRANSPARENT;
        level1Button.backgroundColor = Color.BLACK;
        level1Button.onClickEventId = "level 1";
        if(this.levelsCompleted<1){
            //level1Button.visible = false;
        }

        const level2Button = this.add.uiElement(UIElementType.BUTTON, "levelsScreen", {position: new Vec2(center.x, center.y - 318), text: "Level 2"});
        level2Button.size.set(255,255);
        level2Button.borderWidth = 2;
        level2Button.borderColor = Color.TRANSPARENT;
        level2Button.backgroundColor = Color.BLACK;
        level2Button.onClickEventId = "level 2";

        if(this.levelsCompleted<2){
            //level2Button.visible = false;
        }

        const level3Button = this.add.uiElement(UIElementType.BUTTON, "levelsScreen", {position: new Vec2(center.x+320, center.y - 318), text: "Level 3"});
        level3Button.size.set(255,255);
        level3Button.borderWidth = 2;
        level3Button.borderColor = Color.TRANSPARENT;
        level3Button.backgroundColor = Color.BLACK;
        level3Button.onClickEventId = "level 3";
        if(this.levelsCompleted<3){
            //level3Button.visible = false;
        }

        const level4Button = this.add.uiElement(UIElementType.BUTTON, "levelsScreen", {position: new Vec2(center.x-320, center.y+130), text: "Level 4"});
        level4Button.size.set(255,255);
        level4Button.borderWidth = 2;
        level4Button.borderColor = Color.TRANSPARENT;
        level4Button.backgroundColor = Color.BLACK;
        level4Button.onClickEventId = "level 4"
        if(this.levelsCompleted<4){
            //level4Button.visible = false;
        }


        const level5Button = this.add.uiElement(UIElementType.BUTTON, "levelsScreen", {position: new Vec2(center.x, center.y +130), text: "Level 5"});
        level5Button.size.set(255,255);
        level5Button.borderWidth = 2;
        level5Button.borderColor = Color.TRANSPARENT;
        level5Button.backgroundColor = Color.BLACK;
        level5Button.onClickEventId = "level 5"
        if(this.levelsCompleted<5){
            //level5Button.visible = false;
        }

        const level6Button = this.add.uiElement(UIElementType.BUTTON, "levelsScreen", {position: new Vec2(center.x+320, center.y +130), text: "Final Level"});
        level6Button.size.set(255,255);
        level6Button.borderWidth = 2;
        level6Button.borderColor = Color.TRANSPARENT;
        level6Button.backgroundColor = Color.BLACK;
        level6Button.onClickEventId = "level 6"
        if(this.levelsCompleted<6){
            //level6Button.visible = false;
        }

        


        this.receiver.subscribe("start");
        this.receiver.subscribe("level 1");
    }

    public updateScene(deltaT: number): void {
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }

    public handleEvent(event: GameEvent): void {
        switch(event.type){
            case "start":
                this.sceneManager.changeToScene(MainMenu,{completedLevels: this.levelsCompleted},{});
                break;
            case "level 1":
                //REVISIT this is where we will need to import level 1 and switch to that
                this.sceneManager.changeToScene(MainHW4Scene)
                break;
        }
    }



}