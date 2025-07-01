# 🚀 Copilot Vibe CLI

A productivity maximization tool for vibe coding with GitHub Copilot Chat. Automate development workflows through Linear issue management, AI session management, and multi-language support.

[![npm version](https://badge.fury.io/js/copilot-vibe-cli.svg)](https://badge.fury.io/js/copilot-vibe-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## ✨ Key Features

-   🤖 **AI Agent Integration**: Session-based knowledge management perfectly integrated with GitHub Copilot Chat
-   📝 **Linear Issue Management**: View, create Linear issues and collaborate with AI from CLI
-   🧠 **Session Management**: Automatically save development conversations and context to accumulate knowledge
-   🌍 **Complete Multi-language Support**: Real-time Korean/English switching (JSON-based locale system)
-   ⚙️ **AI Agent-Friendly Design**: All features optimized for AI Agent automation
-   🔒 **Security-First Design**: Safely store API tokens separately
-   🗂️ **Multi-Workspace**: Independent setting management per project
-   📋 **Clipboard Integration**: Automatically copy issue information and session context to clipboard
-   🎨 **Intuitive UI**: Colorful and user-friendly CLI interface

## 🔧 Installation

```bash
npm install -g copilot-vibe-cli
```

## 🚀 Quick Start

### 1. AI Agent Integration Setup

Provide initial setup for AI Agent to automatically utilize all features:

```bash
vibe init
```

This command provides AI Agent with:

-   Complete CLI usage and command structure
-   Automatic session management instructions
-   Linear integration workflow
-   Multi-language support guidelines

### 2. Language Setting (Optional)

The CLI is set to English by default. If you prefer Korean:

```bash
vibe lang set ko
```

### 3. Linear API Token Setup

Generate a Personal API Key from [Linear Settings](https://linear.app/settings/api) and configure it:

```bash
vibe linear set-token YOUR_LINEAR_API_TOKEN
```

### 4. Workspace Initialization

Run interactive workspace initialization in your project directory:

```bash
vibe linear init
```

### 5. Start AI Session Management

Create your first development session and start collaborating with AI Agent:

```bash
# Create new session
vibe copilot save -n "project-name-feature" -t "development,feature" -c "Start new feature development" --project-type "Web Application" --tech-stack "React,TypeScript"

# Work with issues integration
vibe linear list
vibe linear issue <issue-ID>  # View issue details

# Load session (context copied to clipboard)
vibe copilot load "session-name"
```

## 🤖 AI Agent Integration Workflow

Vibe CLI is designed to allow AI Agent to automatically manage development workflows:

### 1. Automatic Session Management

```bash
# AI Agent automatically executes for every important conversation
vibe copilot edit "session-name" --append-conversation "Q: [question]\nA: [answer]\nResult: [result]"
```

### 2. Linear Issue Integration

```bash
# When starting issue work
vibe linear issue <issue-ID>  # View issue details with AI-friendly format

# Create new issue
vibe linear issue create --title "feature-name" --description "detailed description"
```

## 🔒 Security and Configuration Management

### Configuration Management

The CLI uses a unified configuration system with the `.copilot` folder:

-   **Global Storage**: API tokens remain secure in `~/.vibe/config.json`
-   **Project Settings**: All project-specific configurations in `.copilot/config.json`
-   **Recursive Search**: Automatically searches for `.copilot` folder from current directory up to parent directories
-   **Team Collaboration**: Safe to share `.copilot` folder contents with team members

### Migration from Legacy Configuration

If you have existing `.vibe-config.json` files, you can migrate to the new unified system:

```bash
# 1. Create .copilot directory
mkdir .copilot

# 2. Move your existing configuration
mv .vibe-config.json .copilot/config.json

# 3. Verify the configuration works
vibe linear config get

# 4. Optional: Initialize options if needed
echo '{"language": "en"}' > .copilot/options.json
```

### Git Safety

-   ✅ `.copilot/config.json` is **safe to commit to git**
-   ✅ `.copilot/options.json` is **safe to commit to git**
-   ✅ `.copilot/sessions.json` is **safe to commit to git** (knowledge sharing)
-   ✅ Can share project settings and sessions with team members
-   ✅ Each person only needs to set up their API token individually

### Configuration File Structure

**Global Config** (`~/.vibe/config.json`):

```json
{
    "token": "your_linear_api_token"
}
```

**Unified Project Config** (`.copilot/config.json`):

```json
{
    "workspaceName": "my-project",
    "teamId": "team-uuid-here",
    "projectId": "project-uuid-here"
}
```

**Language & Options Config** (`.copilot/options.json`):

```json
{
    "language": "en",
    "autoSave": true
}
```

**AI Session Data** (`.copilot/sessions.json`):

```json
{
    "sessions": [
        {
            "name": "feature-implementation",
            "timestamp": "2025-06-30T05:56:43.581Z",
            "tags": ["feature", "authentication"],
            "projectContext": {
                "projectType": "Web Application",
                "techStack": ["React", "Node.js"],
                "patterns": ["JWT authentication", "Middleware pattern"]
            },
            "conversation": "User authentication implementation process..."
        }
    ]
}
```

## 🏢 Multi-Project Support

You can manage independent settings and sessions for each project:

```bash
# Frontend project
cd ~/projects/frontend
vibe linear config init --name "Frontend" --team <team-id> --project <project-id>
vibe copilot save -n "frontend-setup" -t "frontend,react"

# Backend project
cd ~/projects/backend
vibe linear config init --name "Backend" --team <team-id> --project <project-id>
vibe copilot save -n "backend-api" -t "backend,nodejs"

# Manage independently in each project
vibe linear issue list    # Shows only issues for that project
vibe copilot list         # Shows only sessions for that project
```

## 📚 Command Reference

### AI Agent Initialization (`vibe init`)

Provides complete CLI usage and automation instructions to AI Agent.

```bash
vibe init  # Output AI Agent integration instructions and copy to clipboard
```

### Language Settings (`vibe lang`)

Change CLI language in real-time.

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

### Copilot Session Management (`vibe copilot`)

Systematically manage all conversations and context with AI Agent.

```bash
# Create new session (AI Agent exclusive)
vibe copilot save -n "session-name" -t "tag1,tag2" -c "initial conversation" \
  --project-type "project type" --tech-stack "tech1,tech2"

# Load session (copy context to clipboard)
vibe copilot load [session-name]

# Check session list
vibe copilot list
vibe copilot list --tag "tag-name"  # Filter by tag

# Edit session (AI Agent automatically executes)
vibe copilot edit "session-name" --append-conversation "new conversation content"
vibe copilot edit "session-name" --add-tags "new-tag1,new-tag2"
vibe copilot edit "session-name" --add-patterns "pattern1;pattern2"

# Check session details
vibe copilot show "session-name"

# Delete session
vibe copilot delete "session-name"

# Update project context
vibe copilot update-context "session-name" --project-type "new type" --add-tech "new-tech1,new-tech2"
```

### Linear Integration Management (`vibe linear`)

Handle Linear issue management and AI collaboration in one place.

```bash
# Linear configuration (simplified commands)
vibe linear set-token <token>             # Set API token
vibe linear teams                         # Available teams list
vibe linear set-team <team-ID>            # Set team
vibe linear projects                      # Current team's project list
vibe linear set-project <project-ID>      # Set project
vibe linear get-config                    # Check current settings

# Workspace initialization (interactive)
vibe linear init

# Issue management
vibe linear list                          # Issue list (default 10)
vibe linear list --limit 20               # Up to 20 issues
vibe linear create --title "title" --description "description"

# Issue details (supports both ID and Identifier)
vibe linear issue <issue-ID-or-identifier>   # View detailed issue information
vibe linear issue ABC-123                    # Using identifier
vibe linear issue 550e8400-e29b-41d4-a716-446655440000  # Using internal ID
```

## 🎯 Usage Examples

### AI Agent Integration Development Workflow

```bash
# 1. AI Agent initial setup
vibe init  # Provide complete usage to AI

# 2. Project language setting
vibe lang set ko  # When using Korean

# 3. Linear configuration
vibe linear config init  # Interactive setup

# 4. Start new feature development session
vibe copilot save -n "user-auth-implementation" -t "feature,authentication" \
  -c "Start implementing JWT-based user authentication system" \
  --project-type "Web Application" --tech-stack "React,Node.js,JWT"

# 5. Check related issues and share with AI
vibe linear issue list
vibe linear copilot ABC-123  # Copy issue information to clipboard

# 6. Automatically save development conversations (executed by AI Agent)
vibe copilot edit "user-auth-implementation" \
  --append-conversation "Q: How to verify JWT tokens?\nA: Implement middleware\nResult: Authentication logic completed"

# 7. Apply to other projects
vibe copilot load "user-auth-implementation"  # Apply previous experience to new project
```

### Actual Output Examples

**AI Agent Initialization:**

```bash
$ vibe init

🤖 Vibe CLI AI Agent Integration Instructions
=============================================================

Provides Vibe CLI tool usage and automatic session management instructions to AI Agent
  Project: copilot-vibe-cli v1.1.0
  Default session name: copilot-vibe-cli-development
  Working directory: /current/project/path
  Language: en

🎯 Purpose:
Automatically save all interactions during development to accumulate knowledge,
and maximize development productivity through Linear integration

✅ Vibe CLI AI Agent integration instructions copied to clipboard!
💡 Now paste into Copilot Chat to start integrated AI development environment.
```

**Session List:**

```bash
$ vibe copilot list

🤖 Copilot Chat Session List:

1. user-auth-implementation
   Date: Jun 30, 2025
   Project: Web Application
   Tags: feature, authentication

2. database-optimization
   Date: Jun 29, 2025
   Project: Backend API
   Tags: optimization, database

💡 Usage: vibe copilot load <session-name>
```

**Linear Issue Integration:**

```bash
$ vibe linear copilot ABC-123

📋 Linear issue information copied to clipboard!

🔗 Issue: ABC-123 - Implement User Authentication System
📝 Status: In Progress
👤 Assignee: Developer Name
📅 Created: Jun 30, 2025

💡 Now paste into Copilot Chat to consult with AI about the issue.
```

## ⚠️ Important Notes

### Required Settings for AI Agent Automation

-   **API Token**: Linear API key required
-   **Team ID**: Linear team UUID needed
-   **Project ID**: Linear project UUID needed
-   **Language Setting**: Managed in `.copilot/options.json`

### ID Format and Automation

-   Team ID and Project ID must be in **UUID format**
-   Use `vibe linear config teams` and `vibe linear config projects` commands to get correct UUIDs
-   AI Agent automatically handles session management and issue integration

### Workspace Priority

1. `.copilot/config.json` in current directory or parent directories (recursive search)
2. Global config `~/.vibe/config.json`
3. Language settings `.copilot/options.json`
4. Session data `.copilot/sessions.json`

**Note**: The CLI automatically searches for the `.copilot` folder starting from the current directory and moving up through parent directories until found.

### AI Agent Integration Features

-   **Automatic Session Saving**: AI Agent automatically updates sessions for every important conversation
-   **Context Sharing**: Instant information sharing through clipboard
-   **Knowledge Accumulation**: All development experiences saved as reusable sessions
-   **Multi-language Support**: AI Agent performs all tasks in selected language

### Linear API Features

-   Issues are displayed **sorted by creation date**
-   Uses GraphQL for efficient data querying
-   Accurate issue management through team and project filtering
-   AI Agent automatically analyzes issue information to provide context

## 🤖 AI Agent Usage Guide

### Recommended AI Agent Workflow

1. **Project Start**: `vibe init` → Provide complete instructions to AI
2. **Automatic Session Creation**: AI automatically creates sessions by task
3. **Issue Integration**: `vibe linear copilot <ID>` → AI analyzes issues
4. **Conversation Accumulation**: All Q&A automatically saved to sessions
5. **Knowledge Reuse**: Automatically load previous sessions for similar tasks

### AI Agent Auto-Execute Commands

```bash
# Commands automatically executed by AI
vibe copilot save     # Automatically create new sessions
vibe copilot edit     # Automatically add conversation content
vibe linear copilot   # Automatically analyze issue information
vibe copilot load     # Automatically load related sessions
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

**Linear GraphQL Error:**

```
❌ Team ID and Project ID are not set. Please set them using `vibe linear config init` command.
```

→ Solution: Set workspace settings with `vibe linear config init` command

**API Token Error:**

```
❌ Linear API token is not set.
```

→ Solution: Set token with `vibe linear config set-token <token>` command

**Session File Error:**

```
❌ Session file not found.
```

→ Solution: Check if `.copilot` folder exists, create first session

**Language Setting Error:**

```
❌ Unsupported language.
```

→ Solution: Use `vibe lang set ko` or `vibe lang set en`

**No Issues Found:**

```
📭 No issues match the criteria.
```

→ Check if Team ID and Project ID are correct

## 📞 Support and Contact

-   🐛 Report Issues: [GitHub Issues](https://github.com/SeoJaeWan/vibe-dev-cli/issues)
-   💬 Feature Requests: [GitHub Discussions](https://github.com/SeoJaeWan/vibe-dev-cli/discussions)
-   📧 Direct Contact: See project repository contact information

---

⭐ If this project is useful, please give it a star!

🤖 **Experience smarter development with AI Agent!**

🤖 **AI Agent와 함께 더 스마트한 개발을 경험해보세요!**
