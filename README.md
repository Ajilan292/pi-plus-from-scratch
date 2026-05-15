# PI Plus Documentation - Desktop Copy

This is a clean copy of the PI Plus documentation project, created on 2026-03-27.

## Project Overview

Complete documentation system for PI Plus humanoid robot platform, featuring:

- **Modern UI**: Card-based layout with background image
- **Complete Tutorials**: 8 modules from setup to deployment
- **Technical Reference**: Hardware, software, interfaces, configuration
- **Theory Explanations**: System architecture, control stack, sim2real
- **Get Started Guide**: Complete beginner's introduction

## Files Included

1. **`docs/`** - Complete documentation source
   - `index.md` - Homepage with card layout
   - `get-started.md` - Comprehensive getting started guide
   - `tutorials/` - 8 tutorial modules
   - `reference/` - 4 reference categories
   - `explanation/` - 5 theory documents
   - `assets/` - Images and resources
   - `stylesheets/extra.css` - Custom UI styling
   - `javascripts/extra.js` - Custom JavaScript

2. **`mkdocs.yml`** - MkDocs configuration
3. **`.gitignore`** - Git ignore rules

## How to Use

### 1. Install MkDocs
```bash
pip install mkdocs mkdocs-material
```

### 2. Serve Locally
```bash
mkdocs serve -a 127.0.0.1:8000
```

### 3. Build Static Site
```bash
mkdocs build --clean
```

## Access URLs

- **Local Development**: http://127.0.0.1:8000/
- **GitHub Repository**: https://github.com/Ajilan292/pi-plus-from-scratch
- **GitHub Pages**: https://ajilan292.github.io/pi-plus-from-scratch/ (if enabled)

## Features

### UI Design
- Card-based grid layout
- Hero background image
- Responsive design
- Material for MkDocs theme

### Documentation Structure
```
docs/
├── index.md                    # Homepage
├── get-started.md              # Getting Started
├── tutorials/                  # 8 tutorial modules
│   ├── intro/                  # Introduction
│   ├── setup/                  # Setup
│   ├── first-run/              # First Run
│   ├── safety-and-teleop/      # Safety & Teleoperation
│   ├── bringup/                # ROS2 Bringup
│   ├── sim-basics/            # Simulation Basics
│   ├── sim2real-deploy/       # Sim2Real Deployment
│   └── troubleshooting/        # Troubleshooting
├── reference/                  # 4 reference categories
│   ├── hardware/              # Hardware Reference
│   ├── software/              # Software Reference
│   ├── interfaces/            # Interfaces Reference
│   └── configuration/         # Configuration Reference
├── explanation/                # 5 theory documents
│   ├── system-architecture.md # System Architecture
│   ├── control-stack.md       # Control Stack
│   ├── sim2real.md           # Sim2Real Theory
│   ├── design-principles.md   # Design Principles
│   └── control-system.md      # Control System
└── changelogs/                # Release Notes
```

### Key Technical Decisions

1. **Link Format**: All links use MkDocs directory format (`tutorials/intro/` not `tutorials/intro/index.md`)
2. **UI Customization**: Custom CSS for card layout and background
3. **Content Organization**: Clear separation between tutorials, reference, and explanation
4. **Git Integration**: Ready for version control and GitHub Pages deployment

## Excluded Files

The following files were excluded from this copy:
- Temporary test files (`test-*.html`, `diagnose_*.py`)
- Build artifacts (`site/`)
- Git history (`.git/` directory)
- OpenClaw workspace files

## License

This documentation is part of the PI Plus project.

---

**Copy Date**: 2026-03-27  
**Source**: `/home/sunteng/.openclaw/workspace/pi-plus-from-scratch/`  
**Destination**: `/home/sunteng/Desktop/pi-plus-docs-copy/`

## Homepage integration note

This package keeps the original MkDocs documentation project, including `.git`, `.github`, `docs/`, `mkdocs.yml`, and all existing documentation pages.

The homepage is now implemented as a raw static page at:

```text
docs/index.html
```

Its dedicated stylesheet and assets are:

```text
docs/stylesheets/home-static.css
docs/assets/home-hero-wide.png
docs/assets/ht-logo-trademark.png
```

Run locally with:

```bash
mkdocs serve
```

The raw homepage avoids MkDocs Material's `.md-grid` layout restriction while the rest of the documentation still uses MkDocs Material.

## UI integration update

This version uses a hybrid approach:

- `docs/index.html` is a raw full-width static homepage to avoid MkDocs Material width limitations.
- Normal documentation pages still use MkDocs Material.
- `docs/stylesheets/home-static.css` controls the homepage only.
- `docs/stylesheets/extra.css` controls the normal documentation pages.
- The HighTorque trademark image is stored at `docs/assets/ht-logo-trademark.png` and is used by both the homepage and Material pages.

For local preview:

```bash
mkdocs serve
```

If the browser is narrow or half-screen, the homepage now hides the right price block earlier and relaxes hero text width to avoid overlapping.


### Navigation alignment update

The left homepage navigation and the normal MkDocs left/right navigation panels now use fixed viewport-height cards so they visually align with the central content panel. On narrow screens, these fixed heights are disabled to avoid text overlap.


### UI cleanup update v4

- Removed emoji icons from normal documentation content and table-of-contents headings.
- Homepage decorative icons are kept.
- Changed the selected item color in the left navigation from deep blue to a light-blue active state.
