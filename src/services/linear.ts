import { getConfig } from "../utils/config.js";

const ENDPOINT = "https://api.linear.app/graphql";

export async function fetchLinearIssues(limit = 10) {
  const { token, teamId, projectId } = getConfig();

  if (!token) {
    throw new Error("❌ Linear API 토큰이 설정되어 있지 않습니다. `vibe config set <token>` 으로 먼저 설정해주세요.");
  }

  const filters = [];

  filters.push(`team: { id: "${teamId}" }`);
  filters.push(`project: { id: "${projectId}" }`);

  const filterQuery = filters.length > 0 ? `filter: { ${filters.join(", ")} }` : "";

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: token,
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
      Authorization: token,
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

  if (!token || !teamId || !projectId) {
    throw new Error("❌ 토큰 또는 teamId, projectId가 설정되지 않았습니다. `vibe config`로 먼저 설정해주세요.");
  }

  // 입력값을 안전하게 이스케이프 처리
  const variables = {
    title,
    description,
    teamId,
    ...(projectId && { projectId })
  };

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        mutation CreateIssue($title: String!, $description: String!, $teamId: String!, $projectId: String) {
          issueCreate(
            input: {
              title: $title
              description: $description
              teamId: $teamId
              projectId: $projectId
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
      variables
    }),
  });

  const json = await res.json();
  
  if (json.errors) {
    console.error("GraphQL Errors:", json.errors);
    throw new Error(`❌ GraphQL 오류: ${JSON.stringify(json.errors)}`);
  }
  
  if (!json.data) {
    console.error("No data in response:", json);
    throw new Error("❌ API 응답에 데이터가 없습니다.");
  }
  
  if (!json.data.issueCreate) {
    console.error("No issueCreate in response:", json.data);
    throw new Error("❌ 이슈 생성 응답이 올바르지 않습니다.");
  }
  
  if (!json.data.issueCreate.success) {
    throw new Error("❌ 이슈 생성에 실패했습니다.");
  }

  return json.data.issueCreate.issue;
}

export async function fetchLinearTeams() {
  const { token } = getConfig();
  if (!token) throw new Error("❌ Linear API 토큰이 설정되지 않았습니다.");

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query {
          teams {
            nodes {
              id
              name
              key
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

  return json.data.teams.nodes as {
    id: string;
    name: string;
    key: string;
  }[];
}

export async function fetchLinearProjects(teamId: string) {
  const { token } = getConfig();
  if (!token) throw new Error("❌ Linear API 토큰이 설정되지 않았습니다.");

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query {
          team(id: "${teamId}") {
            projects {
              nodes {
                id
                name
                description
              }
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

  return json.data.team.projects.nodes as {
    id: string;
    name: string;
    description: string;
  }[];
}
