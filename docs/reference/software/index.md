# Software

This section describes the software components of the system, including ROS2 packages, nodes, communication interfaces, and runtime structure.

---

## Overview

The software system is built on ROS2 and provides a modular architecture for robot control. It is responsible for:

- System bringup
- Control execution
- Data communication
- Hardware interaction

The software stack is designed for flexibility, scalability, and real-time performance.

---

## Software Architecture

The software is organized into multiple layers:

- Application layer (policies and high-level logic)
- Control layer (real-time control execution)
- Communication layer (ROS2 messaging)
- Hardware interface layer (device drivers)

Each layer interacts through well-defined interfaces.

---

## ROS2 Framework

The system is implemented using ROS2. Key features include:

- Node-based architecture
- Topic-based communication
- Service and action interfaces
- Launch system for orchestration

ROS2 enables modular and distributed system design.

---

## Packages

The system consists of multiple ROS2 packages. Typical package categories include:

- Bringup package (system initialization)
- Control package (policy execution and control logic)
- Hardware interface package (device drivers)
- Utility packages (tools and support functions)

Each package serves a specific role in the system.

---

## Nodes

The system is composed of multiple ROS2 nodes. Typical node types include:

### State Node
- Publishes robot state information
- Provides observations for control

---

### Control Node
- Executes control policies
- Generates action commands

---

### Hardware Interface Node
- Communicates with actuators and sensors
- Sends commands to hardware
- Receives sensor data

---

### Auxiliary Nodes
- Logging
- Monitoring
- Diagnostics

---

## Topics

ROS2 topics are used for communication between nodes. Typical topic categories:

### State Topics
- Joint states
- Sensor data
- System status

---

### Command Topics
- Control commands
- Action outputs

---

### Diagnostic Topics
- System health
- Error messages

---

## Launch System

The system is started using ROS2 launch files. Launch files are responsible for:

- Starting nodes
- Configuring parameters
- Managing dependencies

Example:
```bash
ros2 launch hightorque_bringup bringup.launch.py