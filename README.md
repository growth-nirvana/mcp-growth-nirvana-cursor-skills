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

You can also run the installed binary directly:

```bash
gn-skills add
gn-skills add --global
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
```
