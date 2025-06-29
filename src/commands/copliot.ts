import { Command } from "commander";
import { fetchLinearIssueById } from "../services/linear.js";
import { spawn } from "child_process";
import { generateAgentFile } from "../utils/agentFile.js";
import clipboardy from "clipboardy";
import { execSync } from "child_process";

// Copilot CLI 설치 확인 함수
function isCopilotCliInstalled(): boolean {
  try {
    execSync("gh copilot --help", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

export const copilotCommand = new Command("copilot");

copilotCommand
  .command("copilot")
  .description("Linear 이슈 정보를 클립보드에 복사해 Copilot에 질문할 수 있게 합니다")
  .argument("<issueId>", "Linear issueId")
  .action(async (issueId, options) => {

    try {
      const issue = await fetchLinearIssueById(issueId);

      const copilotInput = {
        source: "linear" as const,
        id: issue.id,
        title: issue.title,
        description: issue.description,
      };

      generateAgentFile(process.cwd(), copilotInput);

      // 이슈 정보를 클립보드에 복사할 텍스트 생성
      const clipboardText = `Linear 이슈: ${issue.title}

설명: ${issue.description || '설명 없음'}

ID: ${issue.id}

이 이슈에 대해 어떻게 해결해야 할까요?`;

      // 클립보드에 복사
      await clipboardy.write(clipboardText);
      
      console.log("📋 Linear 이슈 정보:");
      console.log(`  제목: ${issue.title}`);
      console.log(`  설명: ${issue.description || '설명 없음'}`);
      console.log(`  ID: ${issue.id}`);
      console.log("");
      console.log("✅ 이슈 정보가 클립보드에 복사되었습니다!");
      console.log("💡 이제 Copilot에 붙여넣기(Ctrl+V)해서 질문하세요.");
    } catch (e) {
      console.error((e as Error).message);
    }
  });
