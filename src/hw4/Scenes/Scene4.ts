import PositionGraph from "../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import Actor from "../../Wolfie2D/DataTypes/Interfaces/Actor";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Line from "../../Wolfie2D/Nodes/Graphics/Line";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Navmesh from "../../Wolfie2D/Pathfinding/Navmesh";
import DirectStrategy from "../../Wolfie2D/Pathfinding/Strategies/DirectStrategy";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import Timer from "../../Wolfie2D/Timing/Timer";
import Color from "../../Wolfie2D/Utils/Color";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import NPCActor from "../Actors/NPCActor";
import PlayerActor from "../Actors/PlayerActor";
import GuardBehavior from "../AI/NPC/NPCBehavior/GaurdBehavior";
import HealerBehavior from "../AI/NPC/NPCBehavior/HealerBehavior";
import PlayerAI from "../AI/Player/PlayerAI";
import PlayerController from "../AI/Player/PlayerController";
import { ItemEvent, PlayerEvent, BattlerEvent, BossEvent, SceneEvents } from "../Events";
import Battler from "../GameSystems/BattleSystem/Battler";
import BattlerBase from "../GameSystems/BattleSystem/BattlerBase";
import HealthbarHUD from "../GameSystems/HUD/HealthbarHUD";
import InventoryHUD from "../GameSystems/HUD/InventoryHUD";
import Inventory from "../GameSystems/ItemSystem/Inventory";
import Item from "../GameSystems/ItemSystem/Item";
import Healthpack from "../GameSystems/ItemSystem/Items/Healthpack";
import LaserGun from "../GameSystems/ItemSystem/Items/LaserGun";
import { ClosestPositioned } from "../GameSystems/Searching/HW4Reducers";
import BasicTargetable from "../GameSystems/Targeting/BasicTargetable";
import Position from "../GameSystems/Targeting/Position";
import AstarStrategy from "../Pathfinding/AstarStrategy";
import HW4Scene from "./HW4Scene";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Emitter from "../../Wolfie2D/Events/Emitter";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import MainMenu from "./MainMenu";
import Scene2 from "./Scene2";
import PlayerHealthHUD from "../GameSystems/HUD/PlayerHealthHUD";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Scene3 from "./Scene3";

const BattlerGroups = {
    RED: 1,
    BLUE: 2
} as const;

export default class MainHW4Scene extends HW4Scene {

    /** GameSystems in the HW3 Scene */
    private inventoryHud: InventoryHUD;

    /** All the battlers in the HW3Scene (including the player) */
    private battlers: (AnimatedSprite & Battler)[];
    public player: AnimatedSprite;
    private boss: AnimatedSprite;
    private idPasser: number;
    
    /** Healthbars for the battlers */
    private healthbars: Map<number, HealthbarHUD>;


    private bases: BattlerBase[];
    private HealthIcons: Array<Sprite>;
    private DodgeIcons: Array<Sprite>;
    private currentDodge = 3;
    private PlayerHealthBar: PlayerHealthHUD;

    private healthpacks: Array<Healthpack>;
    private laserguns: Array<LaserGun>;

    // The wall layer of the tilemap
    private walls: OrthogonalTilemap;

    // The position graph for the navmesh
    private graph: PositionGraph;

    private attackMarker: Graphic;
    private attackMarker2: Graphic;

    private bossAttackDelayer: Timer;
    private bossPasser: NPCActor;
    private sceneEndWinDelayer: Timer;
    private sceneEndLoseDelayer: Timer;
    private disappearTimer: Timer;

