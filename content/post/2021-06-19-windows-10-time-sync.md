---
author: Valentin Heidelberger
comments: false
date: "2021-06-19T17:22:45Z"
header_img: /img/posts/lightbulb_saya-kimura.jpg
subtitle: ""
tags:
- windows
- technology
title: Sync system time automatically at Windows startup
toc: true
---

Unlike most other operating systems, Windows 10 doesn't sync the time with an internet service at startup by default. This can become an issue, if your mainboard's built-in clock provides a wrong time or uses a different time zone.

If the mainboard's battery responsible for storing time dies, it can become an even more annoying problem, because Windows will always start with an ever-growing time skew, which can eventually result in web browsing become a problem due to Windows considering websites' SSL certificates *not yet valid* - effectively rendering browsing the majority of web pages impossible!

Luckily, this can be easily worked around by starting Windows' time sync service automatically at startup. Below you'll find instructions on doing this with the graphical *Services* console and PowerShell.

# Services console

1. Press `Windows Key` + `r` at the same time to open the **Run** dialogue
1. Type `services.msc` and hit **Run** - the **Services** window opens ![Run dialog](/img/posts/run_services-msc.webp)
1. In the list, scroll to **Windows Time** (in german: **Windows-Zeitgeber**) and right-click on it, click **Properties** in the context menu
1. In the **Properties** window change **Startup type** to *Automatic*, click **Start** and click **OK** to save ![Windows time service properties window](/img/posts/windows_time_service_properties.webp)

# PowerShell

1. Start PowerShell as admin
1. Run the following command:

```powershell
Set-Service -Name W32Time -Status running -StartupType automatic
```

If PowerShell complains about not finding a service with the specified name, you can run the following command to get a list of all available services - Microsoft might have changed the time service's name.

```powershell
Get-Service
```