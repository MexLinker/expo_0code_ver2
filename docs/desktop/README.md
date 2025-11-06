# Desktop Packaging (Electron)

This folder contains docs for building and packaging the desktop app using Electron.

## Overview

- The Electron app loads the exported web build from `dist/` via an internal static HTTP server to ensure assets resolve.
- Packaging uses `electron-builder` with Windows targets.

## Quick Start

1. Export web build
   - `pnpm run export:web`
2. Run Electron locally
   - `pnpm -C electron dev`
3. Build Windows installer (on Windows)
   - `pnpm -C electron build:win`
4. Build Windows unpacked directory (macOS/Linux)
   - `pnpm -C electron build:win:dir`

## CI Recommendation

- Use GitHub Actions on `windows-latest` to run `pnpm -C electron build:win` and publish the `.exe` artifact.