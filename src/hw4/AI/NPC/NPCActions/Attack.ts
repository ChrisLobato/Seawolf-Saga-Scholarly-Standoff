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

    public constructor(parent: NPCBehavior, actor: NPCActor, time: number) {
        super(parent, actor);
        this.isAttacking = false;
        
        // REVISIT, change as you will, make sure the bridge/bossattackdelay timer
        // is never shorter than this timer is, will cause unexpected behavior
        this.attackTimer = new Timer(time, this.attackOver);
        
    }    
    
    public performAction(target: TargetableEntity): void {
        if(!this.isAttacking){
            console.log("BOSS #", this.actor.id, "ATTACKING");
            this.isAttacking = true;
            this.actor.animation.playIfNotAlready("ATTACK_DOWN");
            this.emitter.fireEvent(BossEvent.BOSS_ATTACKED, {actor: this.actor, id: this.actor.id});
            this.attackTimer.start();
        }

    }

    private attackOver = () => {
        this.emitter.fireEvent(BossEvent.BOSS_ATTACK_OVER);
        this.isAttacking = false;
        this.actor.animation.playIfNotAlready("DOWN");
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