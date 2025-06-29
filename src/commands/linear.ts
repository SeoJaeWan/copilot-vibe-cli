import {Command} from "commander";
import {getConfig, setToken, setTeamId, setProjectId, initWorkspace} from "../utils/config.js";
import {fetchLinearTeams, fetchLinearProjects, fetchLinearIssues, createLinearIssue, fetchLinearIssueById} from "../services/linear.js";
import {generateAgentFile} from "../utils/agentFile.js";
import clipboardy from "clipboardy";
import chalk from "chalk";

export const linearCommand = new Command("linear");

linearCommand.description("🔗 Linear 통합 관리 - 설정, 이슈, Copilot 연동을 한 곳에서");

// ============ 설정 관리 ============
const configSubCommand = linearCommand.command("config").description("Linear API 토큰 및 설정 관리");

configSubCommand
    .command("set-token")
    .description("Linear API 토큰 저장 (https://linear.app/settings/api에서 발급)")
    .argument("<token>", "Linear API token")
    .action(token => {
        setToken(token);
        console.log(chalk.green("✅ 토큰이 저장되었습니다."));
    });

configSubCommand
    .command("set-team")
    .description("Linear 팀 ID 설정")
    .argument("<teamId>", "Linear 팀 ID")
    .action(teamId => {
        setTeamId(teamId);
        console.log(chalk.green("✅ 팀 ID가 저장되었습니다."));
    });

configSubCommand
    .command("set-project")
    .description("Linear 프로젝트 ID 설정")
    .argument("<projectId>", "Linear 프로젝트 ID")
    .action(projectId => {
        setProjectId(projectId);
        console.log(chalk.green("✅ 프로젝트 ID가 저장되었습니다."));
    });

configSubCommand
    .command("get")
    .description("현재 저장된 설정 확인")
    .action(() => {
        const config = getConfig();
        console.log(chalk.blue("📦 현재 Linear 설정:"));
        console.log(chalk.gray("  토큰:", config.token ? "설정됨" : "미설정"));
        console.log(chalk.gray("  팀 ID:", config.teamId || "미설정"));
        console.log(chalk.gray("  프로젝트 ID:", config.projectId || "미설정"));
        console.log(chalk.gray("  워크스페이스:", config.workspaceName || "기본"));
    });

configSubCommand
    .command("teams")
    .description("사용 가능한 팀 목록 조회")
    .action(async () => {
        try {
            const teams = await fetchLinearTeams();
            console.log(chalk.green("📋 사용 가능한 팀 목록:\n"));
            teams.forEach((team, index) => {
                console.log(chalk.blue(`${index + 1}. ${team.name} (${team.key})`));
                console.log(chalk.gray(`   ID: ${team.id}\n`));
            });
            console.log(chalk.yellow("💡 팁: 'vibe linear config set-team <ID>' 명령어로 팀을 설정하세요"));
        } catch (e) {
            console.error(chalk.red((e as Error).message));
        }
    });

