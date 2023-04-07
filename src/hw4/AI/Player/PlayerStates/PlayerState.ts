import State from "../../../../Wolfie2D/DataTypes/State/State";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import { BattlerEvent, HudEvent, ItemEvent, PlayerEvent } from "../../../Events"
import Item from "../../../GameSystems/ItemSystem/Item";
import PlayerAI from "../PlayerAI";

export enum PlayerAnimationType {
    IDLE = "IDLE"
}


export enum PlayerStateType {
    IDLE = "IDLE",
    INVINCIBLE = "INVINCIBLE",
    ATTACKING = "ATTACKING",
    MOVING = "MOVING",
    DEAD = "DEAD",
    DODGING = "DODGING"
}

export default abstract class PlayerState extends State {

    protected parent: PlayerAI;
    protected owner: PlayerActor;
    protected receiver: Receiver;

    public constructor(parent: PlayerAI, owner: PlayerActor) {
        super(parent);
        this.owner = owner;
        // this.receiver = new Receiver();
        // this.receiver.subscribe(PlayerEvent.PLAYER_DODGED);
    }

    public override onEnter(options: Record<string, any>): void {}
    public override onExit(): Record<string, any> { return {}; }
    public override update(deltaT: number): void {

        //while (this.receiver.hasNextEvent()) {
        //    this.handleInput(this.receiver.getNextEvent());
        //}

        // Adjust the angle the player is facing 
        this.parent.owner.rotation = this.parent.controller.rotation;
        // Move the player
        this.parent.owner.move(this.parent.controller.moveDir);

        // Handle the player trying to pick up an item
        if (this.parent.controller.pickingUp) {
            // Request an item from the scene
            this.emitter.fireEvent(ItemEvent.ITEM_REQUEST, {node: this.owner, inventory: this.owner.inventory});
        }

        // Handle the player trying to drop an item
        if (this.parent.controller.dropping) {
            
        }

        if (this.parent.controller.useItem) {

        }

        if(this.parent.controller.dodging){
            let vec: Vec2 = Vec2.ZERO;
            vec = this.owner.position.vecTo(Input.getGlobalMousePosition());
            // limitting the range
            const limitter =  150;
            if(vec.x > limitter)
                vec.x = limitter;
            else if(vec.x < -limitter)
                vec.x = -limitter;
            if(vec.y > limitter)
                vec.y = limitter;
            else if(vec.y < -limitter)
                vec.y = -limitter;
            this.parent.owner.move(vec);
        }

    }

    public override handleInput(event: GameEvent): void {
        switch(event.type) {
            default: {
                throw new Error(`Unhandled event of type ${event.type} caught in PlayerState!`);
            }
        }
    }

}

import Idle from "./Idle";
import Invincible from "./Invincible";
import Moving from "./Moving";
import Attacking from "./Attacking";
import Dodging from "./Dodging";
import Dead from "./Dead";
import PlayerActor from "../../../Actors/PlayerActor";
import Receiver from "../../../../Wolfie2D/Events/Receiver";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import Input from "../../../../Wolfie2D/Input/Input";
export { Idle, Invincible, Moving, Attacking, Dodging, Dead} 