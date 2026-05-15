# Release Notes

## Overview

This document records the release history, major updates, improvements, and known issues of the PI Plus platform.

Each release follows a structured format to ensure traceability and clarity for developers and users.

---

## Versioning Scheme

The platform uses a semantic versioning format:

```
MAJOR.MINOR.PATCH
```

- **MAJOR**: Breaking changes or major architectural updates 
- **MINOR**: New features and improvements 
- **PATCH**: Bug fixes and minor adjustments 

---

## [v1.0.0] - Initial Release

### Highlights

- First stable release of PI Plus platform 
- Full configuration-driven architecture 
- Joint-centric control model implemented 
- CAN-FD based motor communication supported 
- Basic humanoid configuration (25 DOF) supported 

---

### Features

#### Core System

- Modular system architecture (hardware → control → behavior → intelligence)
- Configuration-driven robot definition:
 - `robot_param.yaml`
 - `joints.yaml`
 - URDF integration
- Multi-robot variant support via `robot_type`

#### Control

- Joint-level control interface
- PD controller support (kp, kd configurable per joint)
- Joint limits enforcement
- Direction mapping and offset calibration

#### Hardware Interface

- CAN-FD communication support
- Multi-CAN port architecture
- Motor abstraction layer

#### Simulation Compatibility

- Consistent joint definition with URDF
- Sim-to-real compatible joint ordering and mapping

---

### Improvements

- Improved configuration clarity and structure
- Unified joint naming conventions
- Better separation between hardware and control layers

---

### Known Issues

- No built-in state estimator (EKF/UKF not included)
- Limited built-in debugging tools
- Manual tuning required for gains (kp/kd)
- Some configuration fields lack validation

---

### Notes

- This release is designed primarily for developers and researchers
- Not optimized for plug-and-play usage
- Recommended to verify configuration before deployment

---

## Future Plans

### Planned Features

- State estimation module (EKF / sensor fusion)
- Improved debugging and visualization tools
- Auto-calibration utilities
- Higher-level behavior APIs

### Long-Term Direction

- Better integration with AI agent systems (e.g., OpenClaw)
- Improved sim-to-real transfer pipelines
- Enhanced multi-robot scalability

---

## Contribution

If you find issues or want to contribute:

- Submit bug reports 
- Propose improvements 
- Contribute new modules or configurations 

---

## Summary

This release establishes the foundation of the PI Plus platform:

- Modular 
- Configurable 
- Extensible 
- Ready for integration with modern robotics and AI systems 
