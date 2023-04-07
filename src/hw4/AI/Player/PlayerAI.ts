import StateMachineAI from "../../../Wolfie2D/AI/StateMachineAI";
import AI from "../../../Wolfie2D/DataTypes/Interfaces/AI";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import Input from "../../../Wolfie2D/Input/Input";
import PlayerActor from "../../Actors/PlayerActor";
import { ItemEvent, PlayerEvent } from "../../Events";
import Inventory from "../../GameSystems/ItemSystem/Inventory";
import Item from "../../GameSystems/ItemSystem/Item";
import PlayerController from "./PlayerController";
import { Idle, Invincible, Moving, Attacking, Dodging, Dead, PlayerStateType } from "./PlayerStates/PlayerState";

/**
 * The AI that controls the player. The players AI has been configured as a Finite State Machine (FSM)
 * with 4 states; Idle, Moving, Invincible, and Dead.
 */
export default class PlayerAI extends StateMachineAI implements AI {

    /** The GameNode that owns this AI */
    public owner: PlayerActor;
    /** A set of controls for the player */
    public controller: PlayerController;
    /** The inventory object associated with the player */
    public inventory: Inventory;
    /** The players held item */
    public item: Item | null;
    
    public initializeAI(owner: PlayerActor, opts: Record<string, any>): void {
        this.owner = owner;
        this.controller = new PlayerController(owner);

        // Add the players states to it's StateMachine
        this.addState(PlayerStateType.IDLE, new Idle(this, this.owner));
        this.addState(PlayerStateType.INVINCIBLE, new Invincible(this, this.owner));
        this.addState(PlayerStateType.MOVING, new Moving(this, this.owner));
        this.addState(PlayerStateType.ATTACKING, new Attacking(this, this.owner));
        this.addState(PlayerStateType.DODGING, new Dodging(this, this.owner));
        this.addState(PlayerStateType.DEAD, new Dead(this, this.owner));

        this.receiver.subscribe(PlayerEvent.PLAYER_DODGED);
        this.receiver.subscribe(PlayerEvent.PLAYER_ATTACKED);
        
        // Initialize the players state to Idle
        this.initialize(PlayerStateType.IDLE);
    }

    public activate(options: Record<string, any>): void { }

    public update(deltaT: number): void {
        super.update(deltaT);
    }

    public destroy(): void {}

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            case ItemEvent.LASERGUN_FIRED: {
                this.handleLaserFiredEvent(event.data.get("actorId"), event.data.get("to"), event.data.get("from"));
                break;
            }
            case PlayerEvent.PLAYER_DODGED: {
                this.handleDodge();
                break;
            }
            case PlayerEvent.PLAYER_ATTACKED: {
                this.handleAttack();
                break;
            }
            default: {
                super.handleEvent(event);
                break;
            }
        }
    }

    protected handleLaserFiredEvent(actorId: number, to: Vec2, from: Vec2): void {
        if (this.owner.id !== actorId && this.owner.collisionShape !== undefined ) {
            if (this.owner.collisionShape.getBoundingRect().intersectSegment(to, from.clone().sub(to)) !== null) {
                this.owner.health -= 1;
            }
        }
    }

    protected handleDodge(): void {
        console.log("DODGE");
        // let dir: Vec2 = Vec2.ZERO;
        // BUGGY REVISIT WHY IS THIS NOT WORKING HERE???
        // Instead I implemented it in playerState. I checked the id's of the owner
        // and they are the same, and their inventories seem the same, idk.
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
        this.owner.move(vec);
    }

    protected handleAttack(): void {
        console.log("ATTACK");
    }
    
}