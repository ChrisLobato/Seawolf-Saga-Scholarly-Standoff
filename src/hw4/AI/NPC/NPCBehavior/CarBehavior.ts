import AI from "../../../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Receiver from "../../../../Wolfie2D/Events/Receiver";
import GameNode from "../../../../Wolfie2D/Nodes/GameNode";
import Graphic from "../../../../Wolfie2D/Nodes/Graphic";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import { CarEvent } from "../../../Events";

export const CarAnimations = {
    RIGHT: "RIGHT",
    LEFT: "LEFT"
} as const;

export default class CarBehavior implements AI {
    private owner: AnimatedSprite;
    private speed: number;
    private direction: Vec2;
    private receiver: Receiver;

    initializeAI(owner: AnimatedSprite, options: Record<string, any>): void {
        this.owner = owner;
        this.receiver = new Receiver();
        this.receiver.subscribe(CarEvent.PLAYER_CAR_COLLISION);
        this.receiver.subscribe(CarEvent.OUT_OF_BOUNDS);
        this.activate(options);

    }
    destroy(): void {
        this.receiver.destroy();
    }
    activate(options: Record<string, any>): void {
        this.speed = options.speed;
        this.direction = options.direction;
        if (this.direction.x > 0) {
            this.owner.animation.play(CarAnimations.RIGHT, true);
        } else {
            this.owner.animation.play(CarAnimations.LEFT, true);
        }
    }
    handleEvent(event: GameEvent): void {
        switch (event.type) {
            case CarEvent.PLAYER_CAR_COLLISION: {
                this.handlePlayerCarCollision(event);
                break;
            }
            case CarEvent.OUT_OF_BOUNDS: {
                this.handleOutOfBounds(event);
                break;
            }
            default: {
                throw new Error("Unhandled event in CarBehavior. Event type: " + event.type);
            }
        }
    }
    handleOutOfBounds(event: GameEvent) {
        let id = event.data.get("id");
        if (id === this.owner.id) {
            this.owner.position.copy(Vec2.ZERO);
            this.owner.visible = false;
        }
    }
    handlePlayerCarCollision(event: GameEvent) {
        // Do nothing
    }
    update(deltaT: number): void {
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
    }
}