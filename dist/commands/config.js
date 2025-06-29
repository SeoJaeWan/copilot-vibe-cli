"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configCommand = void 0;
const commander_1 = require("commander");
const config_js_1 = require("../utils/config.js");
exports.configCommand = new commander_1.Command("config");
exports.configCommand
    .command("set-token")
    .description("Linear API 토큰 저장")
    .argument("<token>", "Linear API token")
    .action((token) => {
    (0, config_js_1.setToken)(token);
    console.log("✅ 토큰이 저장되었습니다.");
});
exports.configCommand
    .command("set-team")
    .description("Linear 팀 ID 설정")
    .argument("<teamId>", "Linear 팀 ID")
    .action((teamId) => {
    (0, config_js_1.setTeamId)(teamId);
    console.log("✅ 팀 ID가 저장되었습니다.");
});
exports.configCommand
    .command("set-project")
    .description("Linear 프로젝트 ID 설정")
    .argument("<projectId>", "Linear 프로젝트 ID")
    .action((projectId) => {
    (0, config_js_1.setProjectId)(projectId);
    console.log("✅ 프로젝트 ID가 저장되었습니다.");
});
exports.configCommand
    .command("get")
    .description("현재 저장된 설정 출력")
    .action(() => {
    const config = (0, config_js_1.getConfig)();
    console.log("📦 현재 설정:");
    console.log(config);
});
