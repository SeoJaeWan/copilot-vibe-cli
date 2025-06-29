import { Command } from "commander";
import {
  getConfig,
  setToken,
  setTeamId,
  setProjectId,
} from "../utils/config.js";

export const configCommand = new Command("config");

configCommand
  .command("set-token")
  .description("Linear API 토큰 저장")
  .argument("<token>", "Linear API token")
  .action((token) => {
    setToken(token);
    console.log("✅ 토큰이 저장되었습니다.");
  });

configCommand
  .command("set-team")
  .description("Linear 팀 ID 설정")
  .argument("<teamId>", "Linear 팀 ID")
  .action((teamId) => {
    setTeamId(teamId);
    console.log("✅ 팀 ID가 저장되었습니다.");
  });

configCommand
  .command("set-project")
  .description("Linear 프로젝트 ID 설정")
  .argument("<projectId>", "Linear 프로젝트 ID")
  .action((projectId) => {
    setProjectId(projectId);
    console.log("✅ 프로젝트 ID가 저장되었습니다.");
  });

configCommand
  .command("get")
  .description("현재 저장된 설정 출력")
  .action(() => {
    const config = getConfig();
    console.log("📦 현재 설정:");
    console.log(config);
  });
