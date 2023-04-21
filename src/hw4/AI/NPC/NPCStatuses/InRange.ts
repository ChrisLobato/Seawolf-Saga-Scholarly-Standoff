import GoapState from "../../../../Wolfie2D/AI/Goap/GoapState";
import MathUtils from "../../../../Wolfie2D/Utils/MathUtils";
import NPCActor from "../../../Actors/NPCActor";
import { TargetableEntity } from "../../../GameSystems/Targeting/TargetableEntity";

export class InRange extends GoapState {

    protected actor: NPCActor;
    protected target: TargetableEntity;

    public constructor(actor: NPCActor, target: TargetableEntity) {
        super()
        this.actor = actor;
        this.target = target;
    }

    public isSatisfied(): boolean {
        return this.target.position.distanceTo(this.actor.position) < 50;
    }
    
}