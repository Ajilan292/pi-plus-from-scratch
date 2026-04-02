# Configuration

## Overview

The PI Plus configuration system defines how the robot is identified, described, mapped to hardware, and constrained at runtime.

In this software stack, configuration is not a single file. It is composed of several coordinated layers:

- **Robot type resolution** – selects the correct configuration directory
- **Robot parameter configuration** – defines hardware-level communication and motor layout
- **Joint control configuration** – defines joint semantics, limits, gains, and offsets
- **Robot description** – defines the physical structure in URDF

Together, these files form the bridge between the physical robot and the software control stack.

---

## Configuration Directory Structure

All runtime configuration files are organized under:

```text
hightorque_bringup/config/robot_config/<robot_type>/
```

A typical configuration directory contains:

- `robot_param.yaml`
- `joints.yaml`
- `custom_action.yaml`

Not every deployment uses all files equally, but these are the core configuration artifacts referenced by the runtime system.

---

## Robot Type Resolution

The system dynamically constructs a `robot_type` from launch parameters.

Typical inputs include:

- `model_type`
- `leg_type`
- `leg`
- `arm`
- `claw`
- `head`
- `waist`

Example:

```text
pi_plus-S-12L8A0G2H0W
```

This value is then used to resolve the configuration directory and load the correct robot-specific files.

This mechanism allows one software stack to support multiple robot variants without changing the core code.

---

## Configuration Layers

The PI Plus configuration system can be understood as four connected layers:

```text
robot_type
   ↓
robot_param.yaml
   ↓
joints.yaml
   ↓
URDF / robot description
```

Each layer answers a different question:

- **robot_type** – Which robot variant is currently being used?
- **robot_param.yaml** – How is this robot wired and connected to the hardware buses?
- **joints.yaml** – How are joints defined and controlled in software?
- **URDF** – What is the kinematic and physical structure of the robot?

---

## `robot_param.yaml`

### Purpose

`robot_param.yaml` defines hardware-level communication, motor grouping, and device mapping.

It is the configuration layer that connects the software stack to the real CAN-based motor network.

### What It Contains

A typical `robot_param.yaml` includes:

- Robot name and SDK version
- Number of leg and arm degrees of freedom
- Serial interface configuration
- CAN communication type
- Runtime control mode
- IMU-related flags
- CAN board and CAN port layout
- Per-motor hardware information

### Example Structure

At the robot level:

```yaml
robot:
  SDK_version: 2
  robot_name: "PiPlus_S-12L10A2G1H0W"
  name: "PiPlus_S-12L10A2G1H0W"
  arm_dof: 6
  leg_dof: 6
  Serial_Type: "/dev/ttyACM"
  Seial_baudrate: 4000000
  canport_error_output_flag: false
  CAN_Type: "CAN-FD BRS"
  control_type: 12
```

This level defines the global communication and runtime identity of the robot.

### CAN Network Topology

The file also defines the physical motor bus structure.

Example structure:

```text
Robot
 └── CANboard
      └── CANport
           └── motor
```

In the provided example:

- `CANboard_num: 1`
- `CANport_num: 5`

These CAN ports are used to organize the robot into functional groups such as:

- Left leg
- Right leg
- Left arm
- Right arm
- Head

This is important because it shows that the robot is not treated as one flat motor list. Instead, it is organized as a distributed hardware network.

### Motor Mapping

Each motor entry includes fields such as:

- `type`
- `id`
- `name`
- `num`
- `pos_limit_enable`
- `pos_upper`
- `pos_lower`
- `tor_limit_enable`
- `tor_upper`
- `tor_lower`

Example:

```yaml
motor1:
  type: "5047_36_2"
  id: 1
  name: "l_ankle_roll_joint"
  num: 1
```

This is the key mapping layer between:

- Physical motor IDs on CAN
- Joint names used by software
- Motor model types used by the driver

### Why It Matters

`robot_param.yaml` defines how the software sees the actual hardware layout.  
Without it, the runtime system would not know:

- Which motors are on which bus
- Which joint name corresponds to which motor
- Which motor model is installed
- Which hardware safety limits are available

---

## `joints.yaml`

### Purpose

`joints.yaml` defines the logical joint configuration and motion-control semantics of the robot.

It is the most important configuration file for joint-level software behavior.

### Example Location

```text
hightorque_bringup/config/robot_config/<robot_type>/joints.yaml
```

### Core Fields

#### Identification

```yaml
name: "PiPlus_S-12L10A2G1H0W"
dofs: 25
```

- `name` identifies the joint configuration
- `dofs` defines the total number of active degrees of freedom in this configuration

#### Power Limits

```yaml
max_power: 300.0
max_power_duration: 3.0
```

These values define the allowable peak power envelope for the robot.

#### Kinematics Plugin

```yaml
kinematics_plugin:
  name: ""
```

This field indicates whether a kinematics plugin is configured.  
In the provided example, no plugin is specified.

#### Joint Names

```yaml
joint_names: [
  "l_ankle_roll_joint", "l_ankle_pitch_joint", "l_calf_joint", "l_thigh_joint", "l_hip_roll_joint", "l_hip_pitch_joint",
  "r_ankle_roll_joint", "r_ankle_pitch_joint", "r_calf_joint", "r_thigh_joint", "r_hip_roll_joint", "r_hip_pitch_joint",
  "l_shoulder_pitch_joint", "l_shoulder_roll_joint", "l_upper_arm_joint", "l_elbow_joint", "l_wrist_joint", "l_claw_joint",
  "r_shoulder_pitch_joint", "r_shoulder_roll_joint", "r_upper_arm_joint", "r_elbow_joint", "r_wrist_joint", "r_claw_joint",
  "head_yaw_joint"
]
```

