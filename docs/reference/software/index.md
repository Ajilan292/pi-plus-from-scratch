# Software System

## Overview

The PI Plus software system is built on ROS2 and follows a modular, layered architecture. Each layer has a clearly defined responsibility, enabling flexibility, scalability, and safe control.

The system is composed of the following layers:

- **Bringup Layer** – System initialization and configuration loading (`hightorque_bringup`)
- **Middleware Layer** – Motor control abstraction and arbitration (`hightorque_midware`)
- **Driver Layer** – Hardware interfaces (motors, IMU, power, OLED, and related devices)
- **Teleoperation Layer** – Manual control via joystick input and input mapping
- **Policy Runtime Layer** – High-level control such as reinforcement learning policies, scripts, and onboard inference

The key design principle of the software system is:

> The robot is never controlled directly at the motor level. All control flows through the middleware abstraction layer.

---

## System Architecture

The PI Plus software stack can be understood as a layered runtime pipeline:

```text
[ Teleoperation / Policy / Script ]
 ↓
 /request_control
 ↓
 /control_command
 ↓
 hightorque_midware_node
 ↓
 Motor Driver (CAN)
 ↓
 Robot

Feedback:
Robot → /joint_states → Controller / Policy
```

In this structure:

- Higher-level modules do not communicate with motors directly
- All motion commands must be submitted through the middleware
- Robot state is published back to the upper layers through standard feedback topics

### Teleoperation Pipeline

The teleoperation input chain is organized as follows:

```text
joy_linux_node
 ↓
joy_input
 ↓
joy_mapper_node.py
 ↓
hightorque_joy
 ↓
/control_command
```

This pipeline separates raw controller input from robot-specific control semantics.

---

## Core Components

### 1. `hightorque_bringup`

`hightorque_bringup` is the software entry point used to initialize the robot runtime environment.

Its responsibilities include:

- Constructing `robot_type` dynamically from launch parameters
- Resolving the correct configuration directory
- Loading robot configuration files
- Launching all required base runtime nodes

A typical startup command is:

```bash
ros2 launch hightorque_bringup pi_plus_rknn.launch.py
```

The launch system uses parameters such as:

- `model_type`
- `leg_type`
- `leg`
- `arm`
- `claw`
- `head`
- `waist`

These are combined into a `robot_type`, for example:

```text
pi_plus-S-12L8A0G2H0W
```

The corresponding configuration directory is:

```text
hightorque_bringup/config/robot_config/<robot_type>/
```

This directory usually contains:

- `robot_param.yaml`
- `joints.yaml`
- `custom_action.yaml`

---

### 2. `hightorque_midware_node`

`hightorque_midware_node` is the core control component of the software system.

It is responsible for:

- Abstracting low-level motor control
- Managing control ownership between multiple clients
- Accepting position, torque, and mixed control commands
- Converting upper-layer commands into motor-level instructions
- Publishing feedback and session state

This node provides the following core interfaces:

#### Services

- `/get_available_motors`
- `/request_control`
- `/release_control`
- `/reset_zero`

#### Topics

- `/control_command`
- `/joint_states`
- `/session_status`

This node is the central motor-control middleware of the robot. Controllers, test scripts, teleoperation tools, and policy runtimes all communicate with the robot through this node rather than operating motors directly.

---

### 3. Driver Nodes

The driver layer handles hardware interaction and state acquisition.

Typical nodes include:

#### `humanoid_driver`

- Motor driver layer
- Responsible for low-level communication with actuators

#### `yesense_imu_node`

- Reads IMU device data
- Publishes torso orientation, angular velocity, and acceleration
- Provides posture information required by balance control, state estimation, and policy control

#### `power_node`

- Handles power-related status management
- Reads and publishes battery or supply information
- Serves as the entry point for power monitoring and low-voltage warning behavior

#### `hightorque_oled_node`

- Drives the onboard OLED screen
- Displays local system information and runtime status
- Provides a direct hardware-level status display during field debugging

