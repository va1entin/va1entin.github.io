---
author: Valentin Heidelberger
comments: false
date: "2021-06-26T12:22:28Z"
header_img: "/img/tags/docker.png"
subtitle: ""
tags:
- docker
- wsl
- windows
- technology
title: Fix silently failing Docker Desktop upgrade (Windows)
toc: true
---

Docker Desktop has an internal update mechanism which will, as soon as an update is available, begin asking you to apply it on every start. Unfortunately this update mechanism is not working properly for me and other users. Once you allow Docker Desktop to run the update with admin privileges nothing seems to happen and Docker also doesn't start properly until you restart it manually.

The cause seems to be some kind of privilege problem with the Docker service running in the background. Here is a workaround that works nicely for me.

# Stop docker service

Start a command line such as PowerShell as admin and run the following command to stop the docker service (this will stop any running containers!)

```powershell
net stop com.docker.service
```

# Run installer

Download the most recent version of Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop) and run the installer, once the previous step was executed successfully.

The update should work now.
