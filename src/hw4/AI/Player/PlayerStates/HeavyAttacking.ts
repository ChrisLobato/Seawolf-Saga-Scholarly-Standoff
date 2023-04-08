import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import { PlayerEvent } from "../../../Events";
import { PlayerStateType } from "./PlayerState";
import PlayerState from "./PlayerState";

export default class HeavyAttacking extends PlayerState {

    private attackTimer: Timer;
    
    public override onEnter(options: Record<string, any>): void {
        console.log("heavy");
        this.emitter.fireEvent(PlayerEvent.PLAYER_ATTACKED, {player: this.parent.owner, controller: this.parent.controller,
        type: "heavy"});
        // REVISIT set the timer to match the length of the animation
        this.attackTimer = new Timer(1250, this.attackOver);
        this.attackTimer.start();
    }

    public override handleInput(event: GameEvent): void { 
        switch(event.type) {
            default: {
                super.handleInput(event);
            }
        }
    }

    private attackOver = () => {
        this.emitter.fireEvent(PlayerEvent.ATTACK_OVER);
    }

    public override update(deltaT: number): void {
        super.update(deltaT);
        // when the timer runs out:
        if(this.attackTimer.hasRun() && this.attackTimer.isStopped()){
            if (this.parent.controller.moveDir.equals(Vec2.ZERO)) {
                this.finished(PlayerStateType.IDLE);
            }
            else{
                this.finished(PlayerStateType.MOVING);
            }
        }
    }

    public override onExit(): Record<string, any> { return {}; }
}