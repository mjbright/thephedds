# The Phedds
The Phenomenal Docker Demos

![the phedds gif](http://i.imgur.com/70XJ97C.gifv)

# Description of the project

## The original need 
I've presented Docker many times at work and have generally started with a command-line demo where flipping between showing the basic "docker run" or other commands and then to another terminal to show what's happening in the background, OR I'm showing a Docker build, OR I'm showing docker compose being used to build a cluster of components and then hitting F5 to show that we're reaching different docker containers through load-balancing.

That's all great but what if I could have a multi-paned browser page showing different aspects all concurrently.

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


