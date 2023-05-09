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

export default class Transition1 extends Scene {
  private background: Layer;
  private textLayer: Layer;
  private buttonLayer: Layer;
  private clickCounter: number;
  private center: Vec2;

  public loadScene() {
    this.load.image("black", "hw4_assets/sprites/black.png");
  }

  public startScene(): void {
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
        if (this.clickCounter < 7) {
          const paragraphs = [
            "The year is 20XX. You are a transfer student from Harvard,",
            "continuing your education at Stony Brook University.",
            "You're late to your housing appointment,",
            "and you've been scrambling to get a spot at West Apartments.",
            "You found one open spot, but just as you are about to click confirm,",
            "another name takes the slot: John Script.",
            "It's time to pay John a visit.",
          ];

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

          if (this.clickCounter === 7) {
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
          this.sceneManager.changeToScene(MainHW4Scene);
        }
        break;
    }
  }
}
