import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Input from "../../Wolfie2D/Input/Input";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import MainMenu from "./MainMenu";

export default class GameOver extends Scene {


    private timesDodged: number;
    private damageTaken: number;
    private timeSurvived: number;
    private currentLevel: number;


    public initScene(options: Record<string, any>): void {
        this.timesDodged = options.timesDodged;
        this.damageTaken = options.damageTaken;
        this.timeSurvived = options.timeSurvived;
        this.currentLevel = options.completedLevels;

    }

    public startScene() {
        const center = this.viewport.getCenter();

        this.addUILayer("primary");

        const gameOver = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y-100), text: "Game Over"});
        gameOver.textColor = Color.WHITE;


        const time = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y), text: `You survived ${(this.timeSurvived)} seconds!`});
        time.textColor = Color.GREEN;

        const dodges = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y + 100), text: `You dodged ${this.timesDodged} times!`});
        dodges.textColor = Color.GREEN;

        const damage = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y + 200), text: `You took ${this.damageTaken} damage!`})
        damage.textColor = Color.GREEN;

        const text = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y + 300), text: "Click to return to main menu"});
        text.textColor = Color.WHITE;
    }

    public updateScene(){
        if(Input.isMouseJustPressed()){
            this.sceneManager.changeToScene(MainMenu,{completedLevels: this.currentLevel},{});
        }
    }

}