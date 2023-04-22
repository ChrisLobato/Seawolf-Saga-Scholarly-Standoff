export enum BattlerEvent {
    BATTLER_KILLED = "BATTLER_KILLED",
    BATTLER_RESPAWN = "BATTLER_RESPAWN",
    
    BATTLER_CHANGE = "BATTLER_CHANGE",
    CONSUME = "CONSUME",
    HIT = "HIT",
}

export enum ItemEvent {
    ITEM_REQUEST = "ITEM_REQUEST",

    LASERGUN_FIRED = "LASERGUN_FIRED",

    WEAPON_USED = "WEAPON_USED",
    CONSUMABLE_USED = "CONSUMABLE_USED",
    INVENTORY_CHANGED = "INVENTORY_CHANGED",
}

export enum HudEvent {
    HEALTH_CHANGE = "HEALTH_CHANGE"
}

export enum PlayerEvent {
    PLAYER_KILLED = "PLAYER_KILLED",
    PLAYER_DODGED = "PLAYER_DODGED",
    DODGE_OVER = "DODGE_OVER",
    PLAYER_ATTACKED = "PLAYER_ATTACKED",
    ATTACK_OVER = "ATTACK_OVER"
}


export enum BossEvent {
    BOSS_KILLED = "BOSS_KILLED",
    BOSS_ATTACKED = "BOSS_ATTACKED",
    BOSS_ATTACK_FIRE = "BOSS_ATTACKED_FIRE",
    BOSS_ATTACK_OVER = "BOSS_ATTACK_OVER"
}

export enum SceneEvents {
    END_SCENE_0 = "END_SCENE_0",
    END_SCENE_1 = "END_SCENE_1"
}