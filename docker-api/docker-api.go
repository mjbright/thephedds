package main

import (
  "os"
  "log"
  //"fmt"
  "github.com/franela/goreq"
  docker "github.com/fsouza/go-dockerclient"
)

func main() {
  type Item struct {
    Name string
  }

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
      container, _ := client.InspectContainer( msg.ID )
      log.Println( container.Name )
      item := Item{ Name: container.Name }
      goreq.Request{
        Method: "POST",
        Uri: "http://172.17.42.1:3001/docker-start",
        Accept: "application/json",
        ContentType: "application/json",
        Body: item,
      }.Do()
      log.Println(item)
    case "die":
      log.Println("Die: ", msg.ID)
    case "stop", "kill":
      log.Println("Stop/kill: ", msg.ID)
    }
  }
}

