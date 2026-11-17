---
title: GPU passthrough in plain terms: IOMMU, VFIO and handing a GPU to a VM
summary: What actually happens when a virtual machine gets exclusive access to a physical GPU.
date: 2026-10-14
read: 6 min
tags: Virtualization, GPUs
draft: true
---
Sometimes a VM needs a real GPU, not an emulated one: CUDA testing, graphics drivers, anything that talks to the hardware directly. PCI passthrough gives one VM exclusive, near-native access to a physical device. Three pieces make it work.

## The IOMMU keeps devices in their lane

An IOMMU does for devices what the MMU does for processes: it translates and restricts the memory addresses a device can reach through DMA. Without it, handing a device to a guest would let that device read or write host memory. Devices are placed in groups according to what the IOMMU can isolate, and a group has to be handed over as a unit.

```
ls /sys/kernel/iommu_groups/*/devices
lspci -nnk | grep -A3 -i nvidia
```

The first command shows which devices share a group. The second shows the GPU's PCI address, its vendor and device IDs, and which kernel driver currently owns it.

## VFIO takes the device away from the host driver

VFIO is the kernel framework that exposes a device to user space safely, using the IOMMU. You bind the GPU to the `vfio-pci` driver instead of the normal GPU driver, so the host stops using it. QEMU then opens the device through VFIO and maps it into the guest, which installs its own driver as if the GPU were plugged in directly.

## Doing it in Kubernetes with KubeVirt

KubeVirt runs VMs as pods, so the GPU has to be advertised to the cluster like any other resource. A device plugin exposes the passthrough-ready GPUs, and the VM spec asks for one by name.

```
spec:
  domain:
    devices:
      gpus:
      - name: gpu1
        deviceName: RESOURCE_NAME_FROM_DEVICE_PLUGIN
```

The scheduler then places the VM on a node with a free GPU, and the guest sees real hardware.

## The catch

Passthrough is exclusive. It is one GPU for one VM at a time, and the GPU is unavailable to the host while it is bound. Sharing a GPU across several VMs needs a different mechanism, such as vendor virtualization features, with their own licensing and support trade-offs.
