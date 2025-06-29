import { Command } from "commander";
import { configCommand } from "./commands/config";
import { copilotCommand } from "./commands/copliot";
import { issueCommand } from "./commands/issue";

const program = new Command();

program
  .name("vibe")
  .description("🚀 Linear Vibe CLI - Linear 이슈 관리와 GitHub Copilot 연동으로 개발 생산성을 극대화")
  .version("2.0.0");

program.addCommand(configCommand);
program.addCommand(copilotCommand);
program.addCommand(issueCommand);

program.parse();
