# 🚀 Linear Vibe CLI

Linear 이슈를 CLI에서 효율적으로 관리하고 GitHub Copilot과 연동하여 생산성을 극대화하는 도구입니다.

[![npm version](https://badge.fury.io/js/linear-vibe-cli.svg)](https://badge.fury.io/js/linear-vibe-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ 주요 기능

- 📝 **Linear 이슈 관리**: CLI에서 Linear 이슈 목록 조회 및 생성
- 🤖 **Copilot 연동**: 이슈 정보를 클립보드에 복사하여 AI와 협업
- ⚙️ **간편한 설정**: API 토큰, 팀/프로젝트 필터링 지원
- 👥 **팀 관리**: 사용 가능한 Linear 팀 목록 조회 및 UUID 확인
- 🎨 **깔끔한 UI**: 컬러풀하고 직관적인 CLI 인터페이스
- ✨ **이슈 생성**: CLI에서 바로 새로운 Linear 이슈 생성
- 🗂️ **멀티 워크스페이스**: 프로젝트별로 다른 Linear 설정 지원

## 🔧 설치

```bash
npm install -g linear-vibe-cli
```

## 🚀 빠른 시작

### 방법 1: 워크스페이스 초기화 (권장)

한 번의 명령어로 프로젝트별 설정을 완료할 수 있습니다:

```bash
vibe config init
```

이 명령어는 다음 단계를 안내합니다:
1. 사용 가능한 팀 목록 표시
2. 선택한 팀의 프로젝트 목록 표시  
3. 현재 디렉토리에 `.vibe-config.json` 파일 생성

### 방법 2: 수동 설정

#### 1. Linear API 토큰 설정

[Linear 설정 페이지](https://linear.app/settings/api)에서 Personal API Key를 생성하고 설정합니다.

```bash
vibe config set-token YOUR_LINEAR_API_TOKEN
```

#### 2. 팀 설정 (필수)

먼저 사용 가능한 팀 목록을 확인합니다:

```bash
vibe config teams
```

출력된 팀 목록에서 원하는 팀의 ID를 복사하여 설정합니다:

```bash
vibe config set-team YOUR_TEAM_UUID
```

#### 3. 프로젝트 설정 (필수)

팀의 프로젝트 목록을 확인합니다:

```bash
vibe config projects
```

원하는 프로젝트 ID를 설정합니다:

```bash
vibe config set-project YOUR_PROJECT_UUID
```

### 3. 이슈 목록 확인

```bash
vibe linear list
```

### 4. 새 이슈 생성

```bash
vibe issue create --title "버그 수정" --description "로그인 오류 해결 필요"
```

### 5. Copilot과 연동

```bash
vibe copilot ISSUE_ID
```

## 🗂️ 멀티 워크스페이스 지원

각 프로젝트 디렉토리마다 다른 Linear 팀/프로젝트 설정을 가질 수 있습니다:

```bash
# 프로젝트 A 디렉토리
cd /path/to/project-a
vibe config init --name "Project A" --team <팀A_ID> --project <프로젝트A_ID>

# 프로젝트 B 디렉토리  
cd /path/to/project-b
vibe config init --name "Project B" --team <팀B_ID> --project <프로젝트B_ID>
```

### 🔒 보안 설계

이 CLI는 보안을 최우선으로 설계되었습니다:

- **API 토큰**: 
  - 글로벌 설정(`~/.vibe/config.json`)에만 저장
  - 워크스페이스별 설정 파일에는 절대 저장되지 않음
  - 홈 디렉토리의 숨겨진 폴더에 안전하게 보관

- **팀/프로젝트 설정**: 
  - 워크스페이스 설정(`.vibe-config.json`)에 저장
  - 민감하지 않은 정보만 포함 (팀 ID, 프로젝트 ID, 워크스페이스 이름)

- **Git 안전성**:
  - `.vibe-config.json`은 토큰을 포함하지 않으므로 **git에 안전하게 커밋 가능**
  - 팀원들과 프로젝트 설정을 공유할 수 있음
  - 각자 개별적으로 API 토큰만 설정하면 됨

설정은 각각 `.vibe-config.json` 파일에 저장되며, 상위 디렉토리에서 자동으로 찾아 적용됩니다.

## ⚠️ 중요 사항

### 필수 설정
- 이슈 생성을 위해서는 **API 토큰**, **팀 ID**, **프로젝트 ID**가 모두 설정되어야 합니다
- `vibe config init` 명령어로 한 번에 설정하는 것을 권장합니다

### 팀/프로젝트 ID 형식
- Linear에서는 팀 ID와 프로젝트 ID가 **UUID 형식**이어야 합니다
- `vibe config teams` 및 `vibe config projects` 명령어로 정확한 UUID를 확인하세요

### API 토큰
- Linear API 토큰은 [https://linear.app/settings/api](https://linear.app/settings/api)에서 발급받으세요
- 토큰은 **Bearer 접두사 없이** 저장됩니다

### 워크스페이스 우선순위
- 현재 디렉토리부터 상위로 `.vibe-config.json` 파일을 찾아 사용합니다
- 워크스페이스 설정이 없으면 글로벌 설정(`~/.vibe/config.json`)을 사용합니다

## 📚 사용법

### 설정 관리

```bash
# 워크스페이스 초기화 (권장)
vibe config init

# API 토큰 설정
vibe config set-token <token>

# 사용 가능한 팀 목록 조회
vibe config teams

# 팀 ID 설정 (UUID 형식)
vibe config set-team <teamId>

# 현재 팀의 프로젝트 목록 조회
vibe config projects

# 프로젝트 ID 설정 (UUID 형식)  
vibe config set-project <projectId>

# 현재 설정 확인
vibe config get
```

### Linear 이슈 관리

```bash
# 이슈 목록 조회 (기본 10개)
vibe linear list

# 특정 개수만큼 조회
vibe linear list --limit 20
vibe linear list -l 5

# 새 이슈 생성
vibe issue create --title "이슈 제목" --description "이슈 설명"
```

### Copilot 연동

```bash
# 이슈 정보를 클립보드에 복사
vibe copilot <issueId>
```

이 명령어를 실행하면:
1. 🔍 Linear에서 이슈 정보를 가져옵니다
2. 📋 이슈 정보가 클립보드에 복사됩니다
3. 🤖 GitHub Copilot, ChatGPT 등에 붙여넣기하여 질문할 수 있습니다

## 🎯 사용 예시

### 워크스페이스 초기화
```bash
$ vibe config init

🚀 새 워크스페이스 초기화를 시작합니다...

📋 사용 가능한 팀 목록:

1. Development Team (DEV)
   ID: 14081825-2bd2-41ca-af36-49d11e307ef9

2. Design Team (DES)
   ID: 25192936-3ce3-52db-bf47-5ae22f418f0a

위 목록에서 팀 ID를 복사하여 `vibe init --team <ID>` 명령어를 다시 실행하세요

$ vibe config init --team 14081825-2bd2-41ca-af36-49d11e307ef9

📋 사용 가능한 프로젝트 목록:

1. Frontend App
   ID: 9f811d29-6c63-4ea0-bb5c-c93e6d9031e3

2. Backend API
   ID: 8e722c18-5b52-3df9-aa4b-b82d5c8020d2

위 목록에서 프로젝트 ID를 복사하여 `vibe init --team <팀ID> --project <프로젝트ID>` 명령어를 다시 실행하세요

$ vibe config init --team 14081825-2bd2-41ca-af36-49d11e307ef9 --project 9f811d29-6c63-4ea0-bb5c-c93e6d9031e3 --name "frontend-project"

✅ 워크스페이스가 성공적으로 초기화되었습니다!
📁 설정 파일: /path/to/project/.vibe-config.json
```

### 팀 목록 조회 및 설정
```bash
$ vibe config teams

📋 사용 가능한 팀 목록:

1. Development Team (DEV)
   ID: 14081825-2bd2-41ca-af36-49d11e307ef9

2. Design Team (DES)
   ID: 25192936-3ce3-52db-bf47-5ae22f418f0a

💡 팁: 'vibe config set-team <ID>' 명령어로 팀을 설정하세요

$ vibe config set-team 14081825-2bd2-41ca-af36-49d11e307ef9
✅ 팀 ID가 저장되었습니다.
```

### 이슈 목록 조회
```bash
$ vibe linear list

📂 필터: team = DEV, project = Frontend
📊 이슈 개수 제한: 10개

📝 Linear 이슈 목록 (3개):

1. 로그인 페이지 반응형 UI 개선
   ID: DEV-123
   상태: In Progress | 작성일: 2025-06-29 10:30:00

2. API 에러 핸들링 로직 추가
   ID: DEV-124  
   상태: Todo | 작성일: 2025-06-29 09:15:00

3. 사용자 프로필 이미지 업로드 기능
   ID: DEV-125
   상태: Done | 작성일: 2025-06-28 16:45:00
```

### 이슈 생성
```bash
$ vibe issue create --title "로그인 버그 수정" --description "사용자가 로그인할 때 무한 로딩 발생"

✅ 이슈가 성공적으로 생성되었습니다.
📌 ID: 01J1234567890ABCDEF123456
🔖 Identifier: DEV-126
📝 Title: 로그인 버그 수정
```

### Copilot 연동
```bash
$ vibe copilot DEV-123

📋 Linear 이슈 정보:
  제목: 로그인 페이지 반응형 UI 개선
  설명: 모바일 환경에서 로그인 폼이 깨지는 문제 수정 필요
  ID: DEV-123

✅ 이슈 정보가 클립보드에 복사되었습니다!
💡 이제 Copilot에 붙여넣기(Ctrl+V)해서 질문하세요.
```

## ⚙️ 구성 파일

### 워크스페이스 설정 (`.vibe-config.json`)
각 프로젝트 디렉토리에 생성되는 설정 파일:

```json
{
  "workspaceName": "frontend-project",
  "teamId": "14081825-2bd2-41ca-af36-49d11e307ef9",
  "projectId": "9f811d29-6c63-4ea0-bb5c-c93e6d9031e3",
  "token": "your-linear-api-token"
}
```

### 글로벌 설정 (`~/.vibe/config.json`)
홈 디렉토리에 저장되는 전역 설정 파일:

```json
{
  "token": "your-linear-api-token"
}
```

**설정 우선순위**: 워크스페이스 설정 → 글로벌 설정

## 📋 전체 명령어 참조

### 설정 관리 (`vibe config`)
- `vibe config init [options]` - 새 워크스페이스 초기화 (대화형)
- `vibe config set-token <token>` - Linear API 토큰 설정
- `vibe config teams` - 사용 가능한 팀 목록 조회 (팀 UUID 확인)
- `vibe config set-team <teamId>` - 팀 ID 설정 (UUID 형식)
- `vibe config projects` - 현재 팀의 프로젝트 목록 조회
- `vibe config set-project <projectId>` - 프로젝트 ID 설정 (UUID 형식)
- `vibe config get` - 현재 설정 확인

### 이슈 관리 (`vibe linear`, `vibe issue`)
- `vibe linear list` - 이슈 목록 조회
- `vibe linear list --limit <number>` - 특정 개수만큼 조회
- `vibe issue create --title <title> --description <description>` - 새 이슈 생성

### AI 협업 (`vibe copilot`)
- `vibe copilot <issueId>` - 이슈 정보를 클립보드에 복사

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🔗 링크

- [GitHub Repository](https://github.com/SeoJaeWan/linear-vibe-cli)
- [npm Package](https://www.npmjs.com/package/linear-vibe-cli)
- [Issues](https://github.com/SeoJaeWan/linear-vibe-cli/issues)

## 💡 팁

- 🚀 **워크스페이스 우선 사용**: `vibe config init`으로 프로젝트별 설정을 구성하는 것을 권장합니다
- 📁 **프로젝트별 설정**: 각 프로젝트 디렉토리마다 다른 Linear 팀/프로젝트를 설정할 수 있습니다
- 🔄 **워크플로우 최적화**: 이슈 정보를 클립보드에 복사한 후 IDE의 Copilot Chat에 바로 붙여넣어 보세요
- ⚡ **빠른 이슈 생성**: CLI에서 바로 이슈를 생성하여 아이디어를 즉시 캡처하세요
- 🔗 **연속 작업**: 이슈 생성 후 바로 `vibe copilot` 명령어로 AI와 협업하세요
- 📱 **크로스 플랫폼**: Windows, macOS, Linux에서 모두 사용 가능합니다
- 🛠️ **트러블슈팅**: 이슈 생성이 실패하면 팀 ID와 프로젝트 ID가 올바른 UUID 형식인지 확인하세요
- 🌍 **글로벌 토큰**: API 토큰은 글로벌로 설정하고, 팀/프로젝트만 워크스페이스별로 설정해도 됩니다

---

Made with ❤️ by developers, for developers
