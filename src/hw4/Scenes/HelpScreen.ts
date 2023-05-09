import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import MainMenu from "./MainMenu";


export default class HelpScreen extends Scene {

    private background: Layer;
    private helpscreen: Layer;
    private levelsCompleted: number;
    
    
    public loadScene(){
        this.load.image("HelpScreen","hw4_assets/sprites/HelpScreen.png");
        //this.load.image("logo", "hw4_assets/sprites/TransparentLogo.png");
    }    

    public initScene(options: Record<string, any>): void {
        //this is where we can initialize and pass some information to the main menu scene and by proxy send it to the level select
        if(options!== undefined){
            this.levelsCompleted = options.completedLevels;
        }
    }

    public startScene(): void {
        const center = this.viewport.getCenter();
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);

        this.helpscreen = this.addUILayer("helpScreen");
        this.background = this.addUILayer("background");

        this.background.setDepth(0);
        this.helpscreen.setDepth(1);

        let backgroundSprite = this.add.sprite("HelpScreen", "background");
        backgroundSprite.positionX = center.x;
        backgroundSprite.positionY = center.y;
        backgroundSprite.scale.set(.77,.77);
    
        // let logo = this.add.sprite("logo","background");
        // logo.positionX = center.x;
        // logo.positionY = center.y-420;
        // logo.scale.set(.75,.75);

        const menuButton =  this.add.uiElement(UIElementType.BUTTON, "helpScreen", {position: new Vec2(center.x, center.y + 300), text: "Back to Main Menu"});
        menuButton.size.set(300,50);
        menuButton.borderWidth = 2;
        menuButton.borderColor = Color.BLACK;
        menuButton.backgroundColor = Color.BLACK;
        menuButton.onClickEventId = "start";
        
        this.receiver.subscribe("start");
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
        }
    }



}