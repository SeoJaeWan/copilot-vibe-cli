import { Command } from "commander";
import {
  getConfig,
  setToken,
  setTeamId,
  setProjectId,
  initWorkspace,
} from "../utils/config.js";
import { fetchLinearTeams, fetchLinearProjects } from "../services/linear.js";
import chalk from "chalk";

export const configCommand = new Command("config");

configCommand.description("Linear API 토큰 및 설정 관리 - Linear 연동을 위한 필수 설정");

configCommand
  .command("set-token")
  .description("Linear API 토큰 저장 (https://linear.app/settings/api에서 발급)")
  .argument("<token>", "Linear API token")
  .action((token) => {
    setToken(token);
    console.log("✅ 토큰이 저장되었습니다.");
  });

configCommand
  .command("set-team")
  .description("Linear 팀 ID 설정 (특정 팀의 이슈만 필터링)")
  .argument("<teamId>", "Linear 팀 ID")
  .action((teamId) => {
    setTeamId(teamId);
    console.log("✅ 팀 ID가 저장되었습니다.");
  });

configCommand
  .command("set-project")
  .description("Linear 프로젝트 ID 설정 (특정 프로젝트의 이슈만 필터링)")
  .argument("<projectId>", "Linear 프로젝트 ID")
  .action((projectId) => {
    setProjectId(projectId);
    console.log("✅ 프로젝트 ID가 저장되었습니다.");
  });

configCommand
  .command("get")
  .description("현재 저장된 설정 확인 (토큰, 팀ID, 프로젝트ID)")
  .action(() => {
    const config = getConfig();
    console.log("📦 현재 설정:");
    console.log(config);
  });

configCommand
  .command("projects")
  .description("현재 팀의 사용 가능한 프로젝트 목록 조회")
  .action(async () => {
    try {
      const config = getConfig();
      if (!config.teamId) {
        console.error("❌ 먼저 팀을 설정해주세요. `vibe config set-team <teamId>`");
        return;
      }
      
      const projects = await fetchLinearProjects(config.teamId);
      console.log(chalk.green("📋 사용 가능한 프로젝트 목록:\n"));
      projects.forEach((project, index) => {
        console.log(chalk.blue(`${index + 1}. ${project.name}`));
        console.log(chalk.gray(`   ID: ${project.id}`));
        if (project.description) {
          console.log(chalk.gray(`   설명: ${project.description}`));
        }
        console.log("");
      });
      console.log(chalk.yellow("💡 팁: 'vibe config set-project <ID>' 명령어로 프로젝트를 설정하세요"));
    } catch (e) {
      console.error((e as Error).message);
    }
  });

configCommand
  .command("init")
  .description("새 워크스페이스 초기화 (대화형)")
  .option("-n, --name <name>", "워크스페이스 이름")
  .option("-t, --team <teamId>", "팀 ID")
  .option("-p, --project <projectId>", "프로젝트 ID")
  .action(async (options) => {
    try {
      console.log(chalk.blue("🚀 새 워크스페이스 초기화를 시작합니다...\n"));
      
      // 토큰 확인
      const globalConfig = getConfig();
      if (!globalConfig.token) {
        console.error(chalk.red("❌ 먼저 API 토큰을 설정해주세요: `vibe config set-token <token>`"));
        return;
      }
      
      // 워크스페이스 이름
      const workspaceName = options.name || "default";
      
      // 팀 선택
      let teamId = options.team;
      if (!teamId) {
        const teams = await fetchLinearTeams();
        console.log(chalk.green("📋 사용 가능한 팀 목록:\n"));
        teams.forEach((team, index) => {
          console.log(chalk.blue(`${index + 1}. ${team.name} (${team.key})`));
          console.log(chalk.gray(`   ID: ${team.id}\n`));
        });
        console.log(chalk.yellow("위 목록에서 팀 ID를 복사하여 `vibe config init --team <ID>` 명령어를 다시 실행하세요"));
        return;
      }
      
      // 프로젝트 선택
      let projectId = options.project;
      if (!projectId) {
        const projects = await fetchLinearProjects(teamId);
        console.log(chalk.green("📋 사용 가능한 프로젝트 목록:\n"));
        projects.forEach((project, index) => {
          console.log(chalk.blue(`${index + 1}. ${project.name}`));
          console.log(chalk.gray(`   ID: ${project.id}\n`));
        });
        console.log(chalk.yellow("위 목록에서 프로젝트 ID를 복사하여 `vibe config init --team <팀ID> --project <프로젝트ID>` 명령어를 다시 실행하세요"));
        return;
      }
      
      // 워크스페이스 초기화 (토큰 제외)
      initWorkspace(workspaceName, teamId, projectId);
      
      console.log(chalk.green("✅ 워크스페이스가 성공적으로 초기화되었습니다!"));
      console.log(chalk.gray(`📁 설정 파일: ${process.cwd()}/.vibe-config.json`));
      console.log(chalk.blue("\n🔒 보안 정보:"));
      console.log(chalk.gray("  - API 토큰은 글로벌 설정에만 저장됩니다"));
      console.log(chalk.gray("  - 워크스페이스 설정에는 팀/프로젝트 정보만 포함됩니다"));
      console.log(chalk.blue("\n🎉 이제 다음 명령어들을 사용할 수 있습니다:"));
      console.log(chalk.gray("  - vibe linear list"));
      console.log(chalk.gray("  - vibe issue create --title '제목' --description '설명'"));
      console.log(chalk.gray("  - vibe copilot <issueId>"));
      
    } catch (e) {
      console.error((e as Error).message);
    }
  });
