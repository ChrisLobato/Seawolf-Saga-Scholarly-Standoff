import GoapState from "../../../../Wolfie2D/AI/Goap/GoapState";
import AnimatedSprite from "../../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import MathUtils from "../../../../Wolfie2D/Utils/MathUtils";
import NPCActor from "../../../Actors/NPCActor";
import { TargetableEntity } from "../../../GameSystems/Targeting/TargetableEntity";

export class isDead extends GoapState {


    protected actor: NPCActor;

    public constructor(actor: NPCActor, target: TargetableEntity) {
        super()
        this.actor = actor;
    }

    public isSatisfied(): boolean {
        return this.actor.isDead;
    }
    
}