This list defines the software-visible joint order.

#### Motor Mapping

```yaml
map_index: [0, 1, 2, ..., 24]
```

This maps logical joint indices to motor indices.

#### Direction

```yaml
direction: [1, 1, -1, ...]
```

This field corrects motor sign conventions so that software commands align with physical motion.

#### Limits

```yaml
lower: [...]
upper: [...]
```

These define software-level joint limits in radians.

#### Gains

```yaml
kp: [...]
kd: [...]
```

These define default PD gains for each joint.

In the provided example:

- Leg joints use higher gains
- Arm, claw, and head joints use lower gains
- Hip roll joints use especially high `kp`

This reflects different control requirements across joint groups.

#### URDF Offset

```yaml
urdf_offset: [0.0, 0.0, ...]
```

These values define the offset between the software model zero and the real motor zero.

In the provided example, all offsets are currently zero.

### What `joints.yaml` Controls

From the software point of view, `joints.yaml` determines:

- Joint naming and order
- Mapping to motor indices
- Direction correction
- Joint safety bounds
- Default PD control gains
- Zero-position alignment between model and hardware

### Why It Matters

This file is the control semantics layer of the robot.

A useful interpretation is:

- `robot_param.yaml` tells the system **how hardware is wired**
- `joints.yaml` tells the system **how that hardware should be interpreted and controlled**

---

## `custom_action.yaml`

### Purpose

`custom_action.yaml` is used to store robot-specific predefined actions when needed.

Typical use cases may include:

- Demo motions
- Preset behaviors
- Configuration-specific actions

If a deployment does not rely on predefined actions, this file may remain optional or minimally used.

---

## URDF and Robot Description

### Purpose

The URDF defines the physical and kinematic structure of the robot.

It includes:

- Links
- Joints
- Joint axes
- Joint limits
- Inertial properties
- Collision geometry
- Fixed components such as the torso and camera

### What the URDF Describes

From the provided robot description, the configuration includes:

- Bilateral 6-DOF legs
- Waist joint
- Torso
- Bilateral arms
- Head yaw and pitch joints
- Camera link

The URDF therefore describes the actual articulated structure of the robot, including both motion-capable joints and fixed structural parts.

### Joint Information in URDF

Each joint typically defines:

- Parent and child links
- Axis of motion
- Lower and upper motion bounds
- Effort limits
- Velocity limits
- Damping and friction

This means the URDF is the source of the robot's physical structure, while `joints.yaml` defines how that structure is used by the control system.

### Collision and Inertial Models

The URDF also contains:

- Link masses
- Inertia matrices
- Simplified collision geometry

These are used for:

- Visualization
- Simulation
- Physical modeling
- Kinematic interpretation

---

## Relationship Between Files

The full configuration flow can be understood as follows:

### 1. Robot Variant Selection

Launch parameters determine `robot_type`.

### 2. Hardware Layout Resolution

`robot_param.yaml` defines:

- CAN structure
- Motor devices
- Hardware grouping
- Per-motor identifiers

### 3. Joint Semantics Definition

`joints.yaml` defines:

- Joint ordering
- Joint semantics
- Limits
- Gains
- Direction and offsets

### 4. Physical Structure Definition

URDF defines:

- The actual robot structure
- Link/joint topology
- Physical and collision properties

Together, these files allow the runtime stack to map:

```text
Software joint command
    ↓
Joint semantic definition
    ↓
Motor mapping
    ↓
CAN motor device
    ↓
Physical robot motion
```

---

## Runtime Use of Configuration

At startup, the runtime system typically follows this sequence:

1. Launch the robot with a given parameter set
2. Resolve `robot_type`
3. Locate the matching configuration directory
4. Load:
   - `robot_param.yaml`
   - `joints.yaml`
   - `custom_action.yaml` (if used)
5. Initialize middleware and drivers
6. Begin robot runtime

This means the configuration system is not static documentation.  
It is actively consumed by the runtime stack during system initialization.

---

## Multi-Variant Support

The configuration mechanism is designed to support multiple robot variants without changing the core software.

Different variants can differ in:

- Number of joints
- Arm or claw configuration
- Head configuration
- CAN bus grouping
- Control gains and offsets

This is one of the main strengths of the PI Plus software design.

---

## Practical Notes

### Direction Calibration

If a joint moves in the wrong direction, the corresponding `direction` entry should be checked first.

### Joint Mapping Validation

If commands appear to move the wrong motor, verify:

- `joint_names`
- `map_index`
- motor `name` entries in `robot_param.yaml`

### Gain Tuning

If motion is unstable or too soft, inspect:

- `kp`
- `kd`

Gain tuning is configuration-dependent and can differ significantly between legs, arms, claws, and head joints.

### Zero Alignment

If the software posture does not match the physical neutral posture, inspect:

- `urdf_offset`
- zero-calibration results
- consistency between URDF and hardware configuration

### Limits

If commanded motion is unexpectedly clamped, inspect:

- `lower`
- `upper`
- any motor-level limit settings in `robot_param.yaml`

---

## Summary

The PI Plus configuration system is composed of multiple coordinated layers:

- `robot_type` selects the robot variant
- `robot_param.yaml` defines the hardware communication layout
- `joints.yaml` defines control semantics
- URDF defines physical structure and kinematics

Together, these files form the system definition layer of the robot.

They are essential because they allow one software stack to support multiple robot variants while preserving a clean abstraction between hardware, control, and structure.
