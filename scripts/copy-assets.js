#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

console.log('📁 Copying locale files to dist...');

const srcLocalesDir = path.join(projectRoot, 'src', 'locales');
const distLocalesDir = path.join(projectRoot, 'dist', 'locales');

// dist/locales 디렉터리 생성
if (!fs.existsSync(distLocalesDir)) {
    fs.mkdirSync(distLocalesDir, { recursive: true });
}

// locale 파일들 복사
if (fs.existsSync(srcLocalesDir)) {
    const files = fs.readdirSync(srcLocalesDir);
    files.forEach(file => {
        const srcFile = path.join(srcLocalesDir, file);
        const distFile = path.join(distLocalesDir, file);
        fs.copyFileSync(srcFile, distFile);
        console.log(`✅ Copied ${file}`);
    });
}

console.log('🎉 Locale files copied successfully!');
