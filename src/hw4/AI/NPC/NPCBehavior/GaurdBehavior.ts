import NPCActor from "../../../Actors/NPCActor";
import NPCBehavior from "../NPCBehavior";
import Idle from "../NPCActions/GotoAction";
import Attacking from "../NPCActions/Attack";

import ShootLaserGun from "../NPCActions/ShootLaserGun";
import BasicFinder from "../../../GameSystems/Searching/BasicFinder";
import { BattlerActiveFilter, EnemyFilter, ItemFilter, RangeFilter, VisibleItemFilter } from "../../../GameSystems/Searching/HW4Filters";
import Item from "../../../GameSystems/ItemSystem/Item";
import PickupItem from "../NPCActions/PickupItem";
import { ClosestPositioned } from "../../../GameSystems/Searching/HW4Reducers";
import { TargetableEntity } from "../../../GameSystems/Targeting/TargetableEntity";
import LaserGun from "../../../GameSystems/ItemSystem/Items/LaserGun";
import { TargetExists } from "../NPCStatuses/TargetExists";
import { HasItem } from "../NPCStatuses/HasItem";
import FalseStatus from "../NPCStatuses/FalseStatus";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import GoapAction from "../../../../Wolfie2D/AI/Goap/GoapAction";
import GoapState from "../../../../Wolfie2D/AI/Goap/GoapState";
import Battler from "../../../GameSystems/BattleSystem/Battler";
import { InRange } from "../NPCStatuses/InRange";
import { PlayerAlive } from "../NPCStatuses/PlayerAlive";
import { isDead } from "../NPCStatuses/isDead";



export default class GuardBehavior extends NPCBehavior {

    /** The target the guard should guard */
    protected target: TargetableEntity;
    /** The range the guard should be from the target they're guarding to be considered guarding the target */
    protected range: number;

    protected time: number;

    protected isPlayerAlive: boolean;

    /** Initialize the NPC AI */
    public initializeAI(owner: NPCActor, options: GuardOptions): void {
        super.initializeAI(owner, options);

        // Initialize the targetable entity the guard should try to protect and the range to the target
        this.target = options.target
        this.range = options.range;
        this.time = options.time;

        // Initialize guard statuses
        this.initializeStatuses();
        // Initialize guard actions
        this.initializeActions();
        // Set the guards goal
        this.goal = GuardStatuses.GOAL;

        // Initialize the guard behavior
        this.initialize();
    }

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            default: {
                super.handleEvent(event);
                break;
            }
        }
    }

    public update(deltaT: number): void {
        super.update(deltaT);
    }

    protected initializeStatuses(): void {

        let scene = this.owner.getScene();
        
        // A status checking if there are any enemies at target the guard is guarding
        //let enemyBattlerFinder = new BasicFinder<Battler>(null, BattlerActiveFilter(), EnemyFilter(this.owner), RangeFilter(this.target, 0, this.range*this.range))
        //let enemyAtGuardPosition = new TargetExists(scene.getBattlers(), enemyBattlerFinder)
        //this.addStatus(GuardStatuses.ENEMY_IN_GUARD_POSITION, enemyAtGuardPosition);

        // Add a status to check if a lasergun exists in the scene and it's visible
        //this.addStatus(GuardStatuses.LASERGUN_EXISTS, new TargetExists(scene.getLaserGuns(), new BasicFinder<Item>(null, ItemFilter(LaserGun), VisibleItemFilter())));
        // Add a status to check if the guard has a lasergun
        //this.addStatus(GuardStatuses.HAS_WEAPON, new HasItem(this.owner, new BasicFinder(null, ItemFilter(LaserGun))));

        // Add the goal status 
        this.addStatus(GuardStatuses.GOAL, new FalseStatus());

        // attack
        this.addStatus(GuardStatuses.IN_RANGE, new InRange(this.owner, this.target));
        // Check if player and self are alive
        this.addStatus(GuardStatuses.PLAYER_ALIVE, new PlayerAlive(this.owner, this.target));
        // Check if alive
        this.addStatus(GuardStatuses.IS_DEAD, new isDead(this.owner, this.target));
    }

    protected initializeActions(): void {

        let scene = this.owner.getScene();

        // An action for guarding the guard's guard location
        let guard = new Idle(this, this.owner);
        guard.targets = [this.target];
        guard.targetFinder = new BasicFinder();
        // guard.addPrecondition(GuardStatuses.HAS_WEAPON);
        guard.addPrecondition(GuardStatuses.PLAYER_ALIVE);
        guard.addEffect(GuardStatuses.GOAL);
        guard.addEffect(GuardStatuses.IN_RANGE);
        guard.cost = 1000;
        this.addState(GuardActions.GUARD, guard);

        let attack = new Attacking(this, this.owner, this.time);
        attack.targets = [this.owner];
        attack.targetFinder = new BasicFinder();
        attack.addPrecondition(GuardStatuses.PLAYER_ALIVE);
        attack.addPrecondition(GuardStatuses.IN_RANGE);
        attack.addEffect(GuardStatuses.GOAL);
        attack.cost = 200;
        this.addState(GuardActions.ATTACK, attack);

        // An action for guarding the guard's guard location
        let stallLose = new Idle(this, this.owner);
        stallLose.targets = [this.owner];
        stallLose.targetFinder = new BasicFinder();
        // guard.addPrecondition(GuardStatuses.HAS_WEAPON);
        stallLose.addPrecondition(GuardStatuses.IS_DEAD);
        stallLose.addEffect(GuardStatuses.GOAL);
        stallLose.cost = 1;
        this.addState(GuardActions.STALL, stallLose);

        let stallWin = new Idle(this, this.owner);
        stallWin.targets = [this.owner];
        stallWin.targetFinder = new BasicFinder();
        // guard.addPrecondition(GuardStatuses.HAS_WEAPON);
        stallWin.addEffect(GuardStatuses.GOAL);
        stallWin.cost = 1000000;
        this.addState(GuardActions.STALL2, stallWin);
    }

    public override addState(stateName: GuardAction, state: GoapAction): void {
        super.addState(stateName, state);
    }

    public override addStatus(statusName: GuardStatus, status: GoapState): void {
        super.addStatus(statusName, status);
    }
}

export interface GuardOptions {
    target: TargetableEntity
    range: number;
    time: number;
}

export type GuardStatus = typeof GuardStatuses[keyof typeof GuardStatuses];
export const GuardStatuses = {

    ENEMY_IN_GUARD_POSITION: "enemy-at-guard-position",

    HAS_WEAPON: "has-weapon",

    LASERGUN_EXISTS: "laser-gun-exists",

    GOAL: "goal",

    IN_RANGE: "in-range",

    PLAYER_ALIVE: "player-alive",

    IS_DEAD: "is-dead"

} as const;

export type GuardAction = typeof GuardActions[keyof typeof GuardActions];
export const GuardActions = {

    PICKUP_LASER_GUN: "pickup-lasergun",

    SHOOT_ENEMY: "shoot-enemy",

    GUARD: "guard",

    ATTACK: "attack",

    STALL: "stall",

    STALL2: "stall-2"

} as const;

