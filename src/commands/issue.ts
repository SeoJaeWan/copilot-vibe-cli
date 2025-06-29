import { Command } from "commander";
import { createLinearIssue, fetchLinearIssues } from "../services/linear.js";
import chalk from "chalk";

export const issueCommand = new Command("issue");

issueCommand.description("Linear 이슈 관리 - 이슈 조회, 생성 및 관리");

issueCommand
  .command("list")
  .description("Linear 이슈 목록 조회 (설정된 팀/프로젝트 기준)")
  .option("--limit <number>", "조회할 이슈 개수 (기본: 10)", "10")
  .action(async (options) => {
    try {
      const limit = parseInt(options.limit);
      const issues = await fetchLinearIssues(limit);

      if (issues.length === 0) {
        console.log(chalk.yellow("📭 조건에 맞는 이슈가 없습니다."));
        return;
      }

      console.log(chalk.blue(`\n📋 Linear 이슈 목록 (최대 ${limit}개):\n`));
      
      issues.forEach((issue, index) => {
        const stateColor = issue.state.name === "Done" ? "green" : 
                          issue.state.name === "In Progress" ? "yellow" : "gray";
        
        console.log(`${chalk.blue(`${index + 1}.`)} ${chalk.bold(issue.title)}`);
        console.log(`   ${chalk.gray(`ID: ${issue.id}`)}`);
        if (issue.identifier) {
          console.log(`   ${chalk.cyan(`Identifier: ${issue.identifier}`)}`);
        }
        console.log(`   ${chalk[stateColor](`상태: ${issue.state.name}`)}`);
        console.log(`   ${chalk.gray(`생성일: ${new Date(issue.createdAt).toLocaleDateString('ko-KR')}`)}`);
        console.log("");
      });
      
      console.log(chalk.yellow("💡 팁: 'vibe copilot <issueId>' 명령어로 이슈 정보를 AI와 공유할 수 있습니다"));
    } catch (e) {
      console.error(chalk.red((e as Error).message));
    }
  });

issueCommand
  .command("create")
  .description("Linear에 새 이슈를 생성합니다 (팀ID/프로젝트ID 필수 설정)")
  .requiredOption("--title <title>", "이슈 제목")
  .requiredOption("--description <description>", "이슈 설명")
  .action(async (options) => {
    try {
      const issue = await createLinearIssue(options.title, options.description);

      console.log(chalk.green("✅ 이슈가 성공적으로 생성되었습니다."));
      console.log(`📌 ID: ${issue.id}`);
      console.log(`🔖 Identifier: ${issue.identifier}`);
      console.log(`📝 Title: ${issue.title}`);
    } catch (e) {
      console.error(chalk.red((e as Error).message));
    }
  });
