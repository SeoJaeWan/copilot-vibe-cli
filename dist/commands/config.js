"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configCommand = void 0;
const commander_1 = require("commander");
const config_js_1 = require("../utils/config.js");
exports.configCommand = new commander_1.Command("config");
exports.configCommand
    .command("set")
    .description("Linear API 토큰 저장")
    .argument("<token>", "Linear API token")
    .action((token) => {
    (0, config_js_1.setToken)(token);
    console.log("✅ Linear API 토큰이 저장되었습니다.");
});
exports.configCommand
    .command("get")
    .description("저장된 Linear API 토큰 확인")
    .action(() => {
    const token = (0, config_js_1.getToken)();
    if (token) {
        console.log(`🔑 저장된 토큰: ${token}`);
    }
    else {
        console.log("❌ 저장된 토큰이 없습니다.");
    }
});
