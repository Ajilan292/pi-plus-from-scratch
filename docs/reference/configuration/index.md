# Configuration

This section describes how system behavior is configured, including parameter files, launch configurations, and runtime settings. Configuration enables flexible system adjustment without modifying source code.

---

## Overview

The system uses configuration files and parameters to control:

- Control behavior
- Hardware settings
- Communication settings
- Runtime options

Configurations are typically defined in structured files and loaded during system startup.

---

## Configuration Types

The system supports multiple configuration types:

- Parameter files (e.g., YAML)
- Launch configurations
- Runtime parameters

Each type serves a different purpose.

---

## Parameter Files

Parameter files define static configuration values. They are commonly written in YAML format. Typical contents include:

- Control gains
- Joint limits
- Hardware settings
- Topic names
- System thresholds

---

### Example Structure

```yaml
control:
  kp: [100.0, 100.0, 80.0]
  kd: [2.0, 2.0, 1.5]
limits:
  position: [-1.57, 1.57]
  velocity: [0.0, 5.0]## Control Parameters

Control parameters define how the robot behaves during operation. Typical parameters include:

### Proportional Gain (kp)
- Controls response strength to position error
- Higher values increase responsiveness

---

### Derivative Gain (kd)
- Controls damping
- Helps reduce oscillations

---

### Additional Parameters
- Torque limits
- Velocity limits
- Filtering coefficients

These parameters must be tuned carefully.

---

## Launch Configuration

Launch files define how the system is started. They specify:

- Which nodes to run
- Parameter files to load
- Runtime options

### Example

```bash
ros2 launch hightorque_bringup bringup.launch.py