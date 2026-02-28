// Client → Server
export const C_CREATE_ROOM = "create_room"
export const C_JOIN_ROOM = "join_room"
export const C_SET_READY = "set_ready"
export const C_START_GAME = "start_game"
export const C_CLICK = "click"
export const C_PING = "ping"

// Server → Client
export const S_ROOM_UPDATE = "room_update"
export const S_ROUND_STARTING = "round_starting"
export const S_ROUND_START = "round_start"
export const S_PLAYER_CLICKED = "player_clicked"
export const S_ROUND_END = "round_end"
export const S_GAME_OVER = "game_over"
export const S_ERROR = "error"
export const S_PONG = "pong"
