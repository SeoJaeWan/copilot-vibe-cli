import { Command } from "commander";
import { fetchLinearIssues } from "../services/linear.js";
import chalk from "chalk";
import { getConfig } from "../utils/config.js"; 

export const linearCommand = new Command("linear");

linearCommand
  .command("list")
  .description("Linear 이슈 목록을 출력합니다")
  .option("-l, --limit <number>", "불러올 이슈 개수", "10")
  .action(async (options) => {
    try {
      const limit = parseInt(options.limit, 10);
      const { teamId, projectId } = getConfig();

      if (teamId || projectId) {
        console.log(
          chalk.gray(`📂 필터: team = ${teamId ?? "전체"}, project = ${projectId ?? "전체"}`)
        );
        console.log(
            chalk.gray(`📊 이슈 개수 제한: ${limit}개`)
        );
      }

      const issues = await fetchLinearIssues(limit);

      if (issues.length === 0) {
        console.log("📭 등록된 이슈가 없습니다.");
        return;
      }

      console.log(chalk.green(`📝 Linear 이슈 목록 (${issues.length}개):\n`));
      issues.forEach((issue, index) => {
        console.log(
          chalk.blue(`${index + 1}. ${issue.title}`) +
            `\n   ID: ${issue.id}\n   상태: ${issue.state.name} | 작성일: ${new Date(issue.createdAt).toLocaleString()}\n`
        );
      });
    } catch (e) {
      console.error((e as Error).message);
    }
  });
