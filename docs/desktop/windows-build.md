# Windows Build Instructions

These steps produce a Windows `.exe` installer using Electron and `electron-builder`.

## Prerequisites (Windows)

- Node.js LTS and `pnpm`
- Git

## Steps

1. Install dependencies in the Electron subproject
   - `pnpm -C electron install`
2. Export the web build
   - `pnpm run export:web`
3. Build the Windows installer
   - `pnpm -C electron build:win`

Artifacts will be placed in `release-electron/`.

## Troubleshooting

- If Electron fails to start after install: approve build scripts
  - `pnpm -C electron approve-builds electron`
- If assets don’t load: ensure `dist/` exists by running `pnpm run export:web`.
- If antivirus flags the installer: sign the binary or distribute via zip/unpacked directory.