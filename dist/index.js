"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const config_1 = require("./commands/config");
const copliot_1 = require("./commands/copliot");
const issue_1 = require("./commands/issue");
const program = new commander_1.Command();
program
    .name("vibe")
    .description("🚀 Linear Vibe CLI - Linear 이슈 관리와 GitHub Copilot 연동으로 개발 생산성을 극대화")
    .version("2.0.0");
program.addCommand(config_1.configCommand);
program.addCommand(copliot_1.copilotCommand);
program.addCommand(issue_1.issueCommand);
program.parse();
