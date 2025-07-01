import {Command} from "commander";
import {getConfig, setToken, setTeamId, setProjectId, initWorkspace} from "../utils/config.js";
import {
    fetchLinearTeams,
    fetchLinearProjects,
    fetchLinearIssues,
    createLinearIssue,
    fetchLinearIssueById,
    fetchLinearIssueByIdOrIdentifier
} from "../services/linear.js";
import {t} from "../utils/locale.js";
import chalk from "chalk";

export const linearCommand = new Command("linear");

linearCommand.description(t().linear.description);

// ============ 토큰 관리 (Top-level) ============
linearCommand
    .command("set-token")
    .description(t().linear.config.setToken.description)
    .argument("<token>", t().linear.config.setToken.argument)
    .action(token => {
        setToken(token);
        console.log(chalk.green(t().linear.config.setToken.success));
    });

linearCommand
    .command("set-team")
    .description(t().linear.config.setTeam.description)
    .argument("<teamId>", t().linear.config.setTeam.argument)
    .action(teamId => {
        setTeamId(teamId);
        console.log(chalk.green(t().linear.config.setTeam.success));
    });

linearCommand
    .command("set-project")
    .description(t().linear.config.setProject.description)
    .argument("<projectId>", t().linear.config.setProject.argument)
    .action(projectId => {
        setProjectId(projectId);
        console.log(chalk.green(t().linear.config.setProject.success));
    });

linearCommand
    .command("get-config")
    .description(t().linear.config.get.description)
    .action(() => {
        const config = getConfig();
        const locale = t();
        console.log(chalk.blue(locale.linear.config.get.currentSettings));
        console.log(
            chalk.gray(`  ${locale.linear.config.get.token} ${config.token ? locale.linear.config.get.configured : locale.linear.config.get.notConfigured}`)
        );
        console.log(chalk.gray(`  ${locale.linear.config.get.teamId} ${config.teamId || locale.linear.config.get.notConfigured}`));
        console.log(chalk.gray(`  ${locale.linear.config.get.projectId} ${config.projectId || locale.linear.config.get.notConfigured}`));
        console.log(chalk.gray(`  ${locale.linear.config.get.workspace} ${config.workspaceName || locale.linear.config.get.default}`));
    });

linearCommand
    .command("teams")
    .description(t().linear.config.teams.description)
    .action(async () => {
        try {
            const teams = await fetchLinearTeams();
            const locale = t();
            console.log(chalk.green(locale.linear.config.teams.title));
            teams.forEach((team, index) => {
                console.log(chalk.blue(`${index + 1}. ${team.name} (${team.key})`));
                console.log(chalk.gray(`   ID: ${team.id}\n`));
            });
            console.log(chalk.yellow(locale.linear.config.teams.tip));
        } catch (e) {
            const locale = t();
            console.error(chalk.red(locale.linear.config.teams.noToken));
        }
    });

linearCommand
    .command("projects")
    .description(t().linear.config.projects.description)
    .action(async () => {
        try {
            const config = getConfig();
            const locale = t();
            if (!config.teamId) {
                console.error(chalk.red(locale.linear.config.projects.noTeam));
                return;
            }

            const projects = await fetchLinearProjects(config.teamId);
            console.log(chalk.green(locale.linear.config.projects.title));
            projects.forEach((project, index) => {
                console.log(chalk.blue(`${index + 1}. ${project.name}`));
                console.log(chalk.gray(`   ID: ${project.id}`));
                if (project.description) {
                    console.log(chalk.gray(`   ${locale.linear.config.projects.descriptionLabel} ${project.description}`));
                }
                console.log("");
            });
            console.log(chalk.yellow(locale.linear.config.projects.tip));
        } catch (e) {
            const locale = t();
            console.error(chalk.red(locale.linear.errors.graphqlError.replace("{error}", (e as Error).message)));
        }
    });

linearCommand
    .command("init")
    .description(t().linear.config.init.description)
    .option("-n, --name <n>", t().linear.config.init.options.name)
    .option("-t, --team <teamId>", t().linear.config.init.options.team)
    .option("-p, --project <projectId>", t().linear.config.init.options.project)
    .action(async options => {
        try {
            const locale = t();
            console.log(chalk.blue(locale.linear.config.init.starting));

            // 토큰 확인
            const globalConfig = getConfig();
            if (!globalConfig.token) {
                console.error(chalk.red(locale.linear.config.init.noToken));
                return;
            }

            // 워크스페이스 이름
            const workspaceName = options.name || "default";

            // 팀 선택
            let teamId = options.team;
            if (!teamId) {
                const teams = await fetchLinearTeams();
                console.log(chalk.green(locale.linear.config.init.availableTeams));
                teams.forEach((team, index) => {
                    console.log(chalk.blue(`${index + 1}. ${team.name} (${team.key})`));
                    console.log(chalk.gray(`   ID: ${team.id}\n`));
                });
                console.log(chalk.yellow(locale.linear.config.init.teamInstruction));
                return;
            }

            // 프로젝트 선택
            let projectId = options.project;
            if (!projectId && teamId) {
                const projects = await fetchLinearProjects(teamId);
                console.log(chalk.green(locale.linear.config.init.availableProjects));
                projects.forEach((project, index) => {
                    console.log(chalk.blue(`${index + 1}. ${project.name}`));
                    console.log(chalk.gray(`   ID: ${project.id}\n`));
                });
                console.log(chalk.yellow(locale.linear.config.init.projectInstruction));
                return;
            } // 워크스페이스 초기화
            initWorkspace(workspaceName, teamId, projectId);

            console.log(chalk.green(locale.linear.config.init.success));
            console.log(chalk.gray(locale.linear.config.init.configFile.replace("{path}", process.cwd())));
            console.log(chalk.blue(`\n${locale.linear.config.init.nextSteps}`));
            locale.linear.config.init.commands.forEach(command => {
                console.log(chalk.gray(`  - ${command}`));
            });
        } catch (e) {
            const locale = t();
            console.error(chalk.red(locale.linear.errors.graphqlError.replace("{error}", (e as Error).message)));
        }
    });

