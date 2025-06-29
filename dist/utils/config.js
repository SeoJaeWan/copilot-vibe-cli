"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = getConfig;
exports.setToken = setToken;
exports.setTeamId = setTeamId;
exports.setProjectId = setProjectId;
const os_1 = require("os");
const path_1 = require("path");
const fs_1 = __importDefault(require("fs"));
const configDir = (0, path_1.join)((0, os_1.homedir)(), ".vibe");
const configPath = (0, path_1.join)(configDir, "config.json");
function readConfig() {
    try {
        const data = fs_1.default.readFileSync(configPath, "utf8");
        return JSON.parse(data);
    }
    catch {
        return {};
    }
}
function writeConfig(config) {
    fs_1.default.mkdirSync(configDir, { recursive: true });
    fs_1.default.writeFileSync(configPath, JSON.stringify(config, null, 2));
}
function getConfig() {
    return readConfig();
}
function setToken(token) {
    const config = readConfig();
    config.token = token;
    writeConfig(config);
}
function setTeamId(teamId) {
    const config = readConfig();
    config.teamId = teamId;
    writeConfig(config);
}
function setProjectId(projectId) {
    const config = readConfig();
    config.projectId = projectId;
    writeConfig(config);
}
