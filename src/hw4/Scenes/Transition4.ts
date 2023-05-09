import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import MainMenu from "./MainMenu";
import MainHW4Scene from "./MainHW4Scene";
import Scene2 from "./Scene2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Scene4 from "./Scene4";
import Scene8 from "./Scene8";

export default class Transition1 extends Scene {
  private background: Layer;
  private textLayer: Layer;
  private buttonLayer: Layer;
  private clickCounter: number;
  private center: Vec2;

  public loadScene() {
    this.load.image("black", "hw4_assets/sprites/black.png");
    this.load.audio("transitionMusic", "hw4_assets/sounds/s4_transition.wav");
  }

  public startScene(): void {
    this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key: "transitionMusic", loop: true, holdReference: true});
    this.clickCounter = 0;
    const center = this.viewport.getCenter();
    let size = this.viewport.getHalfSize();
    this.viewport.setFocus(size);
    this.viewport.setZoomLevel(1);

    this.background = this.addUILayer("background");
    this.textLayer = this.addUILayer("textLayer");
    this.buttonLayer = this.addUILayer("buttonLayer");

    this.background.setDepth(0);
    this.textLayer.setDepth(1);
    this.buttonLayer.setDepth(2);

    let backgroundSprite = this.add.sprite("black", "background");
    backgroundSprite.positionX = center.x;
    backgroundSprite.positionY = center.y;
    this.center = new Vec2(center.x, center.y);

    let continueButton = this.add.uiElement(
      UIElementType.BUTTON,
      "buttonLayer",
      {
        position: new Vec2(center.x, center.y + 300),
        text: "Continue",
      }
    );
    continueButton.size.set(300, 50);
    continueButton.borderWidth = 2;
    continueButton.borderColor = Color.BLACK;
    continueButton.backgroundColor = Color.BLACK;
    continueButton.onClickEventId = "continue";
    this.receiver.subscribe("continue");
  }

  public updateScene(deltaT: number): void {
    while (this.receiver.hasNextEvent()) {
      this.handleEvent(this.receiver.getNextEvent());
    }
  }

  public handleEvent(event: GameEvent): void {
    switch (event.type) {
      case "continue":
        //Introduce evil John Script clones storyline
        const paragraphs = [
          "Beaten and battered, you stumble to a bench and sit down to rest.",
          "The unconscious bodies of the adversaries you defeated lay scattered around you.",
          "You finally have a moment to get a good look at them.",
          "To your horror, you realize that they are all clones of John Script!",
          "Every single one, a spitting image of the next.",
          "As if things couldn't get worse,",
          "several John Script clones emerge from the murky depths of Roth Pond.",
          "Only Wolfie can save you now.",
          "You rise, and flee to the stadium."
        ];
        if (this.clickCounter < paragraphs.length) {

          // Display each line from paragraphs using clickCounter as index
            let text = <Label>(
                this.add.uiElement(UIElementType.LABEL, "textLayer", {
                    position: new Vec2(this.center.x, this.center.y - 300 + this.clickCounter * 50),
                    text: paragraphs[this.clickCounter],
                })
            );
            text.textColor = Color.WHITE;
            text.fontSize = 32;
            text.font = "PixelSimple";

          this.clickCounter++;

          if (this.clickCounter === paragraphs.length) {
            let continueButton = <Button>(
              this.add.uiElement(UIElementType.BUTTON, "buttonLayer", {
                position: new Vec2(this.center.x, this.center.y + 300),
                text: "Start Level",
              })
            );
            continueButton.size.set(300, 50);
            continueButton.borderWidth = 2;
            continueButton.borderColor = Color.BLACK;
            continueButton.backgroundColor = Color.BLACK;
            continueButton.onClickEventId = "continue";
          }
        } else {
          this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "transitionMusic"});
          this.sceneManager.changeToScene(Scene8);
        }
        break;
    }
  }
}
