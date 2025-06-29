import { homedir } from "os";
import { join } from "path";
import fs from "fs";

const configDir = join(homedir(), ".vibe");
const configPath = join(configDir, "config.json");

interface VibeConfig {
  token?: string;
  teamId?: string;
  projectId?: string;
}

function readConfig(): VibeConfig {
  try {
    const data = fs.readFileSync(configPath, "utf8");
    return JSON.parse(data);
  } catch {
    return {};
  }
}

function writeConfig(config: VibeConfig) {
  fs.mkdirSync(configDir, { recursive: true });
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

export function getConfig(): VibeConfig {
  return readConfig();
}

export function setToken(token: string) {
  const config = readConfig();
  config.token = token;
  writeConfig(config);
}

export function setTeamId(teamId: string) {
  const config = readConfig();
  config.teamId = teamId;
  writeConfig(config);
}

export function setProjectId(projectId: string) {
  const config = readConfig();
  config.projectId = projectId;
  writeConfig(config);
}
