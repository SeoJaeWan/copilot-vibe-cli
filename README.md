# 🚀 Linear Vibe CLI

Linear 이슈를 CLI에서 효율적으로 관리하고 GitHub Copilot과 연동하여 개발 생산성을 극대화하는 도구입니다.

[![npm version](https://badge.fury.io/js/linear-vibe-cli.svg)](https://badge.fury.io/js/linear-vibe-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## ✨ 주요 기능

- 📝 **Linear 이슈 관리**: CLI에서 Linear 이슈 목록 조회 및 생성
- 🤖 **GitHub Copilot 연동**: 이슈 정보를 클립보드에 복사하여 AI와 협업
- 🔒 **보안 우선 설계**: API 토큰을 안전하게 분리 저장
- 🗂️ **멀티 워크스페이스**: 프로젝트별로 독립적인 Linear 팀/프로젝트 설정
- ⚙️ **간편한 설정**: 대화형 워크스페이스 초기화 지원
- 👥 **팀 관리**: Linear 팀 및 프로젝트 목록 조회
- 🎨 **직관적인 UI**: 컬러풀하고 사용자 친화적인 CLI 인터페이스
- 📋 **Git 안전**: 민감하지 않은 설정만 커밋 가능

## 🔧 설치

```bash
npm install -g linear-vibe-cli
```

## 🚀 빠른 시작

### 1. API 토큰 설정

[Linear 설정 페이지](https://linear.app/settings/api)에서 Personal API Key를 생성하고 설정합니다:

```bash
vibe config set-token YOUR_LINEAR_API_TOKEN
```

### 2. 워크스페이스 초기화 (권장)

프로젝트 디렉토리에서 대화형 워크스페이스 초기화를 실행합니다:

```bash
vibe config init
```

이 명령어는 다음을 수행합니다:
1. 사용 가능한 Linear 팀 목록 표시
2. 선택한 팀의 프로젝트 목록 표시
3. 현재 디렉토리에 `.vibe-config.json` 파일 생성 (토큰 제외)

### 3. 이슈 관리 시작

```bash
# 이슈 목록 조회 (생성일 순, 최대 10개)
vibe issue list

# 더 많은 이슈 조회
vibe issue list --limit 20

# 새 이슈 생성
vibe issue create --title "새로운 기능" --description "기능 설명"

# 이슈 정보를 Copilot과 공유
vibe copilot <issueId>
```

## 🔒 보안 설계

이 CLI는 보안을 최우선으로 설계되었습니다:

### API 토큰 보안
- **글로벌 저장**: API 토큰은 `~/.vibe/config.json`에만 저장
- **워크스페이스 분리**: 프로젝트별 설정(`.vibe-config.json`)에는 토큰 저장 안 함
- **홈 디렉토리 보호**: 숨겨진 폴더에 안전하게 보관

### Git 안전성
- ✅ `.vibe-config.json`은 **git에 안전하게 커밋 가능**
- ✅ 팀원들과 프로젝트 설정을 공유할 수 있음
- ✅ 각자 개별적으로 API 토큰만 설정하면 됨

### 설정 파일 구조

**글로벌 설정** (`~/.vibe/config.json`):
```json
{
  "token": "your_linear_api_token"
}
```

**워크스페이스 설정** (`.vibe-config.json`):
```json
{
  "workspaceName": "my-project",
  "teamId": "team-uuid-here",
  "projectId": "project-uuid-here"
}
```

## 🏢 멀티 워크스페이스 지원

각 프로젝트마다 다른 Linear 팀/프로젝트를 설정할 수 있습니다:

```bash
# 프로젝트 A
cd /path/to/project-a
vibe config init --name "Frontend" --team <team-id> --project <project-id>

# 프로젝트 B  
cd /path/to/project-b
vibe config init --name "Backend" --team <team-id> --project <project-id>

# 각 프로젝트에서 독립적으로 이슈 관리
vibe issue list  # 해당 프로젝트의 이슈만 표시
```

설정은 상위 디렉토리에서 자동으로 찾아 적용됩니다.

## 📚 명령어 레퍼런스

### 설정 관리 (`vibe config`)

```bash
# 워크스페이스 초기화 (대화형)
vibe config init

# 특정 옵션으로 초기화
vibe config init --name "프로젝트명" --team <팀ID> --project <프로젝트ID>

# 수동 설정
vibe config set-token <token>      # API 토큰 설정
vibe config set-team <teamId>      # 팀 ID 설정  
vibe config set-project <projectId> # 프로젝트 ID 설정

# 조회
vibe config get                    # 현재 설정 확인
vibe config teams                  # 사용 가능한 팀 목록
vibe config projects               # 현재 팀의 프로젝트 목록
```

### 이슈 관리 (`vibe issue`)

```bash
# 이슈 목록 조회
vibe issue list                    # 기본 10개 (생성일 순)
vibe issue list --limit 20         # 최대 20개

# 이슈 생성
vibe issue create --title "제목" --description "설명"
```

### Copilot 연동 (`vibe copilot`)

```bash
# 이슈 정보를 클립보드에 복사
vibe copilot <issueId>

# 복사된 내용을 GitHub Copilot Chat에 붙여넣기하여 AI와 협업
```

## 🎯 사용 예시

### 일반적인 워크플로우

```bash
# 1. 프로젝트 설정
cd my-project
vibe config init

# 2. 현재 이슈들 확인
vibe issue list

# 3. 새 기능 이슈 생성
vibe issue create \
  --title "사용자 인증 구현" \
  --description "JWT 기반 인증 시스템 구현"

# 4. 특정 이슈에 대해 AI와 상담
vibe copilot 89ad71e1-30ac-4839-a846-502998b5da7d
```

### 실제 출력 예시

**이슈 목록 조회:**
```bash
$ vibe issue list

📋 Linear 이슈 목록 (최대 10개):

1. 룰렛 항목 편집 기능 개선
   ID: 89ad71e1-30ac-4839-a846-502998b5da7d
   Identifier: SEO-14
   상태: Backlog
   생성일: 2025. 6. 29.

2. 룰렛 결과 모달 UI 구현
   ID: 89b83591-01bc-4416-874e-1fba61e4c642
   Identifier: SEO-12
   상태: Backlog
   생성일: 2025. 6. 29.

💡 팁: 'vibe copilot <issueId>' 명령어로 이슈 정보를 AI와 공유할 수 있습니다
```

**이슈 생성:**
```bash
$ vibe issue create --title "CLI 테스트 이슈" --description "이 이슈는 CLI에서 생성된 테스트 이슈입니다"

✅ 이슈가 성공적으로 생성되었습니다.
📌 ID: 35a94593-af63-4a2d-b2d3-394fae752659
🔖 Identifier: SEO-8
📝 Title: CLI 테스트 이슈
```

### 다중 프로젝트 관리

```bash
# 프론트엔드 프로젝트
cd ~/projects/frontend
vibe config init
vibe issue list

# 백엔드 프로젝트  
cd ~/projects/backend
vibe config init
vibe issue list  # 다른 프로젝트의 이슈 표시
```

## ⚠️ 중요 사항

### 필수 설정
- **API 토큰**: Linear API 키 필수
- **팀 ID**: Linear 팀 UUID 필요
- **프로젝트 ID**: Linear 프로젝트 UUID 필요

### ID 형식
- 팀 ID와 프로젝트 ID는 **UUID 형식**이어야 합니다
- `vibe config teams` 및 `vibe config projects` 명령어로 정확한 UUID 확인

### 워크스페이스 우선순위
1. 현재 디렉토리의 `.vibe-config.json`
2. 상위 디렉토리의 `.vibe-config.json` (재귀 검색)
3. 글로벌 설정 `~/.vibe/config.json`

### Linear API 특징
- 이슈는 **생성일 순**으로 정렬되어 표시됩니다
- GraphQL을 사용하여 효율적인 데이터 조회
- 팀과 프로젝트 필터링을 통한 정확한 이슈 관리

## 📋 설정 파일 위치

### 글로벌 설정
- **위치**: `~/.vibe/config.json`
- **내용**: API 토큰만 저장
- **용도**: 사용자별 인증 정보

### 워크스페이스 설정
- **위치**: 프로젝트 루트의 `.vibe-config.json`
- **내용**: 팀 ID, 프로젝트 ID, 워크스페이스 이름
- **용도**: 프로젝트별 Linear 설정

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🐛 문제 해결

### 자주 발생하는 오류

**GraphQL 오류:**
```
❌ 팀 ID와 프로젝트 ID가 설정되지 않았습니다. `vibe config init` 명령어로 설정해주세요.
```
→ 해결: `vibe config init` 명령어로 워크스페이스 설정

**토큰 오류:**
```
❌ Linear API 토큰이 설정되어 있지 않습니다.
```
→ 해결: `vibe config set-token <token>` 명령어로 토큰 설정

**이슈가 없을 때:**
```
📭 조건에 맞는 이슈가 없습니다.
```
→ 팀 ID와 프로젝트 ID가 올바른지 확인

## 📞 지원

- 🐛 이슈: [GitHub Issues](https://github.com/SeoJaeWan/linear-vibe-cli/issues)

---

⭐ 이 프로젝트가 유용하다면 스타를 눌러주세요!
