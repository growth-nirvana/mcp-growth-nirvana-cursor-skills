# Growth Nirvana Skills Pack Repo Summary

## Repo Goal

Publish a **Growth Nirvana Skill Pack** that customers install with one command, for example:

```bash
npx skills add @growthnirvana/skills
```

or:

```bash
npx @growthnirvana/skills add
```

---

## Suggested Repo Structure

```text
growth-nirvana-skills/
  README.md
  package.json
  scripts/
    install.js
  skills/
    growth-nirvana-dataset-export/
      SKILL.md
      reference.md
    growth-nirvana-bundle-query-transform/
      SKILL.md
      reference.md
      examples.md
      common-queries.md
    growth-nirvana-bundle-query/
      SKILL.md
      common-queries.md
      examples.md
      troubleshooting.md
    growth-nirvana-transform-authoring/
      SKILL.md
      examples.md
      troubleshooting.md
```

---

## package.json (minimal concept)

- Name: `@growthnirvana/skills`
- Bin command: `gn-skills`
- `postinstall` optional, but explicit install command is preferred
- Command behavior:
  - `gn-skills add` -> installs skills into `.cursor/skills`
  - `gn-skills add --global` -> installs into `~/.cursor/skills`

---

## Installer Behavior (`scripts/install.js`)

1. Detect target:
   - default: current repo `.cursor/skills`
   - `--global`: `~/.cursor/skills`
2. Ensure target exists.
3. Copy all folders from `skills/` into target.
4. Print installed skill names.
5. Print: "Restart/reload Cursor".

---

## README Template (for new repo)

### Title

**Growth Nirvana Skills**

### Description

Give your AI assistant deep, project-aware knowledge of Growth Nirvana bundles, model variants, and MCP query workflows.

### Install

```bash
npx @growthnirvana/skills add
```

### What it enables

- Bundle export workflows
- Query answering from downloaded bundles
- Variant-aware model selection (`combined_report`, `combined_report_ff`, `combined_report_catalog`)
- MCP dry-run/execute flows with result retrieval (`include=results`)

### Example prompts

- "What channels is `<client name>` using?"
- "Spend by channel for Feb 2026 for `<client name>`."
- "For Deepgram, give me CTR and CPC by channel for Feb 2026."
- "Draft a new transformation and dry-run it."

### How it works

1. Detect dataset via `dataset/dataset.json` and `displayName`.
2. Select correct reporting model variant.
3. Validate columns from warehouse field metadata.
4. Execute via MCP when needed.
5. Return evidence-backed answers.

---

## Distribution Options

- **NPM package** (best DX): `npx ... add`
- **GitHub release zip** + one-line curl installer
- **Private npm registry** for private customer base

---

## Versioning Recommendation

- Use semver tags (`v1.0.0`, `v1.1.0`)
- Add `CHANGELOG.md`
- Keep skill output fingerprints versioned (`workflow: ...@vX`)

