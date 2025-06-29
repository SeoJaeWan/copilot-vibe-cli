# 🚀 Linear Vibe CLI

Linear 이슈를 CLI에서 효율적으로 관리하고 GitHub Copilot과 연동하여 생산성을 극대화하는 도구입니다.

[![npm version](https://badge.fury.io/js/linear-vibe-cli.svg)](https://badge.fury.io/js/linear-vibe-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ 주요 기능

- 📝 **Linear 이슈 관리**: CLI에서 Linear 이슈 목록 조회 및 생성
- 🤖 **Copilot 연동**: 이슈 정보를 클립보드에 복사하여 AI와 협업
- ⚙️ **간편한 설정**: API 토큰, 팀/프로젝트 필터링 지원
- 🎨 **깔끔한 UI**: 컬러풀하고 직관적인 CLI 인터페이스
- ✨ **이슈 생성**: CLI에서 바로 새로운 Linear 이슈 생성

## 🔧 설치

```bash
npm install -g linear-vibe-cli
```

## 🚀 빠른 시작

### 1. Linear API 토큰 설정

[Linear 설정 페이지](https://linear.app/settings)에서 Personal API Key를 생성하고 설정합니다.

```bash
vibe config set-token YOUR_LINEAR_API_TOKEN
```

### 2. 팀/프로젝트 설정 (선택사항)

특정 팀이나 프로젝트로 필터링하려면:

```bash
vibe config set-team YOUR_TEAM_ID
vibe config set-project YOUR_PROJECT_ID
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

## 📚 사용법

### 설정 관리

```bash
# API 토큰 설정
vibe config set-token <token>

# 팀 ID 설정
vibe config set-team <teamId>

# 프로젝트 ID 설정  
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

설정은 홈 디렉토리의 `.linear-vibe-config.json`에 저장됩니다:

```json
{
  "token": "your-linear-api-token",
  "teamId": "your-team-id", 
  "projectId": "your-project-id"
}
```

## 📋 전체 명령어 참조

### 설정 관리 (`vibe config`)
- `vibe config set-token <token>` - Linear API 토큰 설정
- `vibe config set-team <teamId>` - 팀 ID 설정
- `vibe config set-project <projectId>` - 프로젝트 ID 설정
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

- 🔄 **워크플로우 최적화**: 이슈 정보를 클립보드에 복사한 후 IDE의 Copilot Chat에 바로 붙여넣어 보세요
- 🎯 **필터링 활용**: 팀/프로젝트 설정으로 관련 이슈만 조회하여 효율성을 높이세요
- ⚡ **빠른 이슈 생성**: CLI에서 바로 이슈를 생성하여 아이디어를 즉시 캡처하세요
- 🔗 **연속 작업**: 이슈 생성 후 바로 `vibe copilot` 명령어로 AI와 협업하세요
- 📱 **크로스 플랫폼**: Windows, macOS, Linux에서 모두 사용 가능합니다

---

Made with ❤️ by developers, for developers
