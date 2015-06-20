package main

import (
  "os"
  "log"
  //"fmt"
  "github.com/franela/goreq"
  docker "github.com/fsouza/go-dockerclient"
)

func main() {
  endpoint := "unix:///tmp/docker.sock"
  client, _ := docker.NewClient(endpoint)
  events := make(chan *docker.APIEvents)
  hostname := os.Getenv("HOST_HOSTNAME")
  log.Println("Hostname: ", hostname)
  client.AddEventListener(events)
  log.Println("Listening for Docker events ...")

  for msg := range events {
    switch msg.Status {
    case "start":
      log.Println("Start: ", msg.ID)
      goreq.Request{ Method: "POST", Uri: "http://172.17.42.1:3000/docker-start" }.Do()
    case "die":
      log.Println("Die: ", msg.ID)
    case "stop", "kill":
      log.Println("Stop/kill: ", msg.ID)
    }
  }
}

