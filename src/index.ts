import {Command} from "commander";
import {linearCommand} from "./commands/linear.js";
import {copilotCommand} from "./commands/copilot.js";
import {getBasicPackageInfo} from "./services/copilot.js";
import {setLocale, getCurrentLocale, generateInstructions, t} from "./utils/locale.js";
import {loadOptions, updateOptions} from "./utils/options.js";
import chalk from "chalk";

const program = new Command();

program.name("vibe").description(t().program.description).version("1.1.0");

// ============ 통합 AI Agent 초기화 ============
program
    .command("init")
    .description(t().init.messages.projectInfo)
    .option("--session-name <name>", t().init.messages.sessionName)
    .action(async options => {
        try {
            const locale = t();

            const packageInfo = getBasicPackageInfo();
            const projectName = packageInfo.split(" ")[0] || "current-project";
            const sessionName = options.sessionName || `${projectName}-development`;

            console.log(chalk.blue(locale.init.title));
            console.log(chalk.blue("=" + "=".repeat(60)));
            console.log("");
            console.log(chalk.green(locale.init.messages.projectInfo));
            console.log(chalk.gray(`  ${locale.init.messages.project} ${packageInfo}`));
            console.log(chalk.gray(`  ${locale.init.messages.sessionName} ${sessionName}`));
            console.log(chalk.gray(`  ${locale.init.messages.workingDir} ${process.cwd()}`));
            console.log(chalk.gray(`  ${locale.init.messages.language} ${getCurrentLocale()}`));
            console.log(""); // JSON 기반 지시사항 템플릿 사용
            const instructions = generateInstructions();

            console.log(chalk.gray(`${instructions}`));

            console.log(chalk.green(locale.init.messages.success));
            console.log(chalk.yellow(locale.init.messages.nextStep));
            console.log("");
            console.log(chalk.blue(locale.init.messages.recommendedSteps));
            locale.init.messages.steps.forEach((step, index) => {
                const formattedStep = step.replace("{sessionName}", sessionName);
                console.log(chalk.gray(`${index + 1}. ${formattedStep}`));
            });
            console.log("");
            locale.init.messages.tips.forEach(tip => {
                console.log(chalk.cyan(tip));
            });
        } catch (e) {
            console.error(chalk.red((e as Error).message));
        }
    });

// ============ 언어 설정 명령어 ============
program
    .command("lang")
    .description(t().lang.description)
    .addCommand(
        new Command("set")
            .description(t().lang.set.description)
            .argument("<language>", t().lang.set.argument)
            .action(async language => {
                try {
                    const locale = t();
                    const supportedLangs = ["ko", "en"];
                    if (!supportedLangs.includes(language)) {
                        console.error(chalk.red(locale.lang.set.unsupported.replace("{language}", language)));
                        console.log(chalk.yellow(locale.lang.set.supportedLangs.replace("{langs}", supportedLangs.join(", "))));
                        return;
                    }

                    updateOptions({language});
                    setLocale(language);

                    const newLocale = t();
                    console.log(chalk.green(newLocale.lang.set.success.replace("{language}", language)));
                    console.log(chalk.gray(newLocale.lang.set.configFile));
                } catch (error) {
                    const locale = t();
                    console.error(chalk.red(locale.linear.errors.graphqlError.replace("{error}", (error as Error).message)));
                }
            })
    )
    .addCommand(
        new Command("get").description(t().lang.get.description).action(() => {
            try {
                const options = loadOptions();
                const locale = t();
                console.log(chalk.blue(locale.lang.get.currentLang));
                console.log(chalk.gray(`  ${locale.lang.get.language} ${options.language}`));
                console.log(chalk.gray(`  ${locale.lang.get.configFile}`));
            } catch (error) {
                const locale = t();
                console.error(chalk.red(locale.linear.errors.graphqlError.replace("{error}", (error as Error).message)));
            }
        })
    );

program.addCommand(linearCommand);
program.addCommand(copilotCommand);

program.parse();