// ============ 이슈 목록 조회 ============
linearCommand
    .command("list")
    .description(t().linear.issue.list.description)
    .option("--limit <number>", t().linear.issue.list.option, "10")
    .action(async options => {
        try {
            const limit = parseInt(options.limit);
            const issues = await fetchLinearIssues(limit);
            const locale = t();

            if (issues.length === 0) {
                console.log(chalk.yellow(locale.linear.issue.list.noIssues));
                return;
            }

            console.log(chalk.blue(locale.linear.issue.list.title.replace("{limit}", limit.toString())));
            issues.forEach((issue, index) => {
                const stateColor = issue.state.name === "Done" ? "green" : issue.state.name === "In Progress" ? "yellow" : "gray";

                console.log(`${chalk.blue(`${index + 1}.`)} ${chalk.bold(issue.title)}`);
                console.log(`   ${chalk.gray(`ID: ${issue.id}`)}`);
                if (issue.identifier) {
                    console.log(`   ${chalk.cyan(`Identifier: ${issue.identifier}`)}`);
                }
                console.log(`   ${chalk[stateColor](`${locale.linear.issue.list.status} ${issue.state.name}`)}`);
                console.log(`   ${chalk.gray(`${locale.linear.issue.list.createdAt} ${new Date(issue.createdAt).toLocaleDateString("ko-KR")}`)}`);
                console.log("");
            });

            console.log(chalk.yellow(locale.linear.issue.list.tip));
        } catch (e) {
            const locale = t();
            console.error(chalk.red(locale.linear.errors.graphqlError.replace("{error}", (e as Error).message)));
        }
    });

// ============ 이슈 생성 ============
linearCommand
    .command("create")
    .description(t().linear.issue.create.description)
    .requiredOption("--title <title>", t().linear.issue.create.options.title)
    .requiredOption("--description <description>", t().linear.issue.create.options.description)
    .action(async options => {
        try {
            const issue = await createLinearIssue(options.title, options.description);
            const locale = t();

            console.log(chalk.green(locale.linear.issue.create.success));
            console.log(chalk.gray(`📌 ID: ${issue.id}`));
            console.log(chalk.gray(`🔖 Identifier: ${issue.identifier}`));
            console.log(chalk.gray(`📝 Title: ${issue.title}`));
            console.log(chalk.yellow(`\n${locale.linear.issue.create.tip.replace("{title}", issue.title.replace(/"/g, '\\"'))}`));
        } catch (e) {
            const locale = t();
            console.error(chalk.red(locale.linear.errors.graphqlError.replace("{error}", (e as Error).message)));
        }
    });

// ============ 이슈 상세 보기 ============
// 이슈 상세 보기 - ID와 Identifier 모두 지원
linearCommand
    .command("issue")
    .argument("<issueIdOrIdentifier>", t().linear.issue.view.argument)
    .description(t().linear.issue.view.description)
    .action(async (issueIdOrIdentifier: string) => {
        try {
            const issue = await fetchLinearIssueByIdOrIdentifier(issueIdOrIdentifier);
            const locale = t();

            // AI Agent가 볼 수 있도록 구조화된 이슈 정보 출력
            console.log(chalk.blue(locale.linear.copilotIssue.issueInfo));
            console.log(chalk.blue("=" + "=".repeat(50)));
            console.log(chalk.green(`📌 ${locale.linear.copilotIssue.issueTitle} ${issue.title}`));
            console.log(chalk.gray(`🆔 ID: ${issue.id}`));
            if (issue.identifier) {
                console.log(chalk.cyan(`🔖 Identifier: ${issue.identifier}`));
            }
            console.log(chalk.yellow(`📊 ${locale.linear.copilotIssue.issueStatus} ${issue.state.name}`));

            console.log("");
            console.log(chalk.blue(`📝 ${locale.linear.copilotIssue.issueDescription}`));
            console.log(chalk.white(issue.description || locale.linear.copilotIssue.noDescription));
            console.log(chalk.blue("=" + "=".repeat(50)));

            console.log("");
            console.log(chalk.green(locale.linear.copilotIssue.success));
            console.log(chalk.yellow(locale.linear.copilotIssue.instruction));
        } catch (e) {
            const locale = t();
            console.error(chalk.red(locale.linear.errors.graphqlError.replace("{error}", (e as Error).message)));
        }
    });