---

### 4. Teleoperation Components

The teleoperation layer is composed of several independent modules:

#### `joy_linux_node`

- Reads raw joystick input from `/dev/input/js0`
- Publishes the raw joystick topic
- Remaps the default joystick topic to `joy_input`

This node is responsible only for input collection and does not interpret the control semantics.

#### `joy_mapper_node.py`

- Subscribes to `joy_input`
- Converts raw Linux joystick values into the internal control representation
- Publishes `hightorque_joy`

This module acts as the joystick protocol translation layer.

#### `humanoid_driver`

- Used for joystick filtering and related processing in the current stack

---

## Control Model

### Control Ownership Mechanism

Before sending control commands, a client must first request control ownership from the middleware.

The standard workflow is:

1. Start `hightorque_midware_node`
2. Call `/request_control`
3. Receive a `uuid`
4. Continuously publish commands to `/control_command` using that `uuid`
5. Release the control session through `/release_control`

The middleware therefore enforces exclusive motor control through a session-based mechanism.

---

### Request and Release Interfaces

#### Request Control

Control must be requested through:

```text
/request_control
```

The returned result includes a session identifier:

```text
uuid
```

This `uuid` must be attached to every subsequent command.

#### Release Control

When the control session is no longer needed, it must be explicitly released via:

```text
/release_control
```

---

### Control Modes

The middleware supports three control modes.

#### 1. POSITION Mode

- Position-based control
- Positions must be provided
- `kp` and `kd` are used
- `torques` are ignored or treated as zero

This is the default and most commonly used control mode.

#### 2. TORQUE Mode

- Torque-based control
- `torques` must be provided
- `positions`, `kp`, and `kd` are treated as zero

This mode is used for advanced control and policy-based motor output.

#### 3. MIXED Mode

- Mixed position and torque control
- Each motor can be controlled independently as either a position-controlled motor or a torque-controlled motor
- `positions`, `torques`, `kp`, and `kd` must all match the length of `motor_ids`

This mode is useful for hybrid control designs.

---

### Release and Timeout Behavior

When a session is released or a timeout occurs, the system can enter one of the following behaviors:

- `KEEP_MODE` – Keep the previous command
- `DAMPING_MODE` – Enter damping mode
- `ZERO_TORQUE_MODE` – Apply zero torque

From a safety perspective, `DAMPING_MODE` is recommended during debugging and normal testing.

---

## Zero Calibration

The middleware also provides a dedicated zero-calibration service:

```text
/reset_zero
```

This service sets the current position of all motors as the zero position and writes the result into motor-side persistent storage.

### Preconditions

Before calling `/reset_zero`:

- `hightorque_midware_node` must be running
- No active control session may exist
- All motors must be reachable and communicable

### Important Notes

- During zero calibration, the motors enter zero-torque mode
- The robot must be placed on a zero-position fixture or a physically safe support structure
- The call is blocking and returns only after calibration is complete or fails
- The default timeout is 10000 ms
- Calibration is considered complete when all motor-reported absolute positions are within 0.1 rad
- Regardless of success or failure, the motor power should be restarted afterward

This mechanism is part of the software stack because it is implemented and managed through the middleware service interface rather than through a manual low-level motor procedure.

---

## Configuration System

### `robot_param.yaml`

`robot_param.yaml` contains robot hardware and device-level configuration.

It is mainly used by:

- Driver nodes
- Hardware-dependent runtime modules
- External peripherals

This file is more closely related to hardware connection and device setup.

---

### `joints.yaml`

`joints.yaml` is the most important control-related configuration file in the software stack.

It is a joint control configuration table located under:

```text
hightorque_bringup/config/robot_config/<robot_type>/joints.yaml
```

It defines:

