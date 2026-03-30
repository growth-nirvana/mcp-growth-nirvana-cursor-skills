# Growth Nirvana Skills

Give your AI assistant deep, project-aware knowledge of Growth Nirvana bundles, model variants, and MCP query workflows.

## Install

Run from a Cursor project:

```bash
npx @growthnirvana/skills add
```

Install globally (all projects):

```bash
npx @growthnirvana/skills add --global
```

Create a project `mcp.json` template:

```bash
npx @growthnirvana/skills init-mcp
```

You can also run the installed binary directly:

```bash
gn-skills add
gn-skills add --global
gn-skills init-mcp
```

## MCP Server Setup

Installing MCP config per project is normal. Use:

```bash
gn-skills init-mcp
```

This creates `mcp.json` in your current repository. It uses environment variables for credentials:

```json
"/bin/zsh -lc \"... if [ -z \\\"$GROWTH_NIRVANA_API_KEY\\\" ]; then ...; npx -y @growthnirvana/mcp-server\""
```

Set your key in either your project `.env.local` (recommended) or shell profile:

```bash
echo 'GROWTH_NIRVANA_API_KEY="your_api_key_here"' >> .env.local
```

Or shell profile (`~/.zshrc`, `~/.bashrc`, etc.):

```bash
export GROWTH_NIRVANA_API_KEY="your_api_key_here"
```

Then reload Cursor.

Useful options:

- `gn-skills init-mcp --target .cursor/mcp.json`
- `gn-skills init-mcp --force`
- `gn-skills init-mcp --pin-server-version 1.2.3`

### Verify env var expansion

1. Confirm `.env.local` expansion:

```bash
echo 'GROWTH_NIRVANA_API_KEY="test_key_123"' > .env.local
/bin/zsh -lc 'set -a; [ -f .env.local ] && source .env.local; set +a; echo "$GROWTH_NIRVANA_API_KEY"'
```

2. Confirm generated config has shell-based launch:

```bash
node scripts/install.js init-mcp --target .tmp-install-test/mcp.json --force
```

3. In Cursor, reload and start the MCP server. If the key is missing, startup fails with:

```text
Missing GROWTH_NIRVANA_API_KEY
```

## What It Enables

- Bundle export workflows
- Query answering from downloaded bundles
- Variant-aware model selection (`combined_report`, `combined_report_ff`, `combined_report_catalog`)
- MCP dry-run/execute flows with result retrieval (`include=results`)

## Example Prompts

- "What channels is `<client name>` using?"
- "Spend by channel for Feb 2026 for `<client name>`."
- "For Deepgram, give me CTR and CPC by channel for Feb 2026."
- "Draft a new transformation and dry-run it."

## How It Works

1. Detect dataset via `dataset/dataset.json` and `displayName`.
2. Select the correct reporting model variant.
3. Validate columns from warehouse field metadata.
4. Execute via MCP when needed.
5. Return evidence-backed answers.

## Included Skills

- `growth-nirvana-dataset-export`
- `growth-nirvana-bundle-query-transform`
- `growth-nirvana-bundle-query`
- `growth-nirvana-transform-authoring`

## Development

From this repo root:

```bash
node scripts/install.js add
node scripts/install.js add --global
node scripts/install.js init-mcp
```
