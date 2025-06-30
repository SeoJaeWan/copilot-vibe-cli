import {Command} from "commander";
import {saveChatSession, loadChatSession, listChatSessions, deleteChatSession, editChatSession, getBasicPackageInfo} from "../services/copilot.js";
import chalk from "chalk";
import {t, getCurrentLocale} from "../utils/locale.js";

export const copilotCommand = new Command("copilot");

copilotCommand.description(t().copilot.description);

// ============ 세션 저장 (AI Agent 전용) ============
copilotCommand
    .command("save")
    .description(t().copilot.save.description)
    .requiredOption("-n, --name <n>", t().copilot.save.options.name)
    .option("-t, --tags <tags>", t().copilot.save.options.tags, "")
    .option("-c, --conversation <text>", t().copilot.save.options.conversation)
    .option("--add-patterns <patterns>", t().copilot.save.options.addPatterns)
    .option("--project-type <type>", t().copilot.save.options.projectType)
    .option("--tech-stack <stack>", t().copilot.save.options.techStack)
    .option("--file-structure <structure>", t().copilot.save.options.fileStructure)
    .action(async options => {
        try {
            const locale = t();
            const sessionName = options.name;
            const tags = options.tags ? options.tags.split(",").map((tag: string) => tag.trim()) : [];

            console.log(chalk.blue(locale.copilot.save.saving));

            // AI Agent가 제공한 정보로 프로젝트 컨텍스트 생성
            const projectContext = {
                projectType: options.projectType || "Unknown",
                techStack: options.techStack ? options.techStack.split(",").map((tech: string) => tech.trim()) : [],
                fileStructure: options.fileStructure || "",
                patterns: options.addPatterns ? options.addPatterns.split(";").map((pattern: string) => pattern.trim()) : [],
                packageInfo: getBasicPackageInfo()
            };

            const sessionData = {
                name: sessionName,
                timestamp: new Date().toISOString(),
                tags,
                projectContext,
                conversation: options.conversation || "AI Agent에 의해 생성된 세션"
            };

            await saveChatSession(sessionName, sessionData);
            console.log(chalk.green(`${locale.copilot.save.success} ${sessionName}`));
            console.log(chalk.gray(locale.copilot.save.location));
            console.log(chalk.blue(`${locale.copilot.save.tags} ${tags.join(", ") || locale.copilot.save.none}`));
            console.log(chalk.blue(`${locale.copilot.save.projectType} ${projectContext.projectType}`));
            console.log(chalk.blue(`${locale.copilot.save.patterns} ${projectContext.patterns.length}${locale.copilot.save.count}`));
        } catch (e) {
            console.error(chalk.red((e as Error).message));
        }
    });

// ============ 세션 불러오기 ============
copilotCommand
    .command("load")
    .description(t().copilot.load.description)
    .argument("[sessionName]", t().copilot.load.argument)
    .action(async sessionName => {
        try {
            const locale = t();
            const currentLang = getCurrentLocale();

            if (!sessionName) {
                // 세션 목록 표시
                const sessions = await listChatSessions();

                if (sessions.length === 0) {
                    console.log(chalk.yellow(locale.copilot.load.noSessions));
                    return;
                }

                console.log(chalk.blue(`${locale.copilot.load.sessionList}\n`));
                sessions.forEach((session, index) => {
                    console.log(`${chalk.blue(`${index + 1}.`)} ${chalk.bold(session.name)}`);
                    console.log(
                        `   ${chalk.gray(
                            `${locale.copilot.load.date} ${new Date(session.timestamp).toLocaleDateString(currentLang === "ko" ? "ko-KR" : "en-US")}`
                        )}`
                    );
                    if (session.tags.length > 0) {
                        console.log(`   ${chalk.cyan(`${locale.copilot.load.tags} ${session.tags.join(", ")}`)}`);
                    }
                    console.log("");
                });

                console.log(chalk.yellow(locale.copilot.load.usage));
                return;
            }

            // 특정 세션 불러오기
            const session = await loadChatSession(sessionName);

            console.log(chalk.blue(locale.copilot.load.sessionInfo));
            console.log(chalk.gray(`  ${locale.copilot.load.name} ${session.name}`));
            console.log(
                chalk.gray(`  ${locale.copilot.load.date} ${new Date(session.timestamp).toLocaleDateString(currentLang === "ko" ? "ko-KR" : "en-US")}`)
            );
            console.log(chalk.gray(`  ${locale.copilot.load.tags} ${session.tags.join(", ") || locale.copilot.save.none}`));

            // 프로젝트 컨텍스트를 클립보드에 복사
            const contextTemplate = locale.copilot.load.contextTemplate;
            const contextText = `${contextTemplate.title}

${contextTemplate.projectType} ${session.projectContext.projectType}
${contextTemplate.techStack} ${session.projectContext.techStack.join(", ")}
${contextTemplate.fileStructure}
${session.projectContext.fileStructure}

${contextTemplate.patterns}
${session.projectContext.patterns.join("\n")}

${contextTemplate.conversation}
${session.conversation}

---

${contextTemplate.footer}`;

            // 클립보드에 복사
            const clipboardy = await import("clipboardy");
            await clipboardy.default.write(contextText);

            console.log("");
            console.log(chalk.green(locale.copilot.load.contextCopied));
            console.log(chalk.yellow(locale.copilot.load.pasteInstruction));
        } catch (e) {
            console.error(chalk.red((e as Error).message));
        }
    });

