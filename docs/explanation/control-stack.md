# Control Stack

This section describes the internal control pipeline of the system, including data flow, control loops, and the interaction between software modules. The control stack is responsible for converting high-level commands into stable and executable robot motion.

---

## Overview

The control stack sits between the high-level decision layer and the hardware interface. It is responsible for:

- Processing observations (state feedback)
- Executing control policies
- Generating actuator commands
- Maintaining real-time control loops

---

## Control Pipeline

The control process follows a cyclic pipeline:

1. Receive observations from sensors
2. Process and structure the state
3. Execute control policy
4. Generate action commands
5. Send commands to actuators
6. Repeat at control frequency

This loop runs continuously during operation.

---

## Observation (State)

Observations represent the current state of the system. Typical observation data includes:

- Joint positions
- Joint velocities
- Robot orientation
- Sensor readings (IMU, etc.)

Observations are collected through the hardware interface or simulation environment.

---

## State Processing

Raw sensor data is processed before being used. This may include:

- Filtering (e.g., low-pass filtering)
- Normalization
- State estimation (if applicable)

The goal is to produce stable and meaningful input for control policies.

---

## Policy Execution

The control policy takes observations as input and outputs actions. Policies may include:

- Analytical controllers
- Model-based control
- Learned policies (e.g., reinforcement learning)

The policy operates at a fixed control frequency.

---

## Action (Command)

Actions represent commands sent to the robot. Typical action formats:

- Target joint positions
- Target joint velocities
- Torque commands

Actions must respect system constraints such as:

- Joint limits
- Velocity limits
- Safety thresholds

---

## Control Frequency

The control loop runs at a fixed frequency. Typical considerations:

- Higher frequency → better responsiveness
- Lower frequency → reduced computational load

The system must maintain stable timing to ensure control performance.

---

## ROS2 Integration

The control stack is implemented on top of ROS2. It uses:

- Topics for state and command communication
- Nodes for modular functionality
- Launch files for system orchestration

Example components:
- State publisher node
- Control node
- Hardware interface node

---

## Node Structure

A typical control system includes:

- State Node: publishes observations
- Control Node: runs policy and generates actions
- Hardware Node: interfaces with motors and sensors

Each node operates independently but communicates through ROS2.

---

## Data Flow

### Observation Flow
Hardware / Simulation → State Node → Control Node

---

### Action Flow
Control Node → Hardware Interface → Robot Actuators

---

## Simulation vs Real Execution

The control stack is designed to work identically in both environments.

### In Simulation
- Observations come from simulator
- Actions affect simulated robot

### In Real System
- Observations come from sensors
- Actions control physical actuators

The interface remains consistent across both cases.

---

## Latency and Timing

Real-world systems introduce latency. Sources include:

- Sensor delays
- Communication delays
- Actuator response time

The control stack must be robust to these delays.

---

## Safety Constraints

Safety is enforced within the control stack:

- Action clipping
- Joint limit checks
- Velocity limits

These constraints prevent unsafe commands from being executed.

---

## Failure Handling

If abnormal behavior is detected:

- Stop control loop
- Disable actuator commands
- Trigger safety mechanisms

The system should fail safely.

---

## Extensibility

The control stack is designed to be extensible. Users can:

- Replace control policies
- Add new sensors
- Modify control frequency
- Integrate additional modules

---

## Summary

The control stack connects perception and action. It ensures:

- Stable control
- Real-time responsiveness
- Safe execution
- Consistent behavior across simulation and real systems

It is the core runtime system of the platform.

---