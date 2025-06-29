import { getConfig } from "../utils/config.js";

const ENDPOINT = "https://api.linear.app/graphql";

export async function fetchLinearIssues(limit = 10) {
  const { token, teamId, projectId } = getConfig();

  if (!token) {
    throw new Error("❌ Linear API 토큰이 설정되어 있지 않습니다. `vibe config set <token>` 으로 먼저 설정해주세요.");
  }

  const filters = [];

  if (teamId) filters.push(`team: { id: "${teamId}" }`);
  if (projectId) filters.push(`project: { id: "${projectId}" }`);

  const filterQuery = filters.length > 0 ? `filter: { ${filters.join(", ")} }` : "";

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query {
          issues(first: ${limit}, ${filterQuery}) {
            nodes {
              id
              title
              state {
                name
              }
              createdAt
            }
          }
        }
      `,
    }),
  });

  const json = await res.json();

  if (json.errors) {
    throw new Error(`GraphQL 오류: ${JSON.stringify(json.errors)}`);
  }

  return json.data.issues.nodes as {
    id: string;
    title: string;
    state: { name: string };
    createdAt: string;
  }[];
}

export async function fetchLinearIssueById(id: string) {
  const { token } = getConfig();
  if (!token) throw new Error("❌ Linear API 토큰이 설정되지 않았습니다.");

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query {
          issue(id: "${id}") {
            id
            title
            description
            state { name }
          }
        }
      `,
    }),
  });

  const json = await res.json();
  if (!json.data.issue) throw new Error(`❌ 해당 ID의 이슈를 찾을 수 없습니다: ${id}`);

  return json.data.issue as {
    id: string;
    title: string;
    description: string;
    state: { name: string };
  };
}

export async function createLinearIssue(title: string, description: string) {
  const { token, teamId, projectId } = getConfig();

  if (!token || !teamId) {
    throw new Error("❌ 토큰 또는 teamId가 설정되지 않았습니다. `vibe config`로 먼저 설정해주세요.");
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        mutation {
          issueCreate(
            input: {
              title: "${title}"
              description: "${description}"
              teamId: "${teamId}"
              ${projectId ? `projectId: "${projectId}"` : ""}
            }
          ) {
            success
            issue {
              id
              identifier
              title
            }
          }
        }
      `,
    }),
  });

  const json = await res.json();
  if (!json.data.issueCreate.success) {
    throw new Error("❌ 이슈 생성에 실패했습니다.");
  }

  return json.data.issueCreate.issue;
}
