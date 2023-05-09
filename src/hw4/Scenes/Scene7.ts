import PositionGraph from "../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import Graphic from "../../Wolfie2D/Nodes/Graphic";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
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
import AstarStrategy from "../Pathfinding/AstarStrategy";
import HW4Scene from "./HW4Scene";
import Sprite from "../../Wolfie2D/Nodes/Sprites/Sprite";
import Emitter from "../../Wolfie2D/Events/Emitter";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import MainMenu from "./MainMenu";
import PlayerHealthHUD from "../GameSystems/HUD/PlayerHealthHUD";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import BossHealthbarHUD from "../GameSystems/HUD/BossHealthHUD";
import AttackActor from "../Actors/AttackActor";
import Scene8 from "./Scene8";

export default class Scene7 extends HW4Scene {

    /** GameSystems in the HW3 Scene */
    private inventoryHud: InventoryHUD;

    /** All the battlers in the Scene (including the player) */
    private battlers: (AnimatedSprite & Battler)[];
    // only the bosses
    private bosses: (NPCActor)[];
    private attackQueue: (NPCActor)[];
    private attackOverQueue: (NPCActor)[];
    // the boss timers, {id, timer}
    private bossTimers: ({id: number, timer: Timer})[];
    // the boss attack markers, {id, attackMarker}
    private bossMarkers: ({id: number, marker: Graphic})[];

    public player: PlayerActor;
    private boss: AnimatedSprite;
    private idPasser: number;
    
    /** Healthbars for the battlers */
    private healthbars: Map<number, HealthbarHUD>;
    private bossHealth: BossHealthbarHUD;

    private bases: BattlerBase[];
    private HealthIcons: Array<Sprite>;
    private DodgeIcons: Array<Sprite>;
    private currentDodge: number;
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
    private sceneSkipTimer: Timer;

    // Cheat Flags
    private godMode: boolean;

    private win: boolean;