// ============ 세션 목록 ============
copilotCommand
    .command("list")
    .description(t().copilot.list.description)
    .option("--tag <tag>", t().copilot.list.options.tag)
    .action(async options => {
        try {
            const locale = t();
            const currentLang = getCurrentLocale();
            const sessions = await listChatSessions(options.tag);

            if (sessions.length === 0) {
                if (options.tag) {
                    console.log(chalk.yellow(locale.copilot.list.noSessionsWithTag.replace("{tag}", options.tag)));
                } else {
                    console.log(chalk.yellow(locale.copilot.list.noSessions));
                }
                return;
            }

            const titleSuffix = options.tag ? locale.copilot.list.withTag.replace("{tag}", options.tag) : "";
            console.log(chalk.blue(`${locale.copilot.list.sessionListTitle}${titleSuffix}:\n`));

            sessions.forEach((session, index) => {
                console.log(`${chalk.blue(`${index + 1}.`)} ${chalk.bold(session.name)}`);
                console.log(
                    `   ${chalk.gray(
                        `${locale.copilot.list.date} ${new Date(session.timestamp).toLocaleDateString(currentLang === "ko" ? "ko-KR" : "en-US")}`
                    )}`
                );
                console.log(`   ${chalk.gray(`${locale.copilot.list.project} ${session.projectContext.projectType}`)}`);
                if (session.tags.length > 0) {
                    console.log(`   ${chalk.cyan(`${locale.copilot.list.tags} ${session.tags.join(", ")}`)}`);
                }
                console.log("");
            });

            console.log(chalk.yellow(locale.copilot.list.usage));
        } catch (e) {
            console.error(chalk.red((e as Error).message));
        }
    });

// ============ 컨텍스트 내보내기 ============
copilotCommand
    .command("export")
    .description(t().copilot.export.description)
    .action(async () => {
        try {
            const locale = t();
            console.log(chalk.blue(locale.copilot.export.exporting));

            const packageInfo = getBasicPackageInfo();
            const template = locale.copilot.export.template;

            const contextText = `${template.title}

${template.packageInfo} ${packageInfo}

${template.currentDir} ${process.cwd()}

${template.footer}`;

            // 클립보드에 복사
            const clipboardy = await import("clipboardy");
            await clipboardy.default.write(contextText);

            console.log(chalk.green(locale.copilot.export.success));
            console.log(chalk.yellow(locale.copilot.export.instruction));
            console.log(chalk.gray(locale.copilot.export.note));
        } catch (e) {
            console.error(chalk.red((e as Error).message));
        }
    });

// ============ 세션 삭제 ============
copilotCommand
    .command("delete")
    .description(t().copilot.delete.description)
    .argument("<sessionName>", t().copilot.delete.argument)
    .action(async sessionName => {
        try {
            const locale = t();
            await deleteChatSession(sessionName);
            console.log(chalk.green(locale.copilot.delete.success.replace("{sessionName}", sessionName)));
        } catch (e) {
            console.error(chalk.red((e as Error).message));
        }
    });

