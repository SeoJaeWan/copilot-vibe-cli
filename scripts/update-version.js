#!/usr/bin/env node

import fs from "fs";
import path from "path";
import {fileURLToPath} from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

// package.json에서 버전 읽기
const packageJsonPath = path.join(projectRoot, "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
const version = packageJson.version;

console.log(`🔄 Updating version to ${version} across all files...`);

// 1. locale 파일들 업데이트
const locales = ["ko.json", "en.json"];
locales.forEach(locale => {
    const localePath = path.join(projectRoot, "src", "locales", locale);
    if (fs.existsSync(localePath)) {
        const localeData = JSON.parse(fs.readFileSync(localePath, "utf-8"));
        localeData.program.version = version;
        fs.writeFileSync(localePath, JSON.stringify(localeData, null, 4));
        console.log(`✅ Updated ${locale}`);
    }
});

// 2. index.ts 업데이트
const indexPath = path.join(projectRoot, "src", "index.ts");
if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, "utf-8");
    indexContent = indexContent.replace(/\.version\(['"]\d+\.\d+\.\d+['"]\)/, `.version("${version}")`);
    fs.writeFileSync(indexPath, indexContent);
    console.log(`✅ Updated index.ts`);
}

// 3. README.md 업데이트 (특정 패턴들)
const readmePath = path.join(projectRoot, "README.md");
if (fs.existsSync(readmePath)) {
    let readmeContent = fs.readFileSync(readmePath, "utf-8");

    // "copilot-vibe-cli v1.0.1" 패턴 업데이트
    readmeContent = readmeContent.replace(/copilot-vibe-cli v\d+\.\d+\.\d+/g, `copilot-vibe-cli v${version}`);

    // "### v1.0.1" 패턴 업데이트 (가장 최근 changelog 항목)
    readmeContent = readmeContent.replace(/### v\d+\.\d+\.\d+ \(Latest\)/, `### v${version} (Latest)`);

    fs.writeFileSync(readmePath, readmeContent);
    console.log(`✅ Updated README.md`);
}

// 4. sessions.json 업데이트 (packageInfo 필드)
const sessionsPath = path.join(projectRoot, ".copilot", "sessions.json");
if (fs.existsSync(sessionsPath)) {
    let sessionsContent = fs.readFileSync(sessionsPath, "utf-8");
    sessionsContent = sessionsContent.replace(/copilot-vibe-cli v\d+\.\d+\.\d+/g, `copilot-vibe-cli v${version}`);
    fs.writeFileSync(sessionsPath, sessionsContent);
    console.log(`✅ Updated sessions.json`);
}

console.log(`🎉 All files updated to version ${version}!`);
