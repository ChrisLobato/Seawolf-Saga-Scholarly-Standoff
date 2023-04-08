import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import { PlayerAnimationType, PlayerStateType } from "./PlayerState";
import PlayerState from "./PlayerState";
import {  PlayerEvent } from "../../../Events"

export default class Idle extends PlayerState {

    public override onEnter(options: Record<string, any>): void {

    }

    public override handleInput(event: GameEvent): void {
        switch(event.type) {
            default: {
                super.handleInput(event);
                break;
            }
        }
    }

    public override update(deltaT: number): void {
        super.update(deltaT);
        if (!this.parent.controller.moveDir.equals(Vec2.ZERO)) {
            this.finished(PlayerStateType.MOVING);
        }
        else if (this.parent.controller.attacking) {
            this.finished(PlayerStateType.ATTACKING);
        }
        else if (this.parent.controller.dodging) {
            this.finished(PlayerStateType.DODGING);
        }
    }

    public override onExit(): Record<string, any> { 
        return {}; 
    }
    
}