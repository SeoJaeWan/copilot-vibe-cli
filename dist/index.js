"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const config_1 = require("./commands/config");
const linear_1 = require("./commands/linear");
const copliot_1 = require("./commands/copliot");
const issue_1 = require("./commands/issue");
const program = new commander_1.Command();
program
    .name("vibe")
    .description("Vibe CLI - Linear와 Copilot을 연결해줍니다")
    .version("1.0.0");
program.addCommand(config_1.configCommand);
program.addCommand(linear_1.linearCommand);
program.addCommand(copliot_1.copilotCommand);
program.addCommand(issue_1.issueCommand);
program.parse();
