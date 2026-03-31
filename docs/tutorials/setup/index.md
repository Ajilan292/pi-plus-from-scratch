# Setup

This section describes how to prepare the PI Plus robot software environment for the ROS2-based deployment workflow.

It focuses on:

- Robot-side system preparation
- ROS2 environment setup
- Workspace preparation
- Required runtime environments for deployment

This page does **not** include internal repository links or private development resources.

---

## Overview

The ROS2 deployment workflow on PI Plus requires preparation on the robot side before bringup and policy execution.

The target robot configuration used in this setup is:

- **Robot**: PI Plus
- **Platform**: Orin NX
- **Camera**: RealSense D435i

A complete setup typically includes:

- SSH access to the robot
- Network and proxy configuration, if required
- Miniconda installation
- ROS2 Foxy installation
- Shell environment setup
- ROS2 workspace preparation
- Deployment runtime environment

---

## Prerequisites

Before starting, make sure you have:

- A PI Plus robot powered on and reachable over the network
- SSH access to the robot
- Administrator privileges on the robot
- Required deployment packages prepared locally

---

## 1. Connect to the Robot

Connect to the robot over SSH:

```bash
ssh <username>@<robot_ip>
```

Verify that:

- The robot is reachable
- Login is successful
- You have permission to install software and edit shell configuration files

---

## 2. Configure Network Access (Optional)

If the robot requires internet access through the host machine, configure proxy settings on the robot.

Typical proxy variables:

```bash
export http_proxy=http://127.0.0.1:7890
export https_proxy=http://127.0.0.1:7890
```

!!! note
    This step is only required when the robot cannot directly access the external network.

---

## 3. Install Miniconda

Install Miniconda on the robot to manage Python environments.

Example workflow:

```bash
wget <miniconda_installer_for_aarch64>
bash ~/Miniconda3-latest-Linux-aarch64.sh
source ~/.bashrc
conda deactivate
conda config --set auto_activate_base false
```

After installation, verify that `conda` is available:

```bash
conda --version
```

---

## 4. Install ROS2 Foxy

### 4.1 Locale Setup

```bash
sudo apt update && sudo apt install locales
sudo locale-gen en_US en_US.UTF-8
sudo update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8
export LANG=en_US.UTF-8
```

### 4.2 Add ROS2 Sources

```bash
sudo apt install software-properties-common
sudo add-apt-repository universe

sudo apt update && sudo apt install curl -y
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key \
  -o /usr/share/keyrings/ros-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] http://packages.ros.org/ros2/ubuntu $(. /etc/os-release && echo $UBUNTU_CODENAME) main" \
  | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null
```

### 4.3 Install ROS2 Base

```bash
sudo apt update
sudo apt upgrade
sudo apt install ros-foxy-ros-base python3-argcomplete -y
sudo apt install ros-dev-tools -y
```

### 4.4 Install Extra Dependencies

```bash
sudo apt install \
  ros-foxy-joy-linux \
  ros-foxy-example-interfaces \
  ros-foxy-map-msgs \
  ros-foxy-turtlesim \
  ros-foxy-pcl-msgs \
  ros-foxy-gazebo-msgs \
  ros-foxy-rosbag2-storage-mcap \
  nlohmann-json3-dev \
  -y
```

After installation, verify the ROS2 environment:

```bash
source /opt/ros/foxy/setup.bash
ros2 --help
```

---

## 5. Configure the Shell Environment

### 5.1 Disable Automatic ROS1 Sourcing

Comment out any automatic ROS1 sourcing line in `~/.bashrc`.

### 5.2 Add a ROS Environment Switch Helper

```bash
rosenv() {
    unset -v $(env | grep -o '^ROS[^=]*' | tr '\n' ' ')
    unset PYTHONPATH
    unset CMAKE_PREFIX_PATH
    unset AMENT_PREFIX_PATH
    unset COLCON_PREFIX_PATH
    unset LD_LIBRARY_PATH

    case $1 in
        foxy)
            source /opt/ros/foxy/setup.bash
            echo "Switched to ROS2 Foxy"
            ;;
        noetic)
            source /opt/ros/noetic/setup.bash
            echo "Switched to ROS1 Noetic"
            ;;
        *)
            echo "Usage: rosenv [foxy|noetic]"
            echo "Current ROS_DISTRO: $ROS_DISTRO"
            ;;
    esac
}
```

Reload the shell:

```bash
source ~/.bashrc
```

Test:

```bash
rosenv foxy
```

---

## 6. Install Required System Libraries

Extract:

```bash
tar -zxvf ros2_env.tar.gz
```

Build:

```bash
mkdir build && cd build
cmake ../
make -j
sudo make install
```

!!! warning
    Use the provided deployment package that matches your robot system.

---

## 7. Prepare the ROS2 Workspace

```bash
mkdir -p ~/your_name/ros2_ws/src
cd ~/your_name/ros2_ws
```

Build:

```bash
rosenv foxy
colcon build
```

Source:

```bash
source install/setup.bash
```

---

## 8. Prepare the instinct_onboard Runtime Environment

Copy project to:

```text
~/your_name/instinct_onboard
```

Clone dependency:

```bash
git clone https://github.com/nitesh-subedi/ros2_numpy
```

---

## 9. Create Python Environment

```bash
conda create -n instinct_venv python=3.8
conda activate instinct_venv
```

---

## 10. Install ONNX Runtime GPU

```bash
pip install onnxruntime_gpu-<version>-cp38-cp38-linux_aarch64.whl
```

Install project:

```bash
cd ~/your_name/instinct_onboard
pip install -e .
```

---

## 11. Prepare Policy Files

```bash
mkdir -p ~/your_name/policy
```

---

## 12. Verification Checklist

### System-Level Checks

- [ ] SSH connection to the robot works
- [ ] Network access is available if required
- [ ] Miniconda is installed
- [ ] ROS2 Foxy is installed
- [ ] `rosenv foxy` works correctly

### Workspace Checks

- [ ] ROS2 workspace is created
- [ ] Workspace builds successfully with `colcon build`
- [ ] `source install/setup.bash` works correctly

### Onboard Runtime Checks

- [ ] instinct_onboard is present on the robot
- [ ] ros2_numpy is available under the project directory
- [ ] instinct_venv Conda environment is created
- [ ] ONNX Runtime GPU wheel is installed
- [ ] `pip install -e .` completes successfully
- [ ] Policy files are uploaded to the policy directory

---

## 13. Next Steps

1. Start the ROS2 bringup pipeline
2. Move the robot to zero position
3. Launch the onboard policy runtime

See:

- tutorials/bringup/
- tutorials/first-run/
- tutorials/safety-and-teleop/

---

## Summary

This setup prepares the robot for ROS2-based onboard deployment.

It includes:

- Base system preparation
- ROS2 installation
- Workspace build
- Onboard runtime environment
- Policy runtime dependencies

Once all setup steps are complete, the robot is ready for bringup and policy execution.
