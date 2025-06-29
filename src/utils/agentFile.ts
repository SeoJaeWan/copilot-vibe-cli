import fs from "fs";
import path from "path";

interface AgentIssue {
  source: "linear";
  id: string;
  title: string;
  description: string;
}

interface AgentFile {
  goal: string;
  context: {
    issue: AgentIssue;
  };
}

/**
 * agent.json을 지정한 경로에 생성합니다
 * @param outputPath agent.json 파일이 저장될 디렉토리
 * @param issue Linear 이슈 정보
 */
export function generateAgentFile(
  outputPath: string,
  issue: AgentIssue
) {
  const agent: AgentFile = {
    goal: issue.title,
    context: { issue },
  };

  const target = path.join(outputPath, "agent.json");
  fs.writeFileSync(target, JSON.stringify(agent, null, 2));
  console.log(`✅ agent.json 생성 완료 → ${target}`);
}
