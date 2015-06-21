# The Phedds
The Phenomenal Docker Demos

# Description of the project

## The original need 
We present Docker many times at work and generally start with a command-line demo then switch between multiple terminals windows. For example: showing the basic "docker run" or other commands and then jump to another terminal to show what's happening in the background: docker build, docker compose to build a cluster of components and then hitting F5 to show what's reaching different docker containers through load-balancing. IT IS REALLY HARD TO KEEP THE MIND IN ONE PLACE!!

Wouldn't it be great if multi-paned browser page that shows different aspects of docker containers concurrently?

## The Phedds
With this idea in mind we built the Phedds
![The phedds](http://i.imgur.com/0TtrBns.png)

## How it works
Every panel correspond to a web application that runs inside a container.
The docker shell is provided through a modified wetty containers that has access to the host docker engine.
The monitoring applications are fed through Docker events streams using go client and web sockets.
All applications are bootstrapped using docker compose.

## What's next
The system is extremely pluggable and combining Docker events with web sockets we could easily add more kind of panels: multi-host containers inventory, containers logs etc...

# How to run-it

* sudo sh -c 'echo "$BOOT2DOCKERIP thephedds.com" >> /etc/hosts'
* ```docker-compose up```
* Hit [thephedds.com/home/](http://thephedds.com/home/)


