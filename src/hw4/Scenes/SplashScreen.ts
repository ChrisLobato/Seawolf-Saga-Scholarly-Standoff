import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import MainMenu from "./MainMenu";


export default class SplashScreen extends Scene {
    loadScene(): void {
        this.load.image("SplashScreen", "hw4_assets/sprites/SplashScreen.png");


    }



    startScene(): void {
        this.addUILayer("primary");
        let c = this.viewport.getCenter()
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);

        let SplashScreenSprite = this.add.sprite("SplashScreen","primary");
        SplashScreenSprite.positionX = c.x;
        SplashScreenSprite.positionY = c.y;
        SplashScreenSprite.scale.set(.77,.77)

        const start = this.add.uiElement(UIElementType.BUTTON, "primary", {position: new Vec2(c.x, c.y+430), text: "Start"}) 
        start.size.set(200, 50);
        start.borderWidth = 2;
        start.borderColor = Color.BLACK;
        start.backgroundColor = Color.BLACK;
        start.alpha
        start.onClickEventId = "start";

        
        //Subscribe to the one button event

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
                this.sceneManager.changeToScene(MainMenu);
                break;
        }
    }
}