    // Cheat Flags
    private godMode: boolean;
   


    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);

        this.battlers = new Array<AnimatedSprite & Battler>();
        this.healthbars = new Map<number, HealthbarHUD>();

        this.laserguns = new Array<LaserGun>();
        this.healthpacks = new Array<Healthpack>();
        this.godMode = false;
    }

    /**
     * @see Scene.update()
     */
    public override loadScene() {
        // Load the player and enemy spritesheets
        this.load.spritesheet("player1", "hw4_assets/spritesheets/s4_hero.json");

        // Load in the enemy sprites
        this.load.spritesheet("boss", "hw4_assets/spritesheets/s4_boss_v2.json");

        // Load the tilemap
        this.load.tilemap("level", "hw4_assets/tilemaps/boss_map_1.json");

        // Load the enemy locations
        this.load.object("red", "hw4_assets/data/enemies/red.json");
        this.load.object("blue", "hw4_assets/data/enemies/blue.json");

        // Load the healthpack and lasergun loactions
        this.load.object("healthpacks", "hw4_assets/data/items/healthpacks.json");
        this.load.object("laserguns", "hw4_assets/data/items/laserguns.json");

        // Load the healthpack, inventory slot, and laser gun sprites
        this.load.image("healthpack", "hw4_assets/sprites/healthpack.png");
        this.load.image("inventorySlot", "hw4_assets/sprites/inventory.png");
        this.load.image("laserGun", "hw4_assets/sprites/laserGun.png");

        this.load.image("healthIcon", "hw4_assets/sprites/WolfieHealth.png");
        this.load.image("dodgeIcon", "hw4_assets/sprites/DodgeIcon.png");

        // Stop Main Menu Music
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "mainMenuMusic"});

        // Load audio from the audio folder
        this.load.audio("heavyAttack", "hw4_assets/sounds/s4_heavy_attack.wav");
        this.load.audio("lightAttack", "hw4_assets/sounds/s4_light_attack.wav");
        this.load.audio("playerDamaged", "hw4_assets/sounds/s4_player_damaged.wav");
        this.load.audio("bossMusic1", "hw4_assets/sounds/s4_boss_music_1.wav");
        this.load.audio("veryHeavyAttack", "hw4_assets/sounds/s4_very_heavy_attack.wav");

    }
    /**
     * @see Scene.startScene
     */
    public override startScene() {
        // Add in the tilemap
        let tilemapLayers = this.add.tilemap("level");

        // Get the wall layer
        this.walls = <OrthogonalTilemap>tilemapLayers[1].getItems()[0];

        // Set the viewport bounds to the tilemap
        let tilemapSize: Vec2 = this.walls.size;

        this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);
        this.viewport.setZoomLevel(3);

        this.initLayers();
        
        // Create the player
        this.initializePlayer();
        // this.initializeItems();

        this.initializeNavmesh();

        // Create the NPCS
        // this.initializeNPCs();

        // Create the boss
        this.initializeBoss();

        // Subscribe to relevant events
        this.receiver.subscribe("healthpack");
        this.receiver.subscribe("enemyDied");
        this.receiver.subscribe(ItemEvent.ITEM_REQUEST);
        this.receiver.subscribe(PlayerEvent.PLAYER_ATTACKED);
        this.receiver.subscribe(PlayerEvent.ATTACK_OVER);
        this.receiver.subscribe(BossEvent.BOSS_ATTACKED);
        this.receiver.subscribe(BossEvent.BOSS_ATTACK_FIRE);
        this.receiver.subscribe(BossEvent.BOSS_ATTACK_OVER);
        this.receiver.subscribe(PlayerEvent.DODGE_CHANGE);
        this.receiver.subscribe(PlayerEvent.DODGE_OVER);

        this.receiver.subscribe(SceneEvents.END_SCENE_0);
        this.receiver.subscribe(SceneEvents.END_SCENE_1);
        
        // Cheat Events
        this.receiver.subscribe(PlayerEvent.CHEAT_GOD_MODE);
        this.receiver.subscribe(PlayerEvent.CHEAT_ADVANCE_LEVEL);

        // REVISIT, change as you would like, make SURE it never is longer
        // than the timer in the attack.ts action file
        this.bossAttackDelayer = new Timer(1000, this.handleBossAttack);

        this.sceneEndWinDelayer = new Timer(2000, this.sceneEnderWin);
        this.sceneEndLoseDelayer = new Timer(2000, this.sceneEnderLose);
        this.disappearTimer = new Timer(500, this.disappear);

        // Add a UI for health
        this.addUILayer("health");


        this.receiver.subscribe(PlayerEvent.PLAYER_KILLED);
        this.receiver.subscribe(BattlerEvent.BATTLER_KILLED);
        this.receiver.subscribe(BattlerEvent.BATTLER_RESPAWN);

        // Play boss music
        this.emitter.fireEvent(GameEventType.PLAY_MUSIC, {key: "bossMusic1", loop: true, holdReference: true});
    }
    /**
     * @see Scene.updateScene
     */
    public override updateScene(deltaT: number): void {
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
        this.inventoryHud.update(deltaT);
        //This is where we could update the player health bar
        // this.handleHealthChange(player.health,player.maxHealth);
        this.PlayerHealthBar.update(deltaT);
        this.healthbars.forEach(healthbar => healthbar.update(deltaT));
    }

    /**
     * Handle events from the rest of the game
     * @param event a game event
     */
    public handleEvent(event: GameEvent): void {
        switch (event.type) {
            case PlayerEvent.PLAYER_ATTACKED: {
                this.handleAttack(event.data.get("player"), event.data.get("controller"), event.data.get("type"));
                break;
            }
            case PlayerEvent.ATTACK_OVER: {
                this.handleAttackOver();
                break;
            }
            case BossEvent.BOSS_ATTACKED: {
                this.handleBossAttackTimer(event.data.get("actor"));
                break;
            }
            case BossEvent.BOSS_ATTACK_FIRE: {
                this.handleBossAttack();
                break;
            }
            case BossEvent.BOSS_ATTACK_OVER: {
                this.handleBossAttackOver();
                break;
            }
            case PlayerEvent.DODGE_CHANGE: {
                console.log("HERE");
                this.handleDodgeChargeChange(event.data.get("curchrg"),event.data.get("maxchrg"));
                break;
            }
            case PlayerEvent.DODGE_OVER: {
                this.handleDodgeOver();
                break;
            }
            case SceneEvents.END_SCENE_0: {
                this.handleSceneEndLose();
                break;
            }
            case SceneEvents.END_SCENE_1: {
                this.handleSceneEndWin();
                break;
            }

            case BattlerEvent.BATTLER_KILLED: {
                this.handleBattlerKilled(event);
                break;
            }
            case BattlerEvent.BATTLER_RESPAWN: {
                break;
            }
            case ItemEvent.ITEM_REQUEST: {
                this.handleItemRequest(event.data.get("node"), event.data.get("inventory"));
                break;
            }
            case PlayerEvent.CHEAT_GOD_MODE: {
                if (this.godMode) {
                    console.log("God mode disabled");
                }
                else {
                    console.log("God mode enabled");
                }
                this.godMode = !this.godMode;
                break;
            }
            case PlayerEvent.CHEAT_ADVANCE_LEVEL: {
                console.log("Cheat activated: advancing level");
                this.handleSceneEndWin();
                break;
            }

       
            default: {
                throw new Error(`Unhandled event type "${event.type}" caught in SeawolfSaga event handler`);
            }
        }
    }

    protected handleDodgeChargeChange(currentCharge: number, maxCharge:number): void {
        for(let i = currentCharge; i < this.DodgeIcons.length; i++ ){
            this.DodgeIcons[i].visible = false;
        }
        for(let i = 0; i < currentCharge && i<this.DodgeIcons.length;i++){
            this.DodgeIcons[i].visible = true;
        }

    }
    
    protected handleDodgeOver(): void {
        //REVISIT
    }


    protected handleAttack(player: PlayerActor, controller: PlayerController, type: string): void {
        // console.log('attack in main at', player.position.toString(), 'facing', controller.faceDir.toString());
        console.log("handle attack called");

        // REVISIT random values for testing
        let halfAttackWidth = 0;
        let halfAttackLength = 0;
        let distanceAdder = 0;
        if(type === "light"){
            halfAttackWidth = 10;
            halfAttackLength = 10;
            distanceAdder = 20;
        }
        else if(type === "heavy") {
            halfAttackWidth = 20;
            halfAttackLength = 20;
            distanceAdder = 40;
        }

        

        // making sure player position is unchanged
        let damageSource: Vec2 = Vec2.ZERO;
        damageSource.x = player.position.x;
        damageSource.y = player.position.y;

        // shifting the damage box over to the direction that is being faced
        if(controller.rotation === 0) { 
            damageSource.y -= distanceAdder; // UP
        }
        else if(controller.rotation === Math.PI ){ 
            damageSource.y += distanceAdder; // DOWN
        }
        else if(controller.rotation === Math.PI/2 ){
            damageSource.x -= distanceAdder; // LEFT
        }
        else {
            damageSource.x += distanceAdder; // RIGHT
        }

        let damage = 0;
        if(type === "light") {
            this.attackMarker = <Rect>this.add.graphic(GraphicType.RECT, "primary", { position: damageSource, 
                size: new Vec2(halfAttackWidth*2, halfAttackLength*2)});
            this.attackMarker.color = new Color(255, 0, 255, .20);
            damage = 1.25; // 00001 to avoid rounding down error
        }
        else if(type === "heavy") {
            this.attackMarker = <Rect>this.add.graphic(GraphicType.RECT, "primary", { position: damageSource,
                size: new Vec2(halfAttackWidth*2, halfAttackLength*2)});
            this.attackMarker.color = new Color(255, 255, 0, .20);
            damage = 2; // 00001 to avoid rounding down error
        }
        

        this.attackMarker.visible = true;


        // can probably use a shape, this is really just a test implimentation
        let left = damageSource.x - halfAttackWidth;
        let right = damageSource.x + halfAttackWidth;
        let top = damageSource.y - halfAttackLength;
        let bottom = damageSource.y + halfAttackLength;
        for(let i = 0; i < this.battlers.length; i++){
            let b = this.battlers[i];
            if(b.id != player.id && // prevents the player from hitting themselves
                b.position.x - (b.size.x/2) < right &&
                b.position.x + (b.size.x/2)> left &&
                b.position.y + (b.size.y/2) > top &&
                b.position.y - (b.size.y/2) < bottom) {
                    this.dealDamage(b, damage);
                    //Play attack sound effects
                    if (type === "light"){
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "lightAttack", loop: false, holdReference: false});
                    } else {
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "heavyAttack", loop: false, holdReference: false});
                    }
                }
            }
        }

    protected handleAttackOver(): void {
        this.attackMarker.visible = false;
    }

    protected handleBossAttackTimer(actor: NPCActor): void {
        //timers are cringe, they change the context of `this`, so I will store the data
        // then fire an event when the timer ends, and that event will read the stored data
        // and be able to act under the proper `this` context
        this.bossPasser = actor; 
        this.bossAttackDelayer.start();
    }