- `name` – Configuration name
- `dofs` – Number of degrees of freedom
- `supports_kinematics` – Whether kinematics support is enabled
- `max_power` – Maximum power limit
- `max_power_duration` – Maximum duration for peak power
- `joint_names` – Joint name list
- `map_index` – Mapping from logical joints to motor IDs
- `direction` – Sign correction for each motor
- `lower` / `upper` – Joint limits in radians
- `kp` / `kd` – Default PD gains
- `urdf_offset` – Offset between URDF zero and actual motor zero

### How `joints.yaml` Is Used

During startup, `hightorque_midware_node` uses `joints.yaml` to:

- Build the mapping from joint names to motor IDs
- Read default `kp` and `kd` values as fallback parameters for position control
- Read `direction` and `urdf_offset` to align software coordinates with hardware coordinates
- Read `lower` and `upper` to enforce command clamping

A useful mental model is:

- `robot_param.yaml` defines **device and hardware connection**
- `joints.yaml` defines **joint semantics and control behavior**

---

### `custom_action.yaml`

`custom_action.yaml` stores custom actions for specific robot configurations.

It is used when a particular mechanical configuration requires preset or special motion behavior that should be loaded together with the robot type.

---

## Bringup Runtime Behavior

The bringup system can be understood as providing the base runtime environment of the whole robot.

Its responsibilities are:

1. Resolve the correct robot configuration
2. Start hardware-related base nodes
3. Start the motor middleware (`hightorque_midware_node`)
4. Start the joystick input chain
5. Reserve the integration point for higher-level controllers or policy runtimes

Because of this, `hightorque_bringup` should not be seen as a single algorithm node. It is the startup center of the robot runtime.

---

## Common Launch Parameters

The current launch system supports the following commonly used parameters:

- `robot_id`
- `model_type`
- `leg_type`
- `leg`
- `arm`
- `claw`
- `head`
- `waist`
- `default_timeout_ms`
- `policy_name`

### Namespace Behavior

- If `robot_id` is empty, no namespace is added
- If `robot_id` is provided, all nodes are launched under:

```text
robot_<robot_id>
```

This supports multi-robot deployment and avoids topic collisions.

---

## Runtime Extension

The software stack supports higher-level control through policy runtimes and external execution modules.

### Example: Instinct Onboard

A typical runtime sequence is:

```bash
# Start the base robot system
ros2 launch hightorque_bringup pi_plus_rknn.launch.py

# Move the robot to a safe zero posture
ros2 run hightorque_midware move_to_zero.py

# Activate the policy runtime
python scripts/piplus_parkour.py --logdir <policy_dir> --standdir <policy_dir>
```

In this workflow:

- The bringup layer initializes the robot runtime
- The middleware layer manages safe motor control
- The runtime layer performs policy execution and inference

This design allows the same robot software stack to support:

- Teleoperation
- Test scripts
- Learned policy deployment
- Future agent-based control frameworks

---

## Developer Notes

### Middleware-Centric Design

The software stack is built around a middleware-centered control design:

```text
client → middleware → motor
```

This is the most important architectural property of the system.

It ensures:

- Safe control arbitration
- Uniform command semantics
- A stable abstraction layer between control logic and hardware execution

---

### Decoupled System Design

The stack deliberately separates:

- Hardware drivers
- Control arbitration
- Input devices
- Higher-level control logic

This allows developers to modify controllers, teleoperation nodes, or learned policies without changing the motor driver implementation.

---

### Extensibility

Developers can extend the system by:

- Writing custom ROS2 control nodes
- Integrating learned policies
- Modifying `joints.yaml` for new morphologies
- Adding network-based or agent-based control interfaces

This makes the stack suitable not only for operation, but also for platform-level robotics development.

---

## Summary

The PI Plus software system provides:

- A layered architecture
- Unified control through middleware abstraction
- Clear separation between bringup, control, drivers, and runtime logic
- Strong support for extension, policy deployment, and safe debugging

Its core value lies in turning the robot from a collection of hardware components into a controllable, extensible software platform.
