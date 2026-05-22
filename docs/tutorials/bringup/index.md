# Bringup

This section explains how the `hightorque_bringup` package organizes the robot runtime environment and starts the core runtime nodes required by the Mini Pi plus system.

The bringup process is responsible for:

- Resolving the correct robot configuration directory from the robot model parameters
- Starting the core runtime nodes required by the robot
- Initializing the motor middleware and hardware support nodes
- Bringing up the joystick input chain
- Preparing the runtime environment for higher-level controllers and policy execution

---

## Overview

`hightorque_bringup` is used to organize the core runtime nodes and configuration files required for robot operation.

Its most common purposes are:

1. Automatically locating the correct configuration directory according to the robot configuration
2. Launching the base runtime nodes, including middleware, IMU, OLED, power, joystick, and related support components

The current main launch file is:

```bash
pi_plus_rknn.launch.py
```

---

## Required Runtime Components

A typical bringup workflow depends on a set of core runtime components, including:

- Motor middleware layer
- Message definitions
- Joystick filtering
- IMU support
- OLED support
- Power control
- Motor SDK

---

## Configuration Directory

The bringup system constructs a `robot_type` string from the following parameters:

- `model_type`
- `leg_type`
- `leg`
- `arm`
- `claw`
- `head`
- `waist`

For example:

```text
pi_plus-S-12L8A0G2H0W
```

The corresponding configuration directory is:

```text
hightorque_bringup/config/robot_config/<robot_type>/
```

This directory typically contains at least the following files:

- `robot_param.yaml`
- `pd.yaml`
- `custom_action.yaml`

---

## robot_param.yaml

`robot_param.yaml` defines robot hardware and device-level configuration.

It is mainly used by:

- Low-level drivers
- External device nodes
- Hardware-related runtime components

---

## pd.yaml

`pd.yaml` is not just a PD gain table. It should be understood as a **joint control configuration table**.

It is automatically located by `hightorque_midware_node` through the `robot_config_path` and loaded during startup.

Example path:

```text
hightorque_bringup/config/robot_config/pi_plus-S-12L8A0G2H0W/pd.yaml
```

It defines:

- `joint_names`
- `map_index`
- `direction`
- `lower` / `upper`
- `urdf_offset`
- `kp` / `kd`
- `supports_kinematics`

---

## custom_action.yaml

`custom_action.yaml` stores custom action definitions for specific robot configurations.

---

## How pd.yaml Is Used by the Middleware

During initialization, `hightorque_midware_node` uses `pd.yaml` to:

- Build the mapping between joint names and motor IDs
- Read default `kp` / `kd` values
- Align software coordinates with hardware coordinates
- Clamp outgoing commands within valid ranges

---

## Nodes Started by Bringup

### 1. hightorque_midware_node

- Package: `hightorque_midware`
- Executable: `hightorque_midware_node`

Responsibilities:

- Manage motor control ownership
- Provide control interfaces
- Convert commands to motor instructions
- Publish `/joint_states`

---

### 2. yesense_imu_node

- Package: `yesense_imu_ros2`
- Executable: `yesense_imu_node`

Responsibilities:

- Read IMU data
- Publish orientation, velocity, acceleration

---

### 3. hightorque_oled_node

- Package: `hightorque_oled`
- Executable: `hightorque_oled_node`

Responsibilities:

- Display runtime status on OLED

---

### 4. power_node

- Package: `hightorque_power`
- Executable: `power_node`

Responsibilities:

- Power monitoring and management

---

### 5. joy_linux_node

- Package: `joy_linux`
- Executable: `joy_linux_node`

Responsibilities:

- Read joystick input from `/dev/input/js0`
- Publish raw input

---

### 6. joy_mapper_node.py

- Package: `hightorque_midware`
- Executable: `joy_mapper_node.py`

Responsibilities:

- Convert raw joystick data to unified format

---

### 7. humanoid_driver

- Package: `humanoid_driver`
- Executable: `humanoid_driver`

Responsibilities:

- Joystick filtering

---

## Bringup Workflow

Bringup performs:

1. Resolve robot configuration
2. Start hardware nodes
3. Start middleware
4. Start joystick chain
5. Prepare for controllers

---

## Common Parameters

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

Namespace behavior:

- Empty `robot_id`: no namespace
- Non-empty: `robot_<robot_id>`

---

## Example

```bash
ros2 launch hightorque_bringup pi_plus_rknn.launch.py \
 model_type:=pi_plus \
 leg_type:=S \
 leg:=12 \
 arm:=8 \
 claw:=0 \
 head:=2 \
 waist:=0
```

Resolved:

```text
robot_type = pi_plus-S-12L8A0G2H0W
```

---

## Debugging Guide

Check:

1. robot_type
2. pd.yaml parameters
3. /joint_states
4. IMU / power / joy
5. policy layer

---

## Summary

`hightorque_bringup` is the runtime entry point of the robot system.

It prepares:

- Configuration
- Runtime nodes
- Middleware
- Input and sensing
