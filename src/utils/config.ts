import { homedir } from "os";
import { join } from "path";
import fs from "fs";

const configDir = join(homedir(), ".vibe");
const globalConfigPath = join(configDir, "config.json");
const workspaceConfigName = ".vibe-config.json";

interface VibeConfig {
  token?: string;
  teamId?: string;
  projectId?: string;
  workspaceName?: string;
}

function findWorkspaceConfig(): string | null {
  let currentDir = process.cwd();
  
  while (true) {
    const configPath = join(currentDir, workspaceConfigName);
    if (fs.existsSync(configPath)) {
      return configPath;
    }
    
    const parentDir = join(currentDir, "..");
    if (parentDir === currentDir) break; // reached root
    currentDir = parentDir;
  }
  
  return null;
}

function readConfig(useWorkspace: boolean = true): VibeConfig {
  let configPath = globalConfigPath;
  
  if (useWorkspace) {
    const workspaceConfigPath = findWorkspaceConfig();
    if (workspaceConfigPath) {
      configPath = workspaceConfigPath;
    }
  }
  
  try {
    const data = fs.readFileSync(configPath, "utf8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

function writeConfig(config: VibeConfig, useWorkspace: boolean = true) {
  let configPath = globalConfigPath;
  
  if (useWorkspace) {
    const workspaceConfigPath = findWorkspaceConfig();
    if (workspaceConfigPath) {
      configPath = workspaceConfigPath;
    } else {
      // 현재 디렉토리에 워크스페이스 설정 파일 생성
      configPath = join(process.cwd(), workspaceConfigName);
    }
  }
  
  // 디렉토리가 없으면 생성 (글로벌 설정의 경우)
  if (configPath === globalConfigPath) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

export function getConfig(): VibeConfig {
  // 워크스페이스 설정과 글로벌 설정을 병합
  const workspaceConfig = readConfig(true);  // 워크스페이스 설정
  const globalConfig = readConfig(false);    // 글로벌 설정
  
  // 토큰은 항상 글로벌에서, 나머지는 워크스페이스 우선
  return {
    token: globalConfig.token, // 토큰은 항상 글로벌에서
    teamId: workspaceConfig.teamId || globalConfig.teamId,
    projectId: workspaceConfig.projectId || globalConfig.projectId,
    workspaceName: workspaceConfig.workspaceName,
  };
}

export function setToken(token: string) {
  // 토큰은 항상 글로벌에만 저장
  const config = readConfig(false);
  config.token = token;
  writeConfig(config, false);
}

export function setTeamId(teamId: string) {
  // 팀 ID는 워크스페이스에 저장 (글로벌 fallback)
  const config = readConfig(true);
  config.teamId = teamId;
  writeConfig(config, true);
}

export function setProjectId(projectId: string) {
  // 프로젝트 ID는 워크스페이스에 저장 (글로벌 fallback)
  const config = readConfig(true);
  config.projectId = projectId;
  writeConfig(config, true);
}

export function setWorkspaceName(name: string) {
  const config = readConfig();
  config.workspaceName = name;
  writeConfig(config);
}

export function initWorkspace(name: string, teamId: string, projectId: string) {
  // 워크스페이스에는 토큰을 저장하지 않음 (보안)
  const config: VibeConfig = {
    workspaceName: name,
    teamId,
    projectId,
    // token은 제외 - 글로벌에서만 관리
  };
  
  writeConfig(config, true); // 워크스페이스에 저장
}
