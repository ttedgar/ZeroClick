"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S_PONG = exports.S_ERROR = exports.S_GAME_OVER = exports.S_ROUND_END = exports.S_PLAYER_CLICKED = exports.S_ROUND_START = exports.S_ROUND_STARTING = exports.S_ROOM_UPDATE = exports.C_PING = exports.C_CLICK = exports.C_START_GAME = exports.C_SET_READY = exports.C_JOIN_ROOM = exports.C_CREATE_ROOM = void 0;
// Client → Server
exports.C_CREATE_ROOM = "create_room";
exports.C_JOIN_ROOM = "join_room";
exports.C_SET_READY = "set_ready";
exports.C_START_GAME = "start_game";
exports.C_CLICK = "click";
exports.C_PING = "ping";
// Server → Client
exports.S_ROOM_UPDATE = "room_update";
exports.S_ROUND_STARTING = "round_starting";
exports.S_ROUND_START = "round_start";
exports.S_PLAYER_CLICKED = "player_clicked";
exports.S_ROUND_END = "round_end";
exports.S_GAME_OVER = "game_over";
exports.S_ERROR = "error";
exports.S_PONG = "pong";
//# sourceMappingURL=events.js.map