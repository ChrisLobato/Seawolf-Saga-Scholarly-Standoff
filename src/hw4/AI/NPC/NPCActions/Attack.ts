import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import NPCActor from "../../../Actors/NPCActor";
import { BossEvent } from "../../../Events";
import { TargetableEntity } from "../../../GameSystems/Targeting/TargetableEntity";
import NPCBehavior from "../NPCBehavior";
import NPCAction from "./NPCAction";

/**
 * An Idle action for the NPCGoapAI. Basically a default action for all of the NPCs
 * to do nothing.
 */
export default class Attack extends NPCAction {

    private isAttacking: boolean;
    private attackTimer: Timer;

    public constructor(parent: NPCBehavior, actor: NPCActor) {
        super(parent, actor);
        this.isAttacking = false;
      
        this.attackTimer = new Timer(2000, this.attackOver);
        this.attackTimer = new Timer(2000, this.attackOver);
        
    }    
    
    public performAction(target: TargetableEntity): void {
        if(!this.isAttacking){
            console.log("ATTACKING");
            this.isAttacking = true;
            this.emitter.fireEvent(BossEvent.BOSS_ATTACKED, {position: this.actor.position});
            this.attackTimer.start();
        }

    }

    private attackOver = () => {
        this.emitter.fireEvent(BossEvent.BOSS_ATTACK_OVER);
        this.isAttacking = false;
        this.finished();
    }

    public handleInput(event: GameEvent): void {
        switch(event.type) {
            default: {
                super.handleInput(event);
                break;
            }
        }
    }
    
}