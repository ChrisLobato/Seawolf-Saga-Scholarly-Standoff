import Updateable from "../../../Wolfie2D/DataTypes/Interfaces/Updateable";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Color from "../../../Wolfie2D/Utils/Color";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Positioned from "../../../Wolfie2D/DataTypes/Interfaces/Positioned";
import Unique from "../../../Wolfie2D/DataTypes/Interfaces/Unique";
import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";

interface Health {
    get health(): number;
    get maxHealth(): number;
}

interface HealthBarOptions {
    size: Vec2;
    offset: Vec2;
}

/**
 * A UI component that's suppossed to represent a healthbar
 */
export default class HealthbarHUD implements Updateable {

    /** The scene and layer in the scene the healthbar is in */
    protected scene: Scene;
    protected layer: string;

    /** The GameNode that owns this healthbar */
    protected owner: Health & Positioned & Unique;

    protected HealthIcons: Array<Sprite>;

    public constructor(scene: Scene, owner: Health & Positioned & Unique, layer: string,icons: Array<Sprite>) {
        this.scene = scene;
        this.layer = layer;
        this.owner = owner;
        this.HealthIcons = icons;
        // this.load.image("healthIcon", "hw4_assets/sprites/WolfieHealth.png"); might need this

    }

    /**
     * Updates the healthbars position according to the position of it's owner
     * @param deltaT 
     */
    public update(deltaT: number): void {


        
        for(let i = this.owner.health; i < this.HealthIcons.length; i++ ){
            this.HealthIcons[i].visible = false;
        }
        for(let i = 0; i < this.owner.health && i<this.HealthIcons.length;i++){
            this.HealthIcons[i].visible = true;
        }
    }

    get ownerId(): number { return this.owner.id; }

    // set visible(visible: boolean) {
    //     this.healthBar.visible = visible;
    //     this.healthBarBg.visible = visible;
    // }
    

}