    // Attacks
    private left_fist: AttackActor;
    private right_fist: AttackActor;
    
   
    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);

        this.battlers = new Array<AnimatedSprite & Battler>();
        this.bosses = new Array<NPCActor>();
        this.attackQueue = new Array<NPCActor>();
        this.attackOverQueue = new Array<NPCActor>();
        this.bossTimers = new Array<{id: number, timer: Timer}>();
        this.bossMarkers = new Array<{id: number, marker: Graphic}>();

        this.healthbars = new Map<number, HealthbarHUD>();

        this.godMode = false;
    }

    /**
     * @see Scene.update()
     */
    public override loadScene() {
        // should all be saved from previous scene
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
        
        this.initializePlayer();
        this.initializeNavmesh();

        let bossAttackSpeed = 1250;
        let bossAttackDelayDiff = 200;
        let id = this.initializeBoss(16, 10, 10, 110, 240, 1, bossAttackSpeed,40, 28, "bossFast");
        let tm = new Timer(bossAttackSpeed-bossAttackDelayDiff, this.handleBossAttack);
        this.bossTimers.push({id: id, timer: tm});

        bossAttackSpeed = 1250;
        bossAttackDelayDiff = 200;
        id = this.initializeBoss(16, 10, 10, 80, 200, 1, bossAttackSpeed,40, 28, "bossFast");
        tm = new Timer(bossAttackSpeed-bossAttackDelayDiff, this.handleBossAttack);
        this.bossTimers.push({id: id, timer: tm});
        
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

        this.sceneEndWinDelayer = new Timer(2000, this.sceneEnderWin);
        this.sceneEndLoseDelayer = new Timer(2000, this.sceneEnderLose);
        this.disappearTimer = new Timer(500, this.disappear);
        this.sceneSkipTimer = new Timer(100);
        this.sceneSkipTimer.start();

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
        this.PlayerHealthBar.update(deltaT);
        this.bossHealth.update(deltaT);
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
                // console.log("HERE");
                this.handleDodgeChargeChange(event.data.get("curchrg"),event.data.get("maxchrg"), event.data.get("type"));
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
                if(this.sceneSkipTimer.isStopped() && this.sceneSkipTimer.hasRun()){
                    console.log("Cheat activated: advancing level");
                    this.win = true;
                    this.handleSceneEndWin();
                }
                break;
            }
            default: {
                throw new Error(`Unhandled event type "${event.type}" caught in SeawolfSaga event handler`);
            }
        }
    }

    protected handleDodgeChargeChange(currentCharge: number, maxCharge: number, type: string): void {


        // if increasing LOWER than current
        if(type === "increase" && currentCharge < this.currentDodge){
            // console.log("ignored eronous increase");
            return; // ignore this event
        }
        // if decreasing HIGHER than current
        if(type === "decrease" && currentCharge > this.currentDodge){
            // console.log("ignored eronous decrease");
            return; // ignore this event
        }

        if(currentCharge - this.currentDodge > 1 || currentCharge - this.currentDodge < -1){
            // console.log("skipping charges");
            return;
        }
        
        for(let i = currentCharge; i < this.DodgeIcons.length; i++ ){
            this.DodgeIcons[i].visible = false;
        }
        for(let i = 0; i < currentCharge && i<this.DodgeIcons.length;i++){
            this.DodgeIcons[i].visible = true;
        }
        this.currentDodge = currentCharge;


    }
    
    protected handleDodgeOver(): void {
        //REVISIT
    }


    protected handleAttack(player: PlayerActor, controller: PlayerController, type: string): void {
        // console.log('attack in main at', player.position.toString(), 'facing', controller.faceDir.toString());
        // console.log("handle attack called");
        
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
            this.attackMarker.color = new Color(255, 0, 255, 0);
            //Set the left fist to the correct position
            this.left_fist.position.set(damageSource.x, damageSource.y);
            //Play the fist animation based on the direction the player is facing
            if(controller.rotation === 0) {
                this.left_fist.animation.play("UP", false);
            }
            else if(controller.rotation === Math.PI ){
                this.left_fist.animation.play("DOWN", false);
            }
            else if(controller.rotation === Math.PI/2 ){
                this.left_fist.animation.play("LEFT", false);
            }
            else {
                this.left_fist.animation.play("RIGHT", false);
            }
            this.left_fist.visible = true;
            damage = 1.25; // 00001 to avoid rounding down error
        }
        else if(type === "heavy") {
            this.attackMarker = <Rect>this.add.graphic(GraphicType.RECT, "primary", { position: damageSource,
                size: new Vec2(halfAttackWidth*2, halfAttackLength*2)});
            this.attackMarker.color = new Color(255, 255, 0, 0);
            //Set the right fist to the correct position
            this.right_fist.position.set(damageSource.x, damageSource.y);
            //Play the fist animation based on the direction the player is facing
            if(controller.rotation === 0) {
                this.right_fist.animation.play("UP", false);
            }
            else if(controller.rotation === Math.PI ){
                this.right_fist.animation.play("DOWN", false);
            }
            else if(controller.rotation === Math.PI/2 ){
                this.right_fist.animation.play("LEFT", false);
            }
            else {
                this.right_fist.animation.play("RIGHT", false);
            }
            this.right_fist.visible = true;
            damage = 2; // 00001 to avoid rounding down error
        }
        

        this.attackMarker.visible = true;


        // can probably use a shape, this is really just a test implimentation
        let left = damageSource.x - halfAttackWidth;
        let right = damageSource.x + halfAttackWidth;
        let top = damageSource.y - halfAttackLength;
        let bottom = damageSource.y + halfAttackLength;
        for(let i = 0; i < this.bosses.length; i++){
            let b = this.bosses[i];
            if(b.position.x - (b.size.x/2) < right &&
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
        this.left_fist.visible = false;
        this.right_fist.visible = false;
    }

    protected handleBossAttackTimer(actor: NPCActor): void {
        this.attackQueue.unshift(actor); 
        this.attackOverQueue.unshift(actor);
        for(let i = 0; i < this.bossTimers.length; i++){
            if(this.bossTimers[i].id === actor.id){
                this.bossTimers[i].timer.start();
            }
        }
    }

    protected handleBossAttack = () => {
        // can pass in the player from target in guardbehavior

        // IMPORTANT you already have the boss, and the player is globally located via this.player ,
        // so it is quite easy to get the attack to be in the direction of the player.
        // You can make it in 4 set directions, as the player's handleAttack does,
        // or you can make it vector straight to the player just as the dodge works (found in PlayerState.ts)

        let actor = this.attackQueue.pop();
        console.log("in main boss:", actor.id);
        let damage = actor.damage;
        let position = actor.position;
        let damageSource = position;
        let halfAttackWidth = actor.attackWidth;
        let halfAttackLength = actor.attackLength;

        for(let i = 0; i < this.bossMarkers.length; i++){
            if(this.bossMarkers[i].id === actor.id){
                this.bossMarkers[i].marker.position = damageSource;
                this.bossMarkers[i].marker.visible = true;
            }
        }

        let left = damageSource.x - halfAttackWidth;
        let right = damageSource.x + halfAttackWidth;
        let top = damageSource.y - halfAttackLength;
        let bottom = damageSource.y + halfAttackLength;
        // only the player is hit by attacks
        let b = this.player;
        if(b.position.x - (b.size.x/2) < right &&
            b.position.x + (b.size.x/2)> left &&
            b.position.y + (b.size.y/2) > top &&
            b.position.y - (b.size.y/2) < bottom) { 
                if (!this.godMode){
                    this.dealDamage(b, damage);
                    //Play attack sound effect
                    this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "veryHeavyAttack", loop: false, holdReference: false});
                } else {
                    console.log("god mode is on, no damage taken");
                }
        }
    }

    protected handleBossAttackOver(): void {
        let actor = this.attackOverQueue.pop();
        for(let i = 0; i < this.bossMarkers.length; i++){
            if(this.bossMarkers[i].id === actor.id){
                this.bossMarkers[i].marker.visible = false;
            }
        }
    }

    protected dealDamage(battler: AnimatedSprite & Battler, damage: number) {
        // console.log("this battler took damage:", battler.id);
        // console.log("battler health before:", battler.health);
        battler.health-= damage;
        // console.log("battler health after:", battler.health);

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
        this.sceneManager.changeToScene(Scene8);
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
            //marks the player as dead for guardbehavior
            for(let i = 0; i < this.bosses.length; i++){
                this.bosses[i].playerIsDead = true;
            }

            this.win = false;
            this.sceneEndLoseDelayer.start();
        }
        else {
            for(let i = 0; i < this.bosses.length; i++){
                if(id === this.bosses[i].id){
                    this.bosses[i].isDead = true;
                    this.bosses[i].animation.playIfNotAlready("DEAD");
                }
            }

            let allBossesDefeated = true;
            for(let i = 0; i < this.bosses.length; i++){
                if(!this.bosses[i].isDead){
                    allBossesDefeated = false;
                }
            }
            if(allBossesDefeated){
                this.godMode = true; // prevent any attacks from hurting after the bosses are dead
                console.log("All Bosses Killed! Ending");
                this.win = true;
                this.sceneEndWinDelayer.start();
            }
        }

        this.idPasser = id;
        // console.log("starting disappear timer");
        this.disappearTimer.start();   
    }

    protected disappear = () =>  {
        // console.log("in disappear");
        let id = this.idPasser;
        let battler = this.battlers.find(b => b.id === id);
        // console.log("the passed ID", id);

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

        // Initialize left fist as an animatedSprite
        let left_fist = this.add.animatedSprite(AttackActor, "left_fist", "primary");
        left_fist.position.set(0, 0);
        left_fist.visible = false;
        left_fist.scale.set(1, 1);
        left_fist.tweens.add("LEFT", {
            startDelay: 0,
            duration: 100,
            effects: [
                {
                    property: "positionX",
                    start: 0,
                    end: -10,
                }
            ],
        });
        this.left_fist = left_fist;

        //Initialize right fist
        let right_fist = this.add.animatedSprite(AttackActor, "right_fist", "primary");
        right_fist.position.set(0, 0);
        right_fist.visible = false;
        right_fist.scale.set(2.2, 2.2);
        right_fist.tweens.add("RIGHT", {
            startDelay: 0,
            duration: 100,
            effects: [
                {
                    property: "positionX",
                    start: 0,
                    end: 10,
                }
            ],
        });
        this.right_fist = right_fist;

        player.health = 4;
        player.maxHealth = 4;

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
        let playerHealthbar = new PlayerHealthHUD(this,player,"slots",this.HealthIcons);
        this.PlayerHealthBar = playerHealthbar;

        this.DodgeIcons = new Array(4);
        this.DodgeIcons[0] = this.add.sprite("dodgeIcon","health2");
        this.DodgeIcons[1] = this.add.sprite("dodgeIcon","health2");
        this.DodgeIcons[2] = this.add.sprite("dodgeIcon","health2");
        this.DodgeIcons[3] = this.add.sprite("dodgeIcon","health2");
        this.DodgeIcons[0].visible = true;
        this.DodgeIcons[1].visible = true;
        this.DodgeIcons[2].visible = true;
        this.DodgeIcons[3].visible = true;
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
    protected initializeBoss(speed: number, health: number, maxHealth: number, bossX: number, bossY: number,
          damage: number, attackSpeed: number, attackWidth: number, attackLength: number, type: string): number {
        let boss = this.add.animatedSprite(NPCActor, type, "primary");
        console.log("type in initialize boss:", type);
        boss.visible= true;
        boss.scale.set(1.5, 1.5);
        boss.position.set(bossX, bossY);
        boss.addPhysics(new AABB(Vec2.ZERO, new Vec2(7, 7)), null, false);
        boss.damage = damage; //stores the damage value in the battleGroup field
        boss.speed = speed;
        boss.health = health;
        boss.attackWidth = attackWidth;
        boss.attackLength = attackLength;
        boss.maxHealth = maxHealth;
        boss.battleGroup = 2;
        boss.playerIsDead = false;
        boss.isDead = false;
        boss.navkey = "navmesh";
        // Give the NPC a healthbar
        let healthbar = new HealthbarHUD(this, boss, "primary", {size: boss.size.clone().scaled(2, 1/2), offset: boss.size.clone().scaled(0, -1/2)});
        let BossHealthBar = new BossHealthbarHUD(this,boss, "primary", {size: boss.size.clone().scaled(2, 1/2), offset: boss.size.clone().scaled(0, -1/2)});
        this.bossHealth = BossHealthBar;
        this.healthbars.set(boss.id, healthbar);

        // Give the NPCs their AI
        boss.addAI(GuardBehavior, {target: this.player, range: 100, time: attackSpeed});
        // Play the NPCs "IDLE" animation 
        boss.animation.play("DOWN");
        this.battlers.push(boss); 
        this.bosses.push(boss);


        let am = <Rect>this.add.graphic(GraphicType.RECT, "primary", {position: new Vec2(0, 0),
            size: new Vec2(attackWidth*2, attackLength*2)});
        am.color = new Color(255, 0, 0, .40);
        am.visible = false;
        this.bossMarkers.push({id: boss.id, marker: am});
        return boss.id;
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
        if(this.win){
            console.log("keeping a bunch of stuff from scene1");
            this.load.keepImage("healthIcon");
            this.load.keepImage("dodgeIcon");
            
            this.load.keepSpritesheet("player1");
            this.load.keepSpritesheet("boss");
            this.load.keepSpritesheet("bossFast");
            this.load.keepSpritesheet("bossHeavy");

            this.load.keepAudio("heavyAttack");
            this.load.keepAudio("lightAttack");
            this.load.keepAudio("playerDamaged");
            this.load.keepAudio("bossMusic1");
            this.load.keepAudio("veryHeavyAttack");

            // this.load.keepTilemap("level");
        }
        else {
            console.log("not keeping anything, resetting to home screen");
        }    
    }
}