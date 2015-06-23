package main

import (
	docker "github.com/fsouza/go-dockerclient"
	"log"
	"os"
)

func main() {
	type Item struct {
		Name string
	}

	endpoint := "unix:///tmp/docker.sock"
	client, _ := docker.NewClient(endpoint)
	hostname := os.Getenv("HOST_HOSTNAME")
	log.Println("Hostname: ", hostname)

	containers, _ := client.ListContainers(docker.ListContainersOptions{})

	for _, container := range containers {
		log.Println("Names: ", container.Names)
	}
}