// ============ Agent 전용 세션 편집 ============
copilotCommand
    .command("edit")
    .description(t().copilot.edit.description)
    .argument("<sessionName>", t().copilot.edit.argument)
    .option("--add-tags <tags>", t().copilot.edit.options.addTags)
    .option("--remove-tags <tags>", t().copilot.edit.options.removeTags)
    .option("--add-patterns <patterns>", t().copilot.edit.options.addPatterns)
    .option("--set-conversation <text>", t().copilot.edit.options.setConversation)
    .option("--append-conversation <text>", t().copilot.edit.options.appendConversation)
    .action(async (sessionName, options) => {
        try {
            const locale = t();
            const editOptions: any = {};

            if (options.addTags) {
                editOptions.addTags = options.addTags.split(",").map((tag: string) => tag.trim());
                console.log(chalk.green(`${locale.copilot.edit.tagsAdded} ${editOptions.addTags.join(", ")}`));
            }

            if (options.removeTags) {
                editOptions.removeTags = options.removeTags.split(",").map((tag: string) => tag.trim());
                console.log(chalk.yellow(`${locale.copilot.edit.tagsRemoved} ${editOptions.removeTags.join(", ")}`));
            }

            if (options.addPatterns) {
                editOptions.addPatterns = options.addPatterns.split(";").map((pattern: string) => pattern.trim());
                console.log(chalk.green(locale.copilot.edit.patternsAdded.replace("{count}", editOptions.addPatterns.length.toString())));
            }

            if (options.setConversation) {
                editOptions.setConversation = options.setConversation;
                console.log(chalk.green(locale.copilot.edit.conversationSet));
            }

            if (options.appendConversation) {
                editOptions.appendConversation = options.appendConversation;
                console.log(chalk.green(locale.copilot.edit.conversationAppended));
            }

            await editChatSession(sessionName, editOptions);
            console.log(chalk.blue(locale.copilot.edit.updated.replace("{sessionName}", sessionName)));
        } catch (e) {
            console.error(chalk.red((e as Error).message));
        }
    });

copilotCommand
    .command("update-context")
    .description(t().copilot.updateContext.description)
    .argument("<sessionName>", t().copilot.updateContext.argument)
    .option("--project-type <type>", t().copilot.updateContext.options.projectType)
    .option("--add-tech <tech>", t().copilot.updateContext.options.addTech)
    .option("--package-info <info>", t().copilot.updateContext.options.packageInfo)
    .action(async (sessionName, options) => {
        try {
            const locale = t();
            const session = await loadChatSession(sessionName);

            if (options.projectType) {
                session.projectContext.projectType = options.projectType;
                console.log(chalk.green(`${locale.copilot.updateContext.projectTypeSet} ${options.projectType}`));
            }

            if (options.addTech) {
                const newTech = options.addTech.split(",").map((tech: string) => tech.trim());
                session.projectContext.techStack = [...new Set([...session.projectContext.techStack, ...newTech])];
                console.log(chalk.green(`${locale.copilot.updateContext.techAdded} ${newTech.join(", ")}`));
            }

            if (options.packageInfo) {
                session.projectContext.packageInfo = options.packageInfo;
                console.log(chalk.green(locale.copilot.updateContext.packageInfoUpdated));
            }

            session.timestamp = new Date().toISOString();
            await saveChatSession(sessionName, session);
            console.log(chalk.blue(locale.copilot.updateContext.contextUpdated.replace("{sessionName}", sessionName)));
        } catch (e) {
            console.error(chalk.red((e as Error).message));
        }
    });

copilotCommand
    .command("show")
    .description(t().copilot.show.description)
    .argument("<sessionName>", t().copilot.show.argument)
    .action(async sessionName => {
        try {
            const locale = t();
            const currentLang = getCurrentLocale();
            const session = await loadChatSession(sessionName);

            console.log(chalk.blue(`\n${locale.copilot.show.session} ${session.name}\n`));
            console.log(chalk.gray(`${locale.copilot.show.date} ${new Date(session.timestamp).toLocaleString(currentLang === "ko" ? "ko-KR" : "en-US")}`));
            console.log(chalk.gray(`${locale.copilot.show.tags} ${session.tags.join(", ") || locale.copilot.show.none}`));
            console.log(chalk.gray(`${locale.copilot.show.project} ${session.projectContext.projectType}`));
            console.log(chalk.gray(`${locale.copilot.show.techStack} ${session.projectContext.techStack.join(", ")}`));
            console.log(chalk.gray(`${locale.copilot.show.packageInfo} ${session.projectContext.packageInfo}`));

            console.log(chalk.blue(`\n${locale.copilot.show.patterns}`));
            session.projectContext.patterns.forEach((pattern, index) => {
                console.log(chalk.gray(`  ${index + 1}. ${pattern}`));
            });

            console.log(chalk.blue(`\n${locale.copilot.show.fileStructure}`));
            console.log(chalk.gray(session.projectContext.fileStructure));

            console.log(chalk.blue(`\n${locale.copilot.show.conversation}`));
            console.log(chalk.gray(session.conversation));
        } catch (e) {
            console.error(chalk.red((e as Error).message));
        }
    });
