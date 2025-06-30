import fs from "fs";
import {join} from "path";

export interface ChatSession {
    name: string;
    timestamp: string;
    tags: string[];
    projectContext: ProjectContext;
    conversation: string;
}

export interface ProjectContext {
    projectType: string;
    techStack: string[];
    fileStructure: string;
    patterns: string[];
    packageInfo: string;
}

// .copilot 디렉토리를 현재 디렉토리부터 상위로 재귀 검색
function findCopilotDir(): string {
    let currentDir = process.cwd();

    while (true) {
        const copilotPath = join(currentDir, ".copilot");
        if (fs.existsSync(copilotPath)) {
            return copilotPath;
        }

        const parentDir = join(currentDir, "..");
        if (parentDir === currentDir) break; // reached root
        currentDir = parentDir;
    }

    // .copilot 폴더를 찾지 못했다면 현재 작업 디렉토리에 생성
    return join(process.cwd(), ".copilot");
}

const getCopilotDir = () => findCopilotDir();
const getSessionsFile = () => join(getCopilotDir(), "sessions.json");

// 디렉토리 및 세션 파일 초기화
function ensureSessionsFile() {
    const copilotDir = getCopilotDir();
    const sessionsFile = getSessionsFile();

    if (!fs.existsSync(copilotDir)) {
        fs.mkdirSync(copilotDir, {recursive: true});
    }
    if (!fs.existsSync(sessionsFile)) {
        fs.writeFileSync(sessionsFile, JSON.stringify({sessions: []}, null, 2));
    }
}

// 모든 세션 로드
function loadAllSessions(): {sessions: ChatSession[]} {
    ensureSessionsFile();
    const sessionsFile = getSessionsFile();

    try {
        const content = fs.readFileSync(sessionsFile, "utf8");
        return JSON.parse(content);
    } catch {
        return {sessions: []};
    }
}

// 모든 세션 저장
function saveAllSessions(data: {sessions: ChatSession[]}) {
    ensureSessionsFile();
    const sessionsFile = getSessionsFile();
    fs.writeFileSync(sessionsFile, JSON.stringify(data, null, 2));
}

export function getBasicPackageInfo(): string {
    try {
        const packagePath = join(process.cwd(), "package.json");
        if (fs.existsSync(packagePath)) {
            const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
            return `${packageJson.name} v${packageJson.version} - ${packageJson.description || "No description"}`;
        }
    } catch (error) {
        console.warn("package.json을 읽는데 실패했습니다:", error);
    }
    return "패키지 정보를 가져올 수 없습니다";
}

// 세션 저장
export async function saveChatSession(name: string, session: ChatSession): Promise<void> {
    const data = loadAllSessions();

    // 기존 세션이 있으면 업데이트, 없으면 추가
    const existingIndex = data.sessions.findIndex(s => s.name === name);
    if (existingIndex >= 0) {
        data.sessions[existingIndex] = session;
    } else {
        data.sessions.push(session);
    }

    saveAllSessions(data);

    // .gitignore에 .copilot 추가
    const gitignorePath = join(process.cwd(), ".gitignore");
    if (fs.existsSync(gitignorePath)) {
        const gitignoreContent = fs.readFileSync(gitignorePath, "utf8");
        if (!gitignoreContent.includes(".copilot")) {
            fs.appendFileSync(gitignorePath, "\n.copilot/\n");
        }
    }
}

// 세션 불러오기
export async function loadChatSession(name: string): Promise<ChatSession> {
    const data = loadAllSessions();
    const session = data.sessions.find(s => s.name === name);

    if (!session) {
        throw new Error(`세션 '${name}'을 찾을 수 없습니다.`);
    }

    return session;
}

// 세션 목록 조회
export async function listChatSessions(tagFilter?: string): Promise<ChatSession[]> {
    const data = loadAllSessions();
    let sessions = data.sessions;

    // 태그 필터링
    if (tagFilter) {
        sessions = sessions.filter(session => session.tags.includes(tagFilter));
    }

    // 날짜순 정렬 (최신순)
    return sessions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// 세션 삭제
export async function deleteChatSession(name: string): Promise<void> {
    const data = loadAllSessions();
    const initialLength = data.sessions.length;

    data.sessions = data.sessions.filter(s => s.name !== name);

    if (data.sessions.length === initialLength) {
        throw new Error(`세션 '${name}'을 찾을 수 없습니다.`);
    }

    saveAllSessions(data);
}

// 세션 편집
export async function editChatSession(
    name: string,
    options: {
        addTags?: string[];
        removeTags?: string[];
        addPatterns?: string[];
        setConversation?: string;
        appendConversation?: string;
    }
): Promise<ChatSession> {
    const data = loadAllSessions();
    const sessionIndex = data.sessions.findIndex(s => s.name === name);

    if (sessionIndex === -1) {
        throw new Error(`세션 '${name}'을 찾을 수 없습니다.`);
    }

    const session = data.sessions[sessionIndex];

    // 태그 추가
    if (options.addTags) {
        session.tags = [...new Set([...session.tags, ...options.addTags])];
    }

    // 태그 제거
    if (options.removeTags) {
        session.tags = session.tags.filter(tag => !options.removeTags!.includes(tag));
    }

    // 패턴 추가
    if (options.addPatterns) {
        session.projectContext.patterns = [...session.projectContext.patterns, ...options.addPatterns];
    }

    // 대화 내용 설정
    if (options.setConversation) {
        session.conversation = options.setConversation;
    }

    // 대화 내용 추가
    if (options.appendConversation) {
        session.conversation += "\n\n" + options.appendConversation;
    }

    // 타임스탬프 업데이트
    session.timestamp = new Date().toISOString();

    data.sessions[sessionIndex] = session;
    saveAllSessions(data);

    return session;
}
