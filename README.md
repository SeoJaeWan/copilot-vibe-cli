# 🚀 Linear Vibe CLI

A powerful CLI tool for efficiently managing Linear issues and maximizing development productivity through GitHub Copilot integration.

[![npm version](https://badge.fury.io/js/linear-vibe-cli.svg)](https://badge.fury.io/js/linear-vibe-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## ✨ Key Features

-   📝 **Linear Issue Management**: View and create Linear issues from CLI
-   🤖 **GitHub Copilot Integration**: Copy issue information to clipboard for AI collaboration
-   🔒 **Security-First Design**: Safely store API tokens separately
-   🗂️ **Multi-Workspace Support**: Independent Linear team/project settings per project
-   ⚙️ **Easy Setup**: Interactive workspace initialization support
-   👥 **Team Management**: View Linear teams and project lists
-   🎨 **Intuitive UI**: Colorful and user-friendly CLI interface
-   📋 **Git Safe**: Only non-sensitive settings can be committed
-   🌍 **Multi-Language Support**: Full Korean/English support with language switching

## 🔧 Installation

```bash
npm install -g linear-vibe-cli
```

## 🚀 Quick Start

### 0. Language Setting (Optional)

The CLI is set to English by default. If you prefer Korean:

```bash
vibe lang set ko
```

### 1. API Token Setup

Generate a Personal API Key from [Linear Settings](https://linear.app/settings/api) and configure it:

```bash
vibe config set-token YOUR_LINEAR_API_TOKEN
```

### 2. Workspace Initialization (Recommended)

Run interactive workspace initialization in your project directory:

```bash
vibe config init
```

This command will:

1. Display available Linear teams
2. Show projects for the selected team
3. Create `.vibe-config.json` file in current directory (excluding token)

### 3. Start Managing Issues

```bash
# View issue list (by creation date, max 10)
vibe issue list

# View more issues
vibe issue list --limit 20

# Create new issue
vibe issue create --title "New Feature" --description "Feature description"

# Share issue information with Copilot
vibe copilot <issueId>
```

## 🔒 Security Design

This CLI is designed with security as the top priority:

### API Token Security

-   **Global Storage**: API tokens are stored only in `~/.vibe/config.json`
-   **Workspace Separation**: Project-specific settings (`.vibe-config.json`) don't store tokens
-   **Home Directory Protection**: Safely stored in hidden folders

### Git Safety

-   ✅ `.vibe-config.json` is **safe to commit to git**
-   ✅ Can share project settings with team members
-   ✅ Each person only needs to set up their API token individually

### Configuration File Structure

**Global Config** (`~/.vibe/config.json`):

```json
{
    "token": "your_linear_api_token"
}
```

**Workspace Config** (`.vibe-config.json`):

```json
{
    "workspaceName": "my-project",
    "teamId": "team-uuid-here",
    "projectId": "project-uuid-here"
}
```

**Language Options** (`.copilot/options.json`):

```json
{
    "language": "en"
}
```

## 🏢 Multi-Workspace Support

You can set different Linear teams/projects for each project:

```bash
# Project A
cd /path/to/project-a
vibe config init --name "Frontend" --team <team-id> --project <project-id>

# Project B
cd /path/to/project-b
vibe config init --name "Backend" --team <team-id> --project <project-id>

# Manage issues independently in each project
vibe issue list  # Shows only issues for that project
```

Settings are automatically found and applied from parent directories.

## 📚 Command Reference

### Language Settings (`vibe lang`)

You can change the CLI language. Default is English, with full Korean support.

```bash
# Check current language setting
vibe lang get

# Change to Korean
vibe lang set ko

# Change to English
vibe lang set en
```

**Supported Languages:**

-   `en`: English (default)
-   `ko`: Korean

Language settings are stored in `.copilot/options.json` file, and all commands and messages will be displayed in the selected language.

### Configuration Management (`vibe config`)

```bash
# Workspace initialization (interactive)
vibe config init

# Initialize with specific options
vibe config init --name "ProjectName" --team <teamId> --project <projectId>

# Manual configuration
vibe config set-token <token>      # Set API token
vibe config set-team <teamId>      # Set team ID
vibe config set-project <projectId> # Set project ID

# View settings
vibe config get                    # Check current settings
vibe config teams                  # Available teams list
vibe config projects               # Projects list for current team
```

### Issue Management (`vibe issue`)

```bash
# View issue list
vibe issue list                    # Default 10 issues (by creation date)
vibe issue list --limit 20         # Up to 20 issues

# Create issue
vibe issue create --title "Title" --description "Description"
```

### Copilot Integration (`vibe copilot`)

```bash
# Copy issue information to clipboard
vibe copilot <issueId>

# Paste the copied content into GitHub Copilot Chat for AI collaboration
```

## 🎯 Usage Examples

### Typical Workflow

```bash
# 1. Project setup
cd my-project
vibe config init

# 2. Check current issues
vibe issue list

# 3. Create new feature issue
vibe issue create \
  --title "Implement User Authentication" \
  --description "Implement JWT-based authentication system"

# 4. Consult with AI about specific issue
vibe copilot 89ad71e1-30ac-4839-a846-502998b5da7d
```

### Actual Output Examples

**Issue List:**

```bash
$ vibe issue list

📋 Linear Issues (max 10):

1. Improve Roulette Item Edit Feature
   ID: 89ad71e1-30ac-4839-a846-502998b5da7d
   Identifier: SEO-14
   Status: Backlog
   Created: Jun 29, 2025

2. Implement Roulette Result Modal UI
   ID: 89b83591-01bc-4416-874e-1fba61e4c642
   Identifier: SEO-12
   Status: Backlog
   Created: Jun 29, 2025

💡 Tip: Use 'vibe copilot <issueId>' to share issue information with AI
```

**Issue Creation:**

```bash
$ vibe issue create --title "CLI Test Issue" --description "This is a test issue created from CLI"

✅ Issue created successfully.
📌 ID: 35a94593-af63-4a2d-b2d3-394fae752659
🔖 Identifier: SEO-8
📝 Title: CLI Test Issue
```

### Multi-Project Management

```bash
# Frontend project
cd ~/projects/frontend
vibe config init
vibe issue list

# Backend project
cd ~/projects/backend
vibe config init
vibe issue list  # Shows different project's issues
```

## ⚠️ Important Notes

### Required Settings

-   **API Token**: Linear API key required
-   **Team ID**: Linear team UUID needed
-   **Project ID**: Linear project UUID needed

### ID Format

-   Team ID and Project ID must be in **UUID format**
-   Use `vibe config teams` and `vibe config projects` commands to get correct UUIDs

### Workspace Priority

1. `.vibe-config.json` in current directory
2. `.vibe-config.json` in parent directories (recursive search)
3. Global config `~/.vibe/config.json`

### Linear API Features

-   Issues are displayed **sorted by creation date**
-   Uses GraphQL for efficient data querying
-   Accurate issue management through team and project filtering

## 📋 Configuration File Locations

### Global Config

-   **Location**: `~/.vibe/config.json`
-   **Content**: API token only
-   **Purpose**: User-specific authentication

### Workspace Config

-   **Location**: `.vibe-config.json` in project root
-   **Content**: Team ID, project ID, workspace name
-   **Purpose**: Project-specific Linear settings

### Language & Options Config

-   **Location**: `.copilot/options.json`
-   **Content**: Language setting (`language: "en" | "ko"`)
-   **Purpose**: CLI language setting and other options
-   **Example**:

```json
{
    "language": "ko"
}
```

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is distributed under the MIT License.

## 🐛 Troubleshooting

### Common Errors

**GraphQL Error:**

```
❌ Team ID and Project ID are not set. Please set them using `vibe config init` command.
```

→ Solution: Set workspace settings with `vibe config init` command

**Token Error:**

```
❌ Linear API token is not set.
```

→ Solution: Set token with `vibe config set-token <token>` command

**No Issues Found:**

```
📭 No issues match the criteria.
```

→ Check if Team ID and Project ID are correct

## 📞 Support

-   🐛 Issues: [GitHub Issues](https://github.com/SeoJaeWan/linear-vibe-cli/issues)

---

⭐ If this project is useful, please give it a star!
