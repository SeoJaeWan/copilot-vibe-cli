import { Command } from "commander";
import { createLinearIssue } from "../services/linear.js";
import chalk from "chalk";

export const issueCommand = new Command("issue");

issueCommand.description("Linear 이슈 생성 - 새로운 이슈를 빠르게 생성");

issueCommand
  .command("create")
  .description("Linear에 새 이슈를 생성합니다 (팀ID 필수 설정)")
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
      console.error((e as Error).message);
    }
  });
