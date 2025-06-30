import fs from "fs";
import {join} from "path";

export type Local = "ko" | "en";

export interface VibeOptions {
    language: Local;
    defaultSessionName?: string;
    autoSave?: boolean;
}

const DEFAULT_OPTIONS: VibeOptions = {
    language: "en", // 기본 언어를 영어로 설정
    autoSave: true
};

function getOptionsPath(): string {
    return join(process.cwd(), ".copilot", "options.json");
}

function ensureOptionsDirectory(): void {
    const optionsDir = join(process.cwd(), ".copilot");
    if (!fs.existsSync(optionsDir)) {
        fs.mkdirSync(optionsDir, {recursive: true});
    }
}

export function loadOptions(): VibeOptions {
    try {
        ensureOptionsDirectory();
        const optionsPath = getOptionsPath();

        if (!fs.existsSync(optionsPath)) {
            // 옵션 파일이 없으면 기본값으로 생성
            saveOptions(DEFAULT_OPTIONS);
            return DEFAULT_OPTIONS;
        }

        const optionsData = fs.readFileSync(optionsPath, "utf8");
        const options = JSON.parse(optionsData) as VibeOptions;

        // 기본값과 병합하여 누락된 옵션들을 보완
        return {
            ...DEFAULT_OPTIONS,
            ...options
        };
    } catch (error) {
        console.warn("Failed to load options, using defaults:", error);
        return DEFAULT_OPTIONS;
    }
}

export function saveOptions(options: VibeOptions): void {
    try {
        ensureOptionsDirectory();
        const optionsPath = getOptionsPath();
        fs.writeFileSync(optionsPath, JSON.stringify(options, null, 2), "utf8");
    } catch (error) {
        console.error("Failed to save options:", error);
        throw error;
    }
}

export function updateOptions(updates: Partial<VibeOptions>): VibeOptions {
    const currentOptions = loadOptions();
    const newOptions = {
        ...currentOptions,
        ...updates
    };
    saveOptions(newOptions);
    return newOptions;
}

export function getLanguage(): Local {
    const options = loadOptions();
    return options.language;
}

export function setLanguage(language: Local): void {
    updateOptions({language});
}
