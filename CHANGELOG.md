# Changelog

All notable changes to this project will be documented in this file.

## 1.2.1 - 2026-03-30

- Fixed generated MCP launch command to work with `growth-nirvana-mcp-server` package that does not expose a `bin` entry.
- Updated MCP bootstrap docs to use `npx --package ... node -e "import(...)"`.
- Kept default MCP config target as `.cursor/mcp.json`.

## 1.2.2 - 2026-03-30

- Switched generated MCP launch command back to idiomatic `npx -y growth-nirvana-mcp-server`.
- Assumes `growth-nirvana-mcp-server` is published with a `bin` executable.

## 1.0.0 - 2026-03-30

- Added installable Cursor skills package scaffolding.
- Added `gn-skills add` for local/global skill installation.
- Added `gn-skills init-mcp` for generating project `mcp.json`.
- Added `--pin-server-version` support for MCP server package pinning.
- Added `.env.local` and `.env` loading in generated MCP startup command.
