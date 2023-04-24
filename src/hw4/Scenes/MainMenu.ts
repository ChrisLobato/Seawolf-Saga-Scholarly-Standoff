import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import MainHW4Scene from "./MainHW4Scene";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import AstarDemoScene from "./AstarDemoScene";
import GuardDemoScene from "./GuardDemoScene";
import HelpScreen from "./HelpScreen";
import ControlsScreen from "./ControlsScreen";
import LevelsScreen from "./LevelsScreen";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";


export default class MainMenu extends Scene {
    // Layers, for multiple main menu screens
    private mainMenu: Layer;
    private background: Layer;
    private about: Layer;
    private control: Layer;

    public loadScene(){
        this.load.image("MainMenu", "hw4_assets/sprites/MainMenu.png");
        this.load.image("logo", "hw4_assets/sprites/TransparentLogo.png");
        this.load.audio("mainMenuMusic", "hw4_assets/sounds/s4_main_menu_music.wav");

    }

    public startScene(){
        const center = this.viewport.getCenter();
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);
        
        // The main menu
        this.mainMenu = this.addUILayer("mainMenu");
        this.background = this.addUILayer("background");
        this.background.setDepth(0);
        this.mainMenu.setDepth(1);
        let backgroundSprite = this.add.sprite("MainMenu", "background");
        let logo = this.add.sprite("logo","background");
        backgroundSprite.positionX = center.x;
        backgroundSprite.positionY = center.y;
        backgroundSprite.scale.set(.77,.77)
        logo.positionX = center.x;
        logo.positionY = center.y-420;
        logo.scale.set(.75,.75);
        


        const play = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y - 100), text: "Play"});
        play.size.set(200, 50);
        play.borderWidth = 2;
        play.borderColor = Color.BLACK;
        play.backgroundColor = Color.BLACK;
        play.onClickEventId = "play";

        const levels = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y), text: "Level Select"});
        levels.size.set(200, 50);
        levels.borderWidth = 2;
        levels.borderColor = Color.BLACK;
        levels.backgroundColor =Color.BLACK;
        levels.onClickEventId = "level select";

        const controlsButton = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 100), text: "Controls"});
        controlsButton.size.set(200,50);
        controlsButton.borderWidth = 2;
        controlsButton.borderColor = Color.BLACK;
        controlsButton.backgroundColor = Color.BLACK;
        controlsButton.onClickEventId = "controls";

        const help = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 200), text: "Help"});
        help.size.set(200, 50);
        help.borderWidth = 2;
        help.borderColor = Color.BLACK;
        help.backgroundColor = Color.BLACK;
        help.onClickEventId = "help";

        // Subscribe to the button events
        this.receiver.subscribe("play");
        this.receiver.subscribe("level select");
        this.receiver.subscribe("controls");
        this.receiver.subscribe("help");

        //Play Music
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "mainMenuMusic"});
        this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key: "mainMenuMusic", loop: true, holdReference: true});
        
    }

    public updateScene(){
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            case "play": {
                this.sceneManager.changeToScene(MainHW4Scene);
                break;
            }
            case "level select": {
                this.sceneManager.changeToScene(LevelsScreen);
                break;
            }
            case "controls":{
                this.sceneManager.changeToScene(ControlsScreen);
                break;
            }
            case "help": {
                this.sceneManager.changeToScene(HelpScreen);
                break;
            }
        }
    }
}