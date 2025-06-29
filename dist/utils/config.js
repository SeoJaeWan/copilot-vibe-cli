"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = getConfig;
exports.setToken = setToken;
exports.setTeamId = setTeamId;
exports.setProjectId = setProjectId;
exports.setWorkspaceName = setWorkspaceName;
exports.initWorkspace = initWorkspace;
const os_1 = require("os");
const path_1 = require("path");
const fs_1 = __importDefault(require("fs"));
const configDir = (0, path_1.join)((0, os_1.homedir)(), ".vibe");
const globalConfigPath = (0, path_1.join)(configDir, "config.json");
const workspaceConfigName = ".vibe-config.json";
function findWorkspaceConfig() {
    let currentDir = process.cwd();
    while (true) {
        const configPath = (0, path_1.join)(currentDir, workspaceConfigName);
        if (fs_1.default.existsSync(configPath)) {
            return configPath;
        }
        const parentDir = (0, path_1.join)(currentDir, "..");
        if (parentDir === currentDir)
            break; // reached root
        currentDir = parentDir;
    }
    return null;
}
function readConfig(useWorkspace = true) {
    let configPath = globalConfigPath;
    if (useWorkspace) {
        const workspaceConfigPath = findWorkspaceConfig();
        if (workspaceConfigPath) {
            configPath = workspaceConfigPath;
        }
    }
    try {
        const data = fs_1.default.readFileSync(configPath, "utf8");
        return JSON.parse(data);
    }
    catch {
        return {};
    }
}
function writeConfig(config, useWorkspace = true) {
    let configPath = globalConfigPath;
    if (useWorkspace) {
        const workspaceConfigPath = findWorkspaceConfig();
        if (workspaceConfigPath) {
            configPath = workspaceConfigPath;
        }
        else {
            // 현재 디렉토리에 워크스페이스 설정 파일 생성
            configPath = (0, path_1.join)(process.cwd(), workspaceConfigName);
        }
    }
    // 디렉토리가 없으면 생성 (글로벌 설정의 경우)
    if (configPath === globalConfigPath) {
        fs_1.default.mkdirSync(configDir, { recursive: true });
    }
    fs_1.default.writeFileSync(configPath, JSON.stringify(config, null, 2));
}
function getConfig() {
    // 워크스페이스 설정과 글로벌 설정을 병합
    const workspaceConfig = readConfig(true); // 워크스페이스 설정
    const globalConfig = readConfig(false); // 글로벌 설정
    // 토큰은 항상 글로벌에서, 나머지는 워크스페이스 우선
    return {
        token: globalConfig.token, // 토큰은 항상 글로벌에서
        teamId: workspaceConfig.teamId || globalConfig.teamId,
        projectId: workspaceConfig.projectId || globalConfig.projectId,
        workspaceName: workspaceConfig.workspaceName,
    };
}
function setToken(token) {
    // 토큰은 항상 글로벌에만 저장
    const config = readConfig(false);
    config.token = token;
    writeConfig(config, false);
}
function setTeamId(teamId) {
    // 팀 ID는 워크스페이스에 저장 (글로벌 fallback)
    const config = readConfig(true);
    config.teamId = teamId;
    writeConfig(config, true);
}
function setProjectId(projectId) {
    // 프로젝트 ID는 워크스페이스에 저장 (글로벌 fallback)
    const config = readConfig(true);
    config.projectId = projectId;
    writeConfig(config, true);
}
function setWorkspaceName(name) {
    const config = readConfig();
    config.workspaceName = name;
    writeConfig(config);
}
function initWorkspace(name, teamId, projectId) {
    // 워크스페이스에는 토큰을 저장하지 않음 (보안)
    const config = {
        workspaceName: name,
        teamId,
        projectId,
        // token은 제외 - 글로벌에서만 관리
    };
    writeConfig(config, true); // 워크스페이스에 저장
}
