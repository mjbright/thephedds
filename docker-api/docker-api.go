package main

import (
  "os"
  "log"
  "strings"
  //"fmt"
  "github.com/franela/goreq"
  docker "github.com/fsouza/go-dockerclient"
)

func main() {
  type Item struct {
    Name string
    State docker.State
    //Created string
    //Args string
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
      containerNameStrip := strings.TrimPrefix(container.Name, "/") 
      containerState := container.State
      //containerCreated := container.Created
      // containerArgs := container.Args

      log.Println( containerNameStrip )
      item := Item{ Name: containerNameStrip, 
                    State: containerState ,
      }
                    //Created: containerCreated, 
                    //Args: containerArgs
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

