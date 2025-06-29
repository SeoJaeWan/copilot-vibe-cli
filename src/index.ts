import {Command} from "commander";
import {linearCommand} from "./commands/linear.js";

const program = new Command();

program.name("vibe").description("🚀 Vibe Dev CLI - GitHub Copilot Chat과 vibe 코딩을 위한 생산성 극대화 도구").version("3.0.0");

program.addCommand(linearCommand);

program.parse();
