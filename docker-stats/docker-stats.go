package main

import (
	"github.com/samalba/dockerclient"
	"log"
	"os"
	"os/signal"
	"syscall"
)

func calculateCPUPercent(previousCPU, previousSystem uint64, v *dockerclient.Stats) float64 {
	var (
		cpuPercent = 0.0
		// calculate the change for the cpu usage of the container in between readings
		cpuDelta = float64(v.CpuStats.CpuUsage.TotalUsage - previousCPU)
		// calculate the change for the entire system between readings
		systemDelta = float64(v.CpuStats.SystemUsage - previousSystem)
	)

	if systemDelta > 0.0 && cpuDelta > 0.0 {
		cpuPercent = (cpuDelta / systemDelta) * float64(len(v.CpuStats.CpuUsage.PercpuUsage)) * 100.0
	}
	return cpuPercent
}

func statCallback(id string, stat *dockerclient.Stats, ec chan error, args ...interface{}) {
	var (
		previousCPU    uint64
		previousSystem uint64
		cpuPercent     = 0.0
	)

	cpuPercent = calculateCPUPercent(previousCPU, previousSystem, stat)
	memPercent := float64(stat.MemoryStats.Usage) / float64(stat.MemoryStats.Limit) * 100.0

	log.Println(id, " CPU usage: ", cpuPercent)
	log.Println(id, " MEM usage: ", memPercent)

	previousCPU = stat.CpuStats.CpuUsage.TotalUsage
	previousSystem = stat.CpuStats.SystemUsage
}

func waitForInterrupt() {
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM, syscall.SIGQUIT)
	for _ = range sigChan {
		os.Exit(0)
	}
}

func main() {
	// Init the client
	docker, _ := dockerclient.NewDockerClient("unix:///tmp/docker.sock", nil)

	// Get only running containers
	containers, err := docker.ListContainers(false, false, "")
	if err != nil {
		log.Fatal(err)
	}
	for _, c := range containers {
		log.Println(c.Id, c.Names)
		docker.StartMonitorStats(c.Id, statCallback, nil)
	}

	waitForInterrupt()
}
