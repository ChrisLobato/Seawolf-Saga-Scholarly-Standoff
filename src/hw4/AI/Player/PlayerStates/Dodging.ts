import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import { PlayerEvent } from "../../../Events";
import { PlayerStateType } from "./PlayerState";
import PlayerState from "./PlayerState";

export default class Dodging extends PlayerState {
    
    public override onEnter(options: Record<string, any>): void {
        this.emitter.fireEvent(PlayerEvent.PLAYER_DODGED, {owner: this.parent.owner});
    }

    public override handleInput(event: GameEvent): void { 
        switch(event.type) {
            default: {
                super.handleInput(event);
            }
        }
    }

    public override update(deltaT: number): void {
        super.update(deltaT);
        // when the dodge is done
        if (this.parent.controller.moveDir.equals(Vec2.ZERO)) {
            this.finished(PlayerStateType.IDLE);
        }
        else{
            this.finished(PlayerStateType.MOVING);
        }
    }

    public override onExit(): Record<string, any> { return {}; }
}