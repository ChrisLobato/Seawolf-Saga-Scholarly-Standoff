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
//NOTE Later on we would need to import the other levels scenes

export default class LevelsScreen extends Scene {

    private background: Layer;
    private levelsscreen: Layer;
    
    
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
        level1Button.onClickEventId = "level 1"


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
                this.sceneManager.changeToScene(MainMenu);
                break;
            case "level 1":
                //REVISIT this is where we will need to import level 1 and switch to that
                this.sceneManager.changeToScene(MainHW4Scene)
                break;
        }
    }



}