/*    protected bridger(): void {
        // `this` here reffers to the timer itself or something weird like that,
        // so instead I just fire an event so it can be handled in the original this
        let emitter = new Emitter();
        emitter.fireEvent(BossEvent.BOSS_ATTACK_FIRE);
    }*/

    protected handleBossAttack = () => {
        // can pass in the player from target in guardbehavior
        let actor = this.bossPasser;
        let position = actor.position;
        let damageSource = position;
        let halfAttackWidth = 100;
        let halfAttackLength = 60;

        this.attackMarker2 = <Rect>this.add.graphic(GraphicType.RECT, "primary", { position: damageSource,
            size: new Vec2(halfAttackWidth*2, halfAttackLength*2)});
        this.attackMarker2.color = new Color(255, 0, 0, .40);
        this.attackMarker2.visible = true;

        let left = damageSource.x - halfAttackWidth;
        let right = damageSource.x + halfAttackWidth;
        let top = damageSource.y - halfAttackLength;
        let bottom = damageSource.y + halfAttackLength;
        for(let i = 0; i < this.battlers.length; i++){
            let b = this.battlers[i];
            if(b.id != actor.id && // prevents the boss from hitting themselves
                b.position.x - (b.size.x/2) < right &&
                b.position.x + (b.size.x/2)> left &&
                b.position.y + (b.size.y/2) > top &&
                b.position.y - (b.size.y/2) < bottom) { 
                    if (!this.godMode){
                        this.dealDamage(b, 2);
                        //Play attack sound effect
                        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "veryHeavyAttack", loop: false, holdReference: false});
                    } else {
                        console.log("god mode is on, no damage taken");
                    }
            }
        }

    }

    protected handleBossAttackOver(): void {
        this.attackMarker2.visible = false;
    }

    protected dealDamage(battler: AnimatedSprite & Battler, damage: number) {
        console.log("battler health before:", battler.health);
        console.log("this battler took damage:", battler.id);
        battler.health-= damage;
        console.log("battler health after:", battler.health);

    }

    
    protected sceneEnderLose(): void {
        console.log("triggering Lose...");
        let emitter = new Emitter();
        emitter.fireEvent(SceneEvents.END_SCENE_0);
    }
    protected sceneEnderWin(): void {
        console.log("triggering Win...");
        let emitter = new Emitter();
        emitter.fireEvent(SceneEvents.END_SCENE_1);
    }

    protected handleSceneEndWin (): void {
        // recentering the viewport
        const center = this.viewport.getCenter();
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "bossMusic1"});
        this.sceneManager.changeToScene(MainMenu);
    }
    protected handleSceneEndLose (): void {
        // recentering the viewport
        const center = this.viewport.getCenter();
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);
        this.viewport.setZoomLevel(1);
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "bossMusic1"});
        this.sceneManager.changeToScene(MainMenu);
    }


    protected handleItemRequest(node: GameNode, inventory: Inventory): void {
        let items: Item[] = new Array<Item>(...this.healthpacks, ...this.laserguns).filter((item: Item) => {
            return item.inventory === null && item.position.distanceTo(node.position) <= 100;
        });

        if (items.length > 0) {
            inventory.add(items.reduce(ClosestPositioned(node)));
        }
    }

    /**
     * Handles an NPC being killed by unregistering the NPC from the scenes subsystems
     * @param event an NPC-killed event
     */
    protected handleBattlerKilled(event: GameEvent): void {
        let id: number = event.data.get("id");
        
        if(id === this.player.id){
            console.log("player killed! Ending");
            
            this.player.animation.play("DEAD");
            console.log("played death animation");
            //marks the player as dead for guardbehavior
            this.boss.alpha = .9797; //SUPER SCUFFED, REVISIT IMPORTANT TODO
            this.sceneEndLoseDelayer.start();
            // this marks it as dead for the guardbehavior, prob a better way to do this
            
            // TODO death animation
            // this.emitter.fireEvent(PlayerEvent.PLAYER_KILLED);
        }
        else if (id === this.boss.id) {
            console.log("Boss killed! Ending");
            // TODO death animation
            // this.emitter.fireEvent(BossEvent.BOSS_KILLED);
            this.boss.animation.playIfNotAlready("DEAD");
            this.sceneEndWinDelayer.start();
            
        }
        // IMPORTANT !
        // TODO cause this to happen after player death animation plays!

        this.idPasser = id;
        console.log("starting disappear timer");
        this.disappearTimer.start();
        
        
    }

    protected disappear = () =>  {
        console.log("in disappear");
        let id = this.idPasser;
        let battler = this.battlers.find(b => b.id === id);
        console.log("the passed ID", id);

        if (battler) {
            battler.battlerActive = false;
            this.healthbars.get(id).visible = false;
        }
    }

    /** Initializes the layers in the scene */
    protected initLayers(): void {
        this.addLayer("primary", 10);
        this.addUILayer("slots");
        this.addUILayer("items");
        this.getLayer("slots").setDepth(1);
        this.getLayer("items").setDepth(2);
    }




    /**
     * Initializes the player in the scene
     */
    protected initializePlayer(): void {
        let player = this.add.animatedSprite(PlayerActor, "player1", "primary");
        player.position.set(40, 40);
        player.battleGroup = 2;
        //Scale the player sprite to be 1.5x the size of the tile
        player.scale.set(1.5, 1.5);

        player.health = 4;
        player.maxHealth = 4;

        player.inventory.onChange = ItemEvent.INVENTORY_CHANGED
        this.inventoryHud = new InventoryHUD(this, player.inventory, "inventorySlot", {
            start: new Vec2(232, 24),
            slotLayer: "slots",
            padding: 8,
            itemLayer: "items"
        });

        // Give the player physics
        player.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));

        // Give the player a healthbar NOTE: this is the Original HealthBar
        let healthbar = new HealthbarHUD(this, player, "primary", {size: player.size.clone().scaled(2, 1/2), offset: player.size.clone().scaled(0, -1/2)});
        this.healthbars.set(player.id, healthbar);
        healthbar.visible = false; // Im setting it to invisible for now because i realize that another part of the code relies on this existing

        this.addUILayer("health2")
        this.HealthIcons = new Array(4);
        this.HealthIcons[0] = this.add.sprite("healthIcon","health2");
        this.HealthIcons[1] = this.add.sprite("healthIcon","health2");
        this.HealthIcons[2] = this.add.sprite("healthIcon","health2");
        this.HealthIcons[3] = this.add.sprite("healthIcon","health2");
        this.HealthIcons[0].scale.set(.25,.25);
        this.HealthIcons[1].scale.set(.25,.25);
        this.HealthIcons[2].scale.set(.25,.25);
        this.HealthIcons[3].scale.set(.25,.25);
        this.HealthIcons[0].positionX = this.getViewport().getCenter().x - 490;
        this.HealthIcons[0].positionY = 0 +30;
        this.HealthIcons[1].positionX = this.getViewport().getCenter().x - 440;
        this.HealthIcons[1].positionY = 0 +30;
        this.HealthIcons[2].positionX = this.getViewport().getCenter().x - 390;
        this.HealthIcons[2].positionY = 0 +30;
        this.HealthIcons[3].positionX = this.getViewport().getCenter().x - 340;
        this.HealthIcons[3].positionY = 0 +30;

        //Creates a Wolfie Sprite healthbar
        let playerHealthbar = new PlayerHealthHUD(this,player,"primary",this.HealthIcons);
        this.PlayerHealthBar = playerHealthbar;




        this.DodgeIcons = new Array(4);
        this.DodgeIcons[0] = this.add.sprite("dodgeIcon","health2");
        this.DodgeIcons[1] = this.add.sprite("dodgeIcon","health2");
        this.DodgeIcons[2] = this.add.sprite("dodgeIcon","health2");
        this.DodgeIcons[3] = this.add.sprite("dodgeIcon","health2");
        this.DodgeIcons[0].scale.set(.25,.25);
        this.DodgeIcons[1].scale.set(.25,.25);
        this.DodgeIcons[2].scale.set(.25,.25);
        this.DodgeIcons[3].scale.set(.25,.25);


        this.DodgeIcons[0].positionX = this.viewport.getCenter().x - 490;
        this.DodgeIcons[0].positionY = 0 +60;
        this.DodgeIcons[1].positionX = this.viewport.getCenter().x - 440;
        this.DodgeIcons[1].positionY = 0 +60;
        this.DodgeIcons[2].positionX = this.viewport.getCenter().x - 390;
        this.DodgeIcons[2].positionY = 0 +60;
        this.DodgeIcons[3].positionX = this.viewport.getCenter().x - 340;
        this.DodgeIcons[3].positionY = 0 +60;

        // Give the player PlayerAI
        player.addAI(PlayerAI);

        this.player = player;

        // Start the player in the "IDLE" animation
        player.animation.play("DOWN");
        this.battlers.push(player);
        this.viewport.follow(player);
    }
    /**
     * Initialize the boss
     */
    protected initializeBoss(): void {
        let boss = this.add.animatedSprite(NPCActor, "boss", "primary");
        boss.scale.set(1.5, 1.5);
        boss.position.set(200, 250);
        boss.addPhysics(new AABB(Vec2.ZERO, new Vec2(7, 7)), null, false);
        boss.battleGroup = 2
        boss.speed = 15;
        boss.health = 10;
        boss.maxHealth = 10;
        boss.navkey = "navmesh";
        // Give the NPC a healthbar
        let healthbar = new HealthbarHUD(this, boss, "primary", {size: boss.size.clone().scaled(2, 1/2), offset: boss.size.clone().scaled(0, -1/2)});
        this.healthbars.set(boss.id, healthbar);

        // Give the NPCs their AI
        boss.addAI(GuardBehavior, {target: this.player, range: 100, time: 1250});
        this.boss = boss;
        // Play the NPCs "IDLE" animation 
        boss.animation.play("DOWN");
        this.battlers.push(boss);
    }

    /**
     * Initialize the NPCs 
     */
    protected initializeNPCs(): void {

        // Get the object data for the red enemies
        let red = this.load.getObject("red");

        // Initialize the red healers
        for (let i = 0; i < red.healers.length; i++) {
            let npc = this.add.animatedSprite(NPCActor, "RedHealer", "primary");
            npc.position.set(red.healers[i][0], red.healers[i][1]);
            npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(7, 7)), null, false);

            npc.battleGroup = 1;
            npc.speed = 10;
            npc.health = 10;
            npc.maxHealth = 10;
            npc.navkey = "navmesh";

            // Give the NPC a healthbar
            let healthbar = new HealthbarHUD(this, npc, "primary", {size: npc.size.clone().scaled(2, 1/2), offset: npc.size.clone().scaled(0, -1/2)});
            this.healthbars.set(npc.id, healthbar);

            npc.addAI(HealerBehavior);
            npc.animation.play("IDLE");
            this.battlers.push(npc);
        }

        for (let i = 0; i < red.enemies.length; i++) {
            let npc = this.add.animatedSprite(NPCActor, "RedEnemy", "primary");
            npc.position.set(red.enemies[i][0], red.enemies[i][1]);
            npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(7, 7)), null, false);

            // Give the NPC a healthbar
            let healthbar = new HealthbarHUD(this, npc, "primary", {size: npc.size.clone().scaled(2, 1/2), offset: npc.size.clone().scaled(0, -1/2)});
            this.healthbars.set(npc.id, healthbar);
            
            // Set the NPCs stats
            npc.battleGroup = 1
            npc.speed = 10;
            npc.health = 1;
            npc.maxHealth = 10;
            npc.navkey = "navmesh";

            npc.addAI(GuardBehavior, {target: new BasicTargetable(new Position(npc.position.x, npc.position.y)), range: 100});

            // Play the NPCs "IDLE" animation 
            npc.animation.play("IDLE");
            // Add the NPC to the battlers array
            this.battlers.push(npc);
        }

        // Get the object data for the blue enemies
        let blue = this.load.getObject("blue");

        // Initialize the blue enemies
        for (let i = 0; i < blue.enemies.length; i++) {
            let npc = this.add.animatedSprite(NPCActor, "boss", "primary");
            npc.position.set(blue.enemies[i][0], blue.enemies[i][1]);
            npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(7, 7)), null, false);

            // Give the NPCS their healthbars
            let healthbar = new HealthbarHUD(this, npc, "primary", {size: npc.size.clone().scaled(2, 1/2), offset: npc.size.clone().scaled(0, -1/2)});
            this.healthbars.set(npc.id, healthbar);

            npc.battleGroup = 2
            npc.speed = 10;
            npc.health = 1;
            npc.maxHealth = 10;
            npc.navkey = "navmesh";

            // Give the NPCs their AI
            npc.addAI(GuardBehavior, {target: this.battlers[0], range: 100});

            // Play the NPCs "IDLE" animation 
            npc.animation.play("DOWN");

            this.battlers.push(npc);
        }

        // Initialize the blue healers
        for (let i = 0; i < blue.healers.length; i++) {
            
            let npc = this.add.animatedSprite(NPCActor, "BlueHealer", "primary");
            npc.position.set(blue.healers[i][0], blue.healers[i][1]);
            npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(7, 7)), null, false);

            npc.battleGroup = 2;
            npc.speed = 10;
            npc.health = 1;
            npc.maxHealth = 10;
            npc.navkey = "navmesh";

            let healthbar = new HealthbarHUD(this, npc, "primary", {size: npc.size.clone().scaled(2, 1/2), offset: npc.size.clone().scaled(0, -1/2)});
            this.healthbars.set(npc.id, healthbar);

            npc.addAI(HealerBehavior);
            npc.animation.play("IDLE");
            this.battlers.push(npc);
        }


    }

    /**
     * Initialize the items in the scene (healthpacks and laser guns)
     */
    protected initializeItems(): void {
        let laserguns = this.load.getObject("laserguns");
        this.laserguns = new Array<LaserGun>(laserguns.items.length);
        for (let i = 0; i < laserguns.items.length; i++) {
            let sprite = this.add.sprite("laserGun", "primary");
            let line = <Line>this.add.graphic(GraphicType.LINE, "primary", {start: Vec2.ZERO, end: Vec2.ZERO});
            this.laserguns[i] = LaserGun.create(sprite, line);
            this.laserguns[i].position.set(laserguns.items[i][0], laserguns.items[i][1]);
        }

        let healthpacks = this.load.getObject("healthpacks");
        this.healthpacks = new Array<Healthpack>(healthpacks.items.length);
        for (let i = 0; i < healthpacks.items.length; i++) {
            let sprite = this.add.sprite("healthpack", "primary");
            this.healthpacks[i] = new Healthpack(sprite);
            this.healthpacks[i].position.set(healthpacks.items[i][0], healthpacks.items[i][1]);
        }
    }
    /**
     * Initializes the navmesh graph used by the NPCs in the HW3Scene. This method is a little buggy, and
     * and it skips over some of the positions on the tilemap. If you can fix my navmesh generation algorithm,
     * go for it.
     * 
     * - Peter
     */
    protected initializeNavmesh(): void {
        // Create the graph
        this.graph = new PositionGraph();

        let dim: Vec2 = this.walls.getDimensions();
        for (let i = 0; i < dim.y; i++) {
            for (let j = 0; j < dim.x; j++) {
                let tile: AABB = this.walls.getTileCollider(j, i);
                this.graph.addPositionedNode(tile.center);
            }
        }

        let rc: Vec2;
        for (let i = 0; i < this.graph.numVertices; i++) {
            rc = this.walls.getTileColRow(i);
            if (!this.walls.isTileCollidable(rc.x, rc.y) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x - 1, 0, dim.x - 1), rc.y) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x + 1, 0, dim.x - 1), rc.y) &&
                !this.walls.isTileCollidable(rc.x, MathUtils.clamp(rc.y - 1, 0, dim.y - 1)) &&
                !this.walls.isTileCollidable(rc.x, MathUtils.clamp(rc.y + 1, 0, dim.y - 1)) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x + 1, 0, dim.x - 1), MathUtils.clamp(rc.y + 1, 0, dim.y - 1)) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x - 1, 0, dim.x - 1), MathUtils.clamp(rc.y + 1, 0, dim.y - 1)) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x + 1, 0, dim.x - 1), MathUtils.clamp(rc.y - 1, 0, dim.y - 1)) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x - 1, 0, dim.x - 1), MathUtils.clamp(rc.y - 1, 0, dim.y - 1))

            ) {
                // Create edge to the left
                rc = this.walls.getTileColRow(i + 1);
                if ((i + 1) % dim.x !== 0 && !this.walls.isTileCollidable(rc.x, rc.y)) {
                    this.graph.addEdge(i, i + 1);
                    // this.add.graphic(GraphicType.LINE, "graph", {start: this.graph.getNodePosition(i), end: this.graph.getNodePosition(i + 1)})
                }
                // Create edge below
                rc = this.walls.getTileColRow(i + dim.x);
                if (i + dim.x < this.graph.numVertices && !this.walls.isTileCollidable(rc.x, rc.y)) {
                    this.graph.addEdge(i, i + dim.x);
                    // this.add.graphic(GraphicType.LINE, "graph", {start: this.graph.getNodePosition(i), end: this.graph.getNodePosition(i + dim.x)})
                }


            }
        }

        // Set this graph as a navigable entity
        let navmesh = new Navmesh(this.graph);
        // Add different strategies to use for this navmesh
        navmesh.registerStrategy("direct", new DirectStrategy(navmesh));
        navmesh.registerStrategy("astar", new AstarStrategy(navmesh));
        // Select A* as our navigation strategy
        navmesh.setStrategy("astar");

        // Add this navmesh to the navigation manager
        this.navManager.addNavigableEntity("navmesh", navmesh);
    }

    public getBattlers(): Battler[] { return this.battlers; }

    public getWalls(): OrthogonalTilemap { return this.walls; }

    public getHealthpacks(): Healthpack[] { return this.healthpacks; }

    public getLaserGuns(): LaserGun[] { return this.laserguns; }

    /**
     * Checks if the given target position is visible from the given position.
     * @param position 
     * @param target 
     * @returns 
     */
    public isTargetVisible(position: Vec2, target: Vec2): boolean {

        // Get the new player location
        let start = position.clone();
        let delta = target.clone().sub(start);

        // Iterate through the tilemap region until we find a collision
        let minX = Math.min(start.x, target.x);
        let maxX = Math.max(start.x, target.x);
        let minY = Math.min(start.y, target.y);
        let maxY = Math.max(start.y, target.y);

        // Get the wall tilemap
        let walls = this.getWalls();

        let minIndex = walls.getTilemapPosition(minX, minY);
        let maxIndex = walls.getTilemapPosition(maxX, maxY);

        let tileSize = walls.getScaledTileSize();

        for (let col = minIndex.x; col <= maxIndex.x; col++) {
            for (let row = minIndex.y; row <= maxIndex.y; row++) {
                if (walls.isTileCollidable(col, row)) {
                    // Get the position of this tile
                    let tilePos = new Vec2(col * tileSize.x + tileSize.x / 2, row * tileSize.y + tileSize.y / 2);

                    // Create a collider for this tile
                    let collider = new AABB(tilePos, tileSize.scaled(1 / 2));

                    let hit = collider.intersectSegment(start, delta, Vec2.ZERO);

                    if (hit !== null && start.distanceSqTo(hit.pos) < start.distanceSqTo(target)) {
                        // We hit a wall, we can't see the player
                        return false;
                    }
                }
            }
        }
        return true;

    }

    /**
     * Saves on loading time
     */
    public unloadScene(): void {
        console.log("not keeping anything, resetting to home screen");
    }
}
