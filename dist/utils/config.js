"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setToken = setToken;
exports.getToken = getToken;
const os_1 = require("os");
const path_1 = require("path");
const fs_1 = __importDefault(require("fs"));
const configDir = (0, path_1.join)((0, os_1.homedir)(), ".vibe");
const configPath = (0, path_1.join)(configDir, "config.json");
function setToken(token) {
    fs_1.default.mkdirSync(configDir, { recursive: true });
    fs_1.default.writeFileSync(configPath, JSON.stringify({ token }, null, 2));
}
function getToken() {
    try {
        return JSON.parse(fs_1.default.readFileSync(configPath, "utf8")).token;
    }
    catch {
        return undefined;
    }
}
