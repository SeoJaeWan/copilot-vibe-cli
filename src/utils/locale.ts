import {getLanguage, setLanguage as saveLanguage, type Local} from "./options.js";
import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface LocaleData {
    program: {
        name: string;
        description: string;
        version: string;
    };
    init: {
        title: string;
        template: string;
        messages: {
            projectInfo: string;
            project: string;
            sessionName: string;
            workingDir: string;
            language: string;
            currentContext: string;
            important: string;
            autoSaveNote: string;
            success: string;
            nextStep: string;
            recommendedSteps: string;
            steps: string[];
            tips: string[];
        };
    };
    copilot: {
        description: string;
        save: {
            description: string;
            options: {
                name: string;
                tags: string;
                conversation: string;
                addPatterns: string;
                projectType: string;
                techStack: string;
                fileStructure: string;
            };
            saving: string;
            success: string;
            location: string;
            tags: string;
            projectType: string;
            patterns: string;
            none: string;
            count: string;
        };
        load: {
            description: string;
            argument: string;
            noSessions: string;
            sessionList: string;
            date: string;
            tags: string;
            usage: string;
            sessionInfo: string;
            name: string;
            contextCopied: string;
            pasteInstruction: string;
            contextTemplate: {
                title: string;
                projectType: string;
                techStack: string;
                fileStructure: string;
                patterns: string;
                conversation: string;
                footer: string;
            };
        };
        list: {
            description: string;
            options: {
                tag: string;
            };
            noSessionsWithTag: string;
            noSessions: string;
            sessionListTitle: string;
            withTag: string;
            date: string;
            project: string;
            tags: string;
            usage: string;
        };
        delete: {
            description: string;
            argument: string;
            success: string;
        };
        edit: {
            description: string;
            argument: string;
            options: {
                addTags: string;
                removeTags: string;
                addPatterns: string;
                setConversation: string;
                appendConversation: string;
            };
            tagsAdded: string;
            tagsRemoved: string;
            patternsAdded: string;
            conversationSet: string;
            conversationAppended: string;
            updated: string;
        };
        updateContext: {
            description: string;
            argument: string;
            options: {
                projectType: string;
                addTech: string;
                packageInfo: string;
            };
            projectTypeSet: string;
            techAdded: string;
            packageInfoUpdated: string;
            contextUpdated: string;
        };
        show: {
            description: string;
            argument: string;
            session: string;
            date: string;
            tags: string;
            project: string;
            techStack: string;
            packageInfo: string;
            patterns: string;
            fileStructure: string;
            conversation: string;
            none: string;
        };
    };
    lang: {
        description: string;
        set: {
            description: string;
            argument: string;
            unsupported: string;
            supportedLangs: string;
            success: string;
            configFile: string;
        };
        get: {
            description: string;
            currentLang: string;
            language: string;
            configFile: string;
        };
    };
    linear: {
        description: string;
        config: {
            description: string;
            setToken: {
                description: string;
                argument: string;
                success: string;
            };
            setTeam: {
                description: string;
                argument: string;
                success: string;
            };
            setProject: {
                description: string;
                argument: string;
                success: string;
            };
            get: {
                description: string;
                currentSettings: string;
                token: string;
                teamId: string;
                projectId: string;
                workspace: string;
                configured: string;
                notConfigured: string;
                default: string;
            };
            teams: {
                description: string;
                noToken: string;
                title: string;
                tip: string;
            };
            projects: {
                description: string;
                noTeam: string;
                title: string;
                descriptionLabel: string;
                tip: string;
            };
            init: {
                description: string;
                options: {
                    name: string;
                    team: string;
                    project: string;
                };
                starting: string;
                noToken: string;
                availableTeams: string;
                teamInstruction: string;
                availableProjects: string;
                projectInstruction: string;
                success: string;
                configFile: string;
                nextSteps: string;
                commands: string[];
            };
        };
        issue: {
            description: string;
            view: {
                description: string;
                argument: string;
            };
            list: {
                description: string;
                option: string;
                noIssues: string;
                title: string;
                tip: string;
                status: string;
                createdAt: string;
            };
            create: {
                description: string;
                options: {
                    title: string;
                    description: string;
                };
                success: string;
                tip: string;
            };
        };
        copilotIssue: {
            description: string;
            argument: string;
            issueInfo: string;
            success: string;
            instruction: string;
            issueTitle: string;
            issueStatus: string;
            issueDescription: string;
            noDescription: string;
        };
        errors: {
            noConfig: string;
            graphqlError: string;
            noDataResponse: string;
            noIssueCreateResponse: string;
            issueCreateFailed: string;
        };
    };
}

let currentLocale: Local | null = null;
const localeCache: Map<Local, LocaleData> = new Map();

// JSON 파일을 동적으로 로드하는 함수
function loadLocaleFile(locale: Local): LocaleData {
    try {
        const localePath = path.join(__dirname, `../locales/${locale}.json`);
        const fileContent = fs.readFileSync(localePath, "utf-8");
        return JSON.parse(fileContent) as LocaleData;
    } catch (error) {
        console.warn(`Failed to load locale file for '${locale}':`, error);
        if (locale !== "en") {
            return loadLocaleFile("en"); // Fallback to English
        }
        throw new Error(`Locale '${locale}' not found and no fallback available`);
    }
}

export function setLocale(locale: Local) {
    const supportedLocales = ["ko", "en"];
    if (supportedLocales.includes(locale)) {
        currentLocale = locale;
        saveLanguage(locale); // 옵션 파일에 저장
    } else {
        console.warn(`Unsupported locale: ${locale}. Falling back to 'en'.`);
        currentLocale = "en";
        saveLanguage("en");
    }
}

export function getCurrentLocale(): Local {
    if (currentLocale === null) {
        // 처음 호출 시 옵션 파일에서 언어 설정을 읽어옴
        currentLocale = getLanguage();
    }
    return currentLocale!; // null이 아님을 보장
}

export function loadLocale(locale: Local): LocaleData {
    if (localeCache.has(locale)) {
        return localeCache.get(locale)!;
    }

    const data = loadLocaleFile(locale);
    localeCache.set(locale, data);
    return data;
}

export function t(): LocaleData {
    return loadLocale(getCurrentLocale());
}

export function generateInstructions(): string {
    const locale = t();
    return locale.init.template;
}
