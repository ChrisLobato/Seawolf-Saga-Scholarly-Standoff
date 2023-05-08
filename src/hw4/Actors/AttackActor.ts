import Spritesheet from "../../Wolfie2D/DataTypes/Spritesheet";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite"
import NavigationPath from "../../Wolfie2D/Pathfinding/NavigationPath";
import { BattlerEvent, HudEvent } from "../Events";
import Inventory from "../GameSystems/ItemSystem/Inventory";
import HW4Scene from "../Scenes/HW4Scene";
import Battler from "../GameSystems/BattleSystem/Battler";
import { TargetableEntity } from "../GameSystems/Targeting/TargetableEntity";
import { TargetingEntity } from "../GameSystems/Targeting/TargetingEntity";


export default class AttackActor extends AnimatedSprite {

    /** Override the type of the scene to be the HW3 scene */
    protected scene: HW4Scene

    // The key of the Navmesh to use to build paths for this AttackActor
    protected _navkey: string;

    public constructor(sheet: Spritesheet) {
        super(sheet);
        this._navkey = "navkey";
    }

    public override setScene(scene: HW4Scene): void { this.scene = scene; }
    public override getScene(): HW4Scene { return this.scene; }

    public get navkey(): string { return this._navkey; }
    public set navkey(navkey: string) { this._navkey = navkey; }

    getPath(to: Vec2, from: Vec2): NavigationPath { 
        return this.scene.getNavigationManager().getPath(this.navkey, to, from);
    }

}