import { Command } from "commander";
import { configCommand } from "./commands/config";
import { linearCommand } from "./commands/linear";
import { copilotCommand } from "./commands/copliot";

const program = new Command();

program
  .name("vibe")
  .description("Vibe CLI - Linear와 Copilot을 연결해줍니다")
  .version("1.0.0");

program.addCommand(configCommand);
program.addCommand(linearCommand);
program.addCommand(copilotCommand);

program.parse();
