import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Input from "../../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Emitter from "../../../Wolfie2D/Events/Emitter";
import { PlayerEvent } from "../../Events";
import Timer from "../../../Wolfie2D/Timing/Timer";

/**
 * Strings used in the key binding for the player
 */

export enum PlayerInput {
    MOVE_UP = "MOVE_UP",
    MOVE_DOWN = "MOVE_DOWN",
    MOVE_LEFT = "MOVE_LEFT",
    MOVE_RIGHT = "MOVE_RIGHT",
    DODGING = "DODGING",
    PICKUP_ITEM = "PICKUP_ITEM",
    DROP_ITEM = "DROP_ITEM",
    CHEAT_ADVANCE_LEVEL = "CHEAT_ADVANCE_LEVEL",
    CHEAT_GOD_MODE = "CHEAT_GOD_MODE",
    PAUSE_MENU = "PAUSE_MENU",
}

/**
 * The PlayerController class handles processing the input recieved from the user and exposes  
 * a set of methods to make dealing with the user input a bit simpler.
 */
export default class PlayerController {

    /** The GameNode that owns the AI */
    protected owner: AnimatedSprite;
    protected emitter: Emitter;
    protected cheatTimer: Timer;

    constructor(owner: AnimatedSprite) {
        this.owner = owner;
        this.emitter = new Emitter();
        this.cheatTimer = new Timer(500);
    }

    /**
     * Gets the direction the player should move based on input from the keyboard. 
     * @returns a Vec2 indicating the direction the player should move. 
     */
    public get moveDir(): Vec2 { 
        let dir: Vec2 = Vec2.ZERO;
        let isAlive = !this.owner.animation.isPlaying("DEAD");
        dir.y = (Input.isPressed(PlayerInput.MOVE_UP) && isAlive ? -1 : 0) + 
            (Input.isPressed(PlayerInput.MOVE_DOWN) && isAlive ? 1 : 0);
		dir.x = (Input.isPressed(PlayerInput.MOVE_LEFT) && isAlive ? -1 : 0) +
             (Input.isPressed(PlayerInput.MOVE_RIGHT) && isAlive ? 1 : 0);
        //Cheat handling
        if (Input.isPressed(PlayerInput.CHEAT_ADVANCE_LEVEL) && this.cheatTimer.isStopped()){
            this.cheatTimer.start();
            this.emitter.fireEvent(PlayerEvent.CHEAT_ADVANCE_LEVEL);
        }
        if (Input.isPressed(PlayerInput.CHEAT_GOD_MODE) && this.cheatTimer.isStopped()){
            this.cheatTimer.start();
            this.emitter.fireEvent(PlayerEvent.CHEAT_GOD_MODE);
            
        }
        return dir.normalize();
    }

    /** 
     * Gets the direction the player should be facing based on the position of the
     * mouse around the player
     * @return a Vec2 representing the direction the player should face.
     */
    public get faceDir(): Vec2 { return this.owner.position.dirTo(Input.getGlobalMousePosition()); }

    /**
     * Gets the rotation of the players sprite based on the direction the player
     * should be facing.
     * @return a number representing how much the player should be rotated
     */
    public get rotation(): number {
        //REVIST

        let dir = this.faceDir;

        // going vertically or horizontally
        let vertical = Math.abs(dir.y);
        let horizontal = Math.abs(dir.x);

        if(vertical > horizontal){
            // going up or down
            if(dir.y < 0) {
                return 0;
            }
            else {
                return Math.PI;
            }

        }
        else {
            // going left or right 
            if(dir.x < 0) {
                return Math.PI/2;
            }
            else {
                return 3*Math.PI/2;
            }
        }
    }

    /** 
     * Checks if the player is attempting to use a held item or not.
     * @return true if the player is attempting to use a held item; false otherwise
     */
    public get useItem(): boolean { return Input.isMouseJustPressed(); }

    /** 
     * Checks if the player is attempting to pick up an item or not.
     * @return true if the player is attempting to pick up an item; false otherwise.
     */
    public get pickingUp(): boolean { return Input.isJustPressed(PlayerInput.PICKUP_ITEM); }

    /** 
     * Checks if the player is attempting to drop their held item or not.
     * @return true if the player is attempting to drop their held item; false otherwise.
     */
    public get dropping(): boolean { return Input.isJustPressed(PlayerInput.DROP_ITEM); }

    public get attacking(): boolean { return Input.isMouseJustPressed(0); }
    
    public get heavyAttacking(): boolean { return Input.isMouseJustPressed(2); }

    public get dodging(): boolean { return Input.isJustPressed(PlayerInput.DODGING) && !this.owner.animation.isPlaying("DEAD"); }

    public get pausing(): boolean { return Input.isPressed(PlayerInput.PAUSE_MENU);}
}