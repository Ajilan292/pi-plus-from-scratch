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


### Mobile drawer fix v5

Fixed Material for MkDocs mobile drawer overlap by restoring a phone-specific drawer layout:
- removed desktop card/sticky constraints inside the drawer;
- restored a separate title bar and repository/source block;
- reset mobile nav row heights and wrapping;
- kept the light-blue active item style.


### Navigation and link cleanup v6

- Removed empty technical directory index files from `docs/assets`, `docs/images`, `docs/javascripts`, and `docs/stylesheets`.
- Moved the old Markdown homepage backup to `archive/index_old_home.md`.
- Added real unreferenced content pages to `mkdocs.yml` navigation:
  - `explanation/control-system.md`
  - `reference/api.md`
  - `reference/faq.md`
  - `reference/troubleshooting.md`
  - `reference/changelog.md`
- Fixed relative links in `reference/index.md` and `tutorials/intro/index.md`.


### Split-screen TOC fix v7

When the browser is half-width on desktop, the right Table of Contents is now hidden earlier at `max-width: 1220px`. The article content is then allowed to occupy the full available width, preventing the directory/content clipping shown in split-screen mode.


### Force TOC collapse v8

For split-screen desktop windows, the right-side Table of Contents now collapses earlier at `max-width: 1700px`. The patch removes not only the visual TOC, but also its layout width, flex basis, padding, margin, and reserved sidebar space.


### Force left navigation collapse v9

The persistent left navigation is now removed from the normal layout in split-screen widths. On tablet/mobile widths, it is only shown when the hamburger drawer checkbox is open; otherwise it is translated off-canvas and does not occupy layout space.


### Drawer and Reference navigation cleanup v10

- Kept homepage navigation structure unchanged.
- Removed `API`, `FAQ`, `Troubleshooting`, and `Changelog` from the Reference navigation and moved the placeholder files outside `docs/`.
- Removed `navigation.indexes` to reduce duplicate mobile drawer entries.
- Fixed split-screen drawer title overlap by hiding the logo inside the drawer title area.
- Restored visible back/parent button behavior in the mobile drawer.
- Added a mobile-only rule to hide duplicated active leaf rows such as `Hardware -> Hardware`.


### Strict navigation index v11

Navigation is now standardized across the homepage and MkDocs drawer:

- Home
  - Get Started
- Tutorials
  - First Run
  - Setup
  - Safety & Teleoperation
  - Bringup
  - Simulation Basics
  - Sim2Real Deployment
  - Troubleshooting
- Reference
  - Hardware
  - Software
  - Interfaces
  - Configuration
- Explanation
  - Sim2Real Theory
  - Design Principles
- Changelogs
  - Releases

The homepage sidebar uses clickable section titles. The MkDocs navigation was rebuilt to the same structure, with `navigation.indexes` enabled so section index titles can act as links where Material supports it.


### Logo and drawer Home link v12

- Replaced the site logo with the uploaded `2.png` file.
- Kept the same asset path `docs/assets/ht-logo-trademark.png` so homepage and Material pages both use the new trademark.
- Added a JavaScript-injected `← Home` link inside nested Material drawer levels, so users can return directly to Home after entering Tutorials / Reference / Explanation subdirectories in split-screen or mobile drawer mode.


### Drawer Home link visibility v13

The injected `← Home` link is now only created and shown at split-screen / drawer widths (`max-width: 1220px`). On full-width desktop, the extra `← Home` links are removed and hidden, so the normal sidebar stays clean.
