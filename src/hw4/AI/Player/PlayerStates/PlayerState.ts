import State from "../../../../Wolfie2D/DataTypes/State/State";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import { BattlerEvent, HudEvent, ItemEvent, PlayerEvent } from "../../../Events"
import Item from "../../../GameSystems/ItemSystem/Item";
import PlayerAI from "../PlayerAI";

export enum PlayerAnimationType {
    IDLE_DOWN = "IDLE_DOWN",
    IDLE_UP = "IDLE_UP",
    IDLE_LEFT = "IDLE_LEFT",
    IDLE_RIGHT = "IDLE_RIGHT",
    WALK_DOWN = "WALK_DOWN",
    WALK_UP = "WALK_UP",
    WALK_LEFT = "WALK_LEFT",
    WALK_RIGHT = "WALK_RIGHT",
    ATTACK_DOWN = "ATTACK_DOWN",
    ATTACK_UP = "ATTACK_UP",
    ATTACK_LEFT = "ATTACK_LEFT",
    ATTACK_RIGHT = "ATTACK_RIGHT",
    DODGE = "DODGE"
}


export enum PlayerStateType {
    IDLE = "IDLE",
    INVINCIBLE = "INVINCIBLE",
    ATTACKING = "ATTACKING",
    HEAVY_ATTACKING = "HEAVY_ATTACKING",
    MOVING = "MOVING",
    DEAD = "DEAD",
    DODGING = "DODGING"
}

export default abstract class PlayerState extends State {

    protected parent: PlayerAI;
    protected owner: PlayerActor;
    protected receiver: Receiver;

    protected dodgeCharges: number;
    protected attackFlag: boolean;
    private dodgedTimer: Timer;

    public constructor(parent: PlayerAI, owner: PlayerActor) {
        super(parent);
        this.owner = owner;
        this.dodgeCharges = 4;
        this.receiver = new Receiver(); //might need to initialize an emitter as well
        this.receiver.subscribe(PlayerEvent.PLAYER_ATTACKED);
        this.receiver.subscribe(PlayerEvent.ATTACK_OVER);
        this.receiver.subscribe(PlayerEvent.PLAYER_DODGED);
        this.receiver.subscribe(PlayerEvent.DODGE_OVER);
        this.attackFlag = false;
        this.dodgedTimer = new Timer(2500, this.handleDodgeTimerEnd,false);
    }

    public override onEnter(options: Record<string, any>): void {}
    public override onExit(): Record<string, any> { return {}; }
    public override update(deltaT: number): void {
        
        while (this.receiver.hasNextEvent()) {
            this.handleInput(this.receiver.getNextEvent());
        }
        // Adjust the angle the player is facing 
        //this.parent.owner.rotation = this.parent.controller.rotation;
        if (( !(this.owner.animation.isPlaying("DODGE_START") || this.owner.animation.isPlaying("DODGE_END") ) 
        && !this.owner.animation.isPlaying("DEAD"))){
            if(this.parent.controller.rotation === 0) { 
                if (this.attackFlag){
                    this.owner.animation.play("ATTACK_UP");
                } else {
                    this.owner.animation.play("UP"); // UP
                }
            }
            else if(this.parent.controller.rotation === Math.PI ){ 
                if (this.attackFlag){
                    this.owner.animation.play("ATTACK_DOWN");
                } else {
                    this.owner.animation.play("DOWN"); // DOWN
                }
            }
            else if(this.parent.controller.rotation === Math.PI/2 ){
                if (this.attackFlag){
                    this.owner.animation.play("ATTACK_LEFT");
                } else {
                    this.owner.animation.play("LEFT"); // LEFT
                }
            }
            else {
                if (this.attackFlag){
                    this.owner.animation.play("ATTACK_RIGHT");
                } else {
                    this.owner.animation.play("RIGHT"); // RIGHT
                }
            }
    }

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

        if(this.parent.controller.dodging && this.dodgeCharges >= 1){
            // subtract a dodge charge
            //this.owner.animation.play("DODGE_START", false, PlayerEvent.DODGE_OVER);
            //console.log("Dodge Start");
            this.dodgeCharges = this.dodgeCharges - 1;

            let vec: Vec2 = Vec2.ZERO;
            vec = this.owner.position.vecTo(Input.getGlobalMousePosition());
            // limitting the range
            const limitter =  50;
            if(vec.x > limitter)
                vec.x = limitter;
            else if(vec.x < -limitter)
                vec.x = -limitter;
            if(vec.y > limitter)
                vec.y = limitter;
            else if(vec.y < -limitter)
                vec.y = -limitter;
            this.parent.owner.move(vec);
            this.emitter.fireEvent(PlayerEvent.DODGE_CHANGE, {curchrg: this.dodgeCharges,maxchrg: 4});
            this.handleDodged();
            
        }

    }

    public override handleInput(event: GameEvent): void {
        
        switch(event.type) {
            case PlayerEvent.PLAYER_DODGED: {
                // this.handleDodged();
                break;
            }
            case PlayerEvent.DODGE_OVER: {
                //this.owner.animation.play("DODGE_END");
                //console.log("Dodge Over");
                break;
            }
            case PlayerEvent.PLAYER_ATTACKED: {
                this.attackFlag = true;
                break;
            }
            case PlayerEvent.ATTACK_OVER: {
                this.attackFlag = false;
                break;
            }
            default: {
                throw new Error(`Unhandled event of type ${event.type} caught in PlayerState!`);
            }
        }
    }

    protected handleDodged(){
        this.dodgedTimer.reset();
        this.dodgedTimer.start();
    }
    protected handleDodgeTimerEnd =()=>{
        this.dodgeCharges = MathUtils.clamp(this.dodgeCharges + 1, 0, 4);
        //this.emitter =new Emitter();
        this.emitter.fireEvent(PlayerEvent.DODGE_CHANGE, {curchrg: this.dodgeCharges,maxchrg: 4});
        if (this.dodgeCharges <4){
            this.dodgedTimer.start();
        }
    }

}

import Idle from "./Idle";
import Invincible from "./Invincible";
import Moving from "./Moving";
import Attacking from "./Attacking";
import HeavyAttacking from "./HeavyAttacking"
import Dodging from "./Dodging";
import Dead from "./Dead";
import PlayerActor from "../../../Actors/PlayerActor";
import Receiver from "../../../../Wolfie2D/Events/Receiver";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import Input from "../../../../Wolfie2D/Input/Input";
import MathUtils from "../../../../Wolfie2D/Utils/MathUtils";
import Timer from "../../../../Wolfie2D/Timing/Timer";
export { Idle, Invincible, Moving, Attacking, HeavyAttacking, Dodging, Dead} 