import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import { PlayerStateType } from "./PlayerState";
import PlayerState from "./PlayerState";
import {  PlayerEvent } from "../../../Events"

export default class Moving extends PlayerState {
    
    public override onEnter(options: Record<string, any>): void {
        
    }

    public override handleInput(event: GameEvent): void { 
        switch(event.type) {
            default: {
                console.log("event type:", event.type);
                super.handleInput(event);
            }
        }
    }

    public override update(deltaT: number): void {
        super.update(deltaT);
        if (this.parent.controller.moveDir.equals(Vec2.ZERO)) {
            this.finished(PlayerStateType.IDLE);
        }
        else if (this.parent.controller.attacking) {
            this.finished(PlayerStateType.ATTACKING);
        }
        else if (this.parent.controller.heavyAttacking) {
            this.finished(PlayerStateType.HEAVY_ATTACKING);
        }
        else if (this.parent.controller.dodging) {
            this.finished(PlayerStateType.DODGING);
        }
    }

    public override onExit(): Record<string, any> { return {}; }
}