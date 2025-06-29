"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const config_1 = require("./commands/config");
const program = new commander_1.Command();
program
    .name("vibe")
    .description("Vibe CLI - Linear와 Copilot을 연결해줍니다")
    .version("1.0.0");
program.addCommand(config_1.configCommand);
program
    .command("hello")
    .description("테스트 명령어")
    .action(() => {
    console.log("Hello from vibe-cli!");
});
program.parse();
