import GoapState from "../../../../Wolfie2D/AI/Goap/GoapState";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import MathUtils from "../../../../Wolfie2D/Utils/MathUtils";
import NPCActor from "../../../Actors/NPCActor";
import { TargetableEntity } from "../../../GameSystems/Targeting/TargetableEntity";

export class PlayerAlive extends GoapState {


    protected target: TargetableEntity;
    protected deadZone: Vec2;

    public constructor(actor: NPCActor, target: TargetableEntity) {
        super()
        this.target = target;
        this.deadZone = new Vec2(2000, 2000);
    }

    public isSatisfied(): boolean {
        return this.target.position !== this.deadZone;
    }
    
}