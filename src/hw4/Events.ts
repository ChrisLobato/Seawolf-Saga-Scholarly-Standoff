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
    ATTACK_OVER = "ATTACK_OVER",
    PLAYER_DODGE_CHARGE = "PLAYER_DODGE_CHARGE"
}