configSubCommand
    .command("projects")
    .description("현재 팀의 사용 가능한 프로젝트 목록 조회")
    .action(async () => {
        try {
            const config = getConfig();
            if (!config.teamId) {
                console.error(chalk.red("❌ 먼저 팀을 설정해주세요. `vibe linear config set-team <teamId>`"));
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
            console.log(chalk.yellow("💡 팁: 'vibe linear config set-project <ID>' 명령어로 프로젝트를 설정하세요"));
        } catch (e) {
            console.error(chalk.red((e as Error).message));
        }
    });

configSubCommand
    .command("init")
    .description("새 워크스페이스 초기화 (대화형)")
    .option("-n, --name <name>", "워크스페이스 이름")
    .option("-t, --team <teamId>", "팀 ID")
    .option("-p, --project <projectId>", "프로젝트 ID")
    .action(async options => {
        try {
            console.log(chalk.blue("🚀 Linear 워크스페이스 초기화를 시작합니다...\n"));

            // 토큰 확인
            const globalConfig = getConfig();
            if (!globalConfig.token) {
                console.error(chalk.red("❌ 먼저 API 토큰을 설정해주세요: `vibe linear config set-token <token>`"));
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
                console.log(chalk.yellow("위 목록에서 팀 ID를 복사하여 `vibe linear config init --team <ID>` 명령어를 다시 실행하세요"));
                return;
            }

            // 프로젝트 선택
            let projectId = options.project;
            if (!projectId && teamId) {
                const projects = await fetchLinearProjects(teamId);
                console.log(chalk.green("📋 사용 가능한 프로젝트 목록:\n"));
                projects.forEach((project, index) => {
                    console.log(chalk.blue(`${index + 1}. ${project.name}`));
                    console.log(chalk.gray(`   ID: ${project.id}\n`));
                });
                console.log(
                    chalk.yellow("위 목록에서 프로젝트 ID를 복사하여 `vibe linear config init --team <팀ID> --project <프로젝트ID>` 명령어를 다시 실행하세요")
                );
                return;
            }

            // 워크스페이스 초기화
            initWorkspace(workspaceName, teamId, projectId);

            console.log(chalk.green("✅ Linear 워크스페이스가 성공적으로 초기화되었습니다!"));
            console.log(chalk.gray(`📁 설정 파일: ${process.cwd()}/.vibe-config.json`));
            console.log(chalk.blue("\n🎉 이제 다음 명령어들을 사용할 수 있습니다:"));
            console.log(chalk.gray("  - vibe linear issue list"));
            console.log(chalk.gray("  - vibe linear issue create --title '제목' --description '설명'"));
            console.log(chalk.gray("  - vibe linear copilot <issueId>"));
        } catch (e) {
            console.error(chalk.red((e as Error).message));
        }
    });

// ============ 이슈 관리 ============
const issueSubCommand = linearCommand.command("issue").description("Linear 이슈 관리");

issueSubCommand
    .command("list")
    .description("Linear 이슈 목록 조회")
    .option("--limit <number>", "조회할 이슈 개수 (기본: 10)", "10")
    .action(async options => {
        try {
            const limit = parseInt(options.limit);
            const issues = await fetchLinearIssues(limit);

            if (issues.length === 0) {
                console.log(chalk.yellow("📭 조건에 맞는 이슈가 없습니다."));
                return;
            }

            console.log(chalk.blue(`\n📋 Linear 이슈 목록 (최대 ${limit}개):\n`));

            issues.forEach((issue, index) => {
                const stateColor = issue.state.name === "Done" ? "green" : issue.state.name === "In Progress" ? "yellow" : "gray";

                console.log(`${chalk.blue(`${index + 1}.`)} ${chalk.bold(issue.title)}`);
                console.log(`   ${chalk.gray(`ID: ${issue.id}`)}`);
                if (issue.identifier) {
                    console.log(`   ${chalk.cyan(`Identifier: ${issue.identifier}`)}`);
                }
                console.log(`   ${chalk[stateColor](`상태: ${issue.state.name}`)}`);
                console.log(`   ${chalk.gray(`생성일: ${new Date(issue.createdAt).toLocaleDateString("ko-KR")}`)}`);
                console.log("");
            });

            console.log(chalk.yellow("💡 팁: 'vibe linear copilot <issueId>' 명령어로 이슈 정보를 AI와 공유할 수 있습니다"));
        } catch (e) {
            console.error(chalk.red((e as Error).message));
        }
    });

issueSubCommand
    .command("create")
    .description("Linear에 새 이슈를 생성합니다")
    .requiredOption("--title <title>", "이슈 제목")
    .requiredOption("--description <description>", "이슈 설명")
    .action(async options => {
        try {
            const issue = await createLinearIssue(options.title, options.description);

            console.log(chalk.green("✅ 이슈가 성공적으로 생성되었습니다."));
            console.log(chalk.gray(`📌 ID: ${issue.id}`));
            console.log(chalk.gray(`🔖 Identifier: ${issue.identifier}`));
            console.log(chalk.gray(`📝 Title: ${issue.title}`));
            console.log(chalk.yellow("\n💡 팁: 'vibe linear copilot " + issue.id + "' 명령어로 이 이슈를 AI와 공유할 수 있습니다"));
        } catch (e) {
            console.error(chalk.red((e as Error).message));
        }
    });

// ============ Copilot 연동 ============
linearCommand
    .command("copilot")
    .description("Linear 이슈 정보를 클립보드에 복사해 Copilot에 질문할 수 있게 합니다")
    .argument("<issueId>", "Linear 이슈 ID")
    .action(async issueId => {
        try {
            const issue = await fetchLinearIssueById(issueId);

            const copilotInput = {
                source: "linear" as const,
                id: issue.id,
                title: issue.title,
                description: issue.description
            };

            generateAgentFile(process.cwd(), copilotInput);

            // 이슈 정보를 클립보드에 복사할 텍스트 생성
            const clipboardText = `Linear 이슈: ${issue.title}

설명: ${issue.description || "설명 없음"}

ID: ${issue.id}

이 이슈에 대해 어떻게 해결해야 할까요?`; // 클립보드에 복사
            await clipboardy.write(clipboardText);

            console.log(chalk.blue("📋 Linear 이슈 정보:"));
            console.log(chalk.gray(`  제목: ${issue.title}`));
            console.log(chalk.gray(`  설명: ${issue.description || "설명 없음"}`));
            console.log(chalk.gray(`  ID: ${issue.id}`));
            console.log("");
            console.log(chalk.green("✅ 이슈 정보가 클립보드에 복사되었습니다!"));
            console.log(chalk.yellow("💡 이제 Copilot에 붙여넣기(Ctrl+V)해서 질문하세요."));
        } catch (e) {
            console.error(chalk.red((e as Error).message));
        }
    });
