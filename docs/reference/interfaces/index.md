# Interfaces

## Overview

This document describes the external interfaces of the Mini Pi plus software system. 
All robot interactions are performed through ROS2 topics and services, centered around the middleware (`hightorque_midware_node`).

Interfaces are divided into three categories:

- **Control Interfaces** – command and control flow
- **State Interfaces** – robot feedback and sensing
- **Utility Interfaces** – system tools and calibration

---

## Control Interfaces

### 1. `/request_control` (Service)

Request exclusive control of the robot.

#### Description
Before sending any control command, a client must request a control session.

#### Response
```text
uuid: string
```

---

### 2. `/release_control` (Service)

Release the current control session.

---

### 3. `/control_command` (Topic)

Primary motor control interface.

#### Message Definition

```text
std_msgs/Header header
string uuid
int32[] motor_ids
float32[] positions
float32[] velocities
float32[] kp
float32[] kd
float32[] torques
```

#### Description

- `uuid` – control session identifier
- `motor_ids` – target motor IDs
- `positions` – target joint positions (rad)
- `velocities` – target velocities (rad/s)
- `kp`, `kd` – optional PD gains
- `torques` – optional feedforward torque

Supports:

- POSITION control
- TORQUE control
- MIXED control

---

### 4. `/session_status` (Topic)

Provides control session status.

```text
std_msgs/Header header
string state
string policy_name
string policy_file_name
string[] active_uuids
string[] node_names
int32[] motor_counts
```

---

## State Interfaces

### 1. `/joint_states` (Topic)

Standard joint state feedback.

```text
sensor_msgs/JointState
```

Includes:

- joint positions
- velocities
- efforts

---

### 2. IMU Interfaces (`yesense_imu_ros2`)

#### `/yesense_imu/rpy`
```text
geometry_msgs/Vector3
```
Roll, Pitch, Yaw (degrees)

#### `/yesense_imu/acc`
```text
geometry_msgs/Vector3
```
Linear acceleration (m/s²)

#### `/yesense_imu/gyro`
```text
geometry_msgs/Vector3
```
Angular velocity (°/s)

#### `/yesense_imu/quat`
```text
geometry_msgs/Quaternion
```

#### `/yesense_imu/imu`
```text
sensor_msgs/Imu
```

---

### 3. Policy / Data Stream Interface

```text
std_msgs/Header header
string data_type
float64[] data
```

#### Description

- `data_type`: state_q / obs / input / action / output_q
- `data`: numerical payload

---

## Teleoperation Interface

### `/hightorque_joy` (Topic)

Joystick abstraction message.

```text
float32 l_horizontal
float32 l_vertical
float32 lt
float32 r_horizontal
float32 r_vertical
float32 rt
float32 dpad_horizontal
float32 dpad_vertical
float32 a
float32 b
float32 x
float32 y
float32 lb
float32 rb
float32 back
float32 start
float32 center
float32 l
float32 r
std_msgs/Header header
```

---

## Utility Interfaces

### 1. `/get_available_motors` (Service)

Returns available motor IDs.

---

### 2. `/reset_zero` (Service)

Zero calibration for motors.

#### Description

- Sets current motor position as zero
- Writes calibration to hardware

#### Requirements

- No active control session
- Robot must be physically stabilized

---

## Low-Level Communication (CAN)

Motor communication is handled via CAN bus.

### Characteristics

- SocketCAN interface
- Raw frame transmission
- Asynchronous receive thread

### Key Operations

- `send(can_id, data, len)`
- `receive()`
- `receive_callback()`

This layer is abstracted and not exposed directly to users.

---

## Summary

The interface design follows a strict middleware-centered model:

```text
Client → Middleware → Motor
```

This ensures:

- Safe multi-client control
- Unified command structure
- Hardware abstraction
