---
author: Valentin Heidelberger
comments: false
date: "2022-05-06T14:43:17Z"
header_img: "/img/blog-bg.webp"
subtitle: ""
tags:
- windows
- technology
title: Windows Auto Dark Mode - Change multi-screen wallpaper
toc: true
---
# The tool

**AutoDarkMode** is a great open source tool to automatically switch between dark and light themes on Windows. You can set custom hours, switch manually or use sunset and sunrise from your location.

You can download it and contribute [here on GitHub](https://github.com/AutoDarkMode/Windows-Auto-Night-Mode).

It can also change your wallpaper to a light or dark one - *but only on one screen*. Since I have a dual screen setup and a soft spot for ultra-wide wallpapers, there had to be a way!

Luckily, AutoDarkMode can call custom scripts on a light/dark switch event. With a simple PowerShell script, which I have adapted from a PowerShell function shared by [Jose Espitia](https://www.joseespitia.com/2017/09/15/set-wallpaper-powershell-function/), we can set a given file as wallpaper in a certain mode (span in my case).

# Download set-windows-wallpaper script

The script can be found [on GitHub](https://github.com/va1entin/tools/tree/master/set-windows-wallpaper). You can clone the repo or download the file directly [here](https://raw.githubusercontent.com/va1entin/tools/master/set-windows-wallpaper/set-windows-wallpaper.ps1) (right-click -> save as).

Once downloaded, put the script into the location you want to keep it in permanently. This can be any folder you like really. I've put it into `Documents`.

The script can also set wallpapers in other modes - feel free to have a look into it, if you're interested in that.

# Change Powershell ExecutionPolicy

To run custom scripts, you need to change Powershell's ExecutionPolicy. Start a Powershell as admin and run the following, answering `[Y]` when asked whether changes shall be made:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned
```

At this point you may test whether the script works. Run the following in Powershell. Make sure to adapt the path to the script and image to your setup.

```powershell
C:\Users\val\Documents\set-windows-wallpaper.ps1 -File C:\Users\val\Pictures\Wallpaper\wallpaper-day.jpg -Style Span
```

# Configure AutoDarkMode to run script

With the script in place and running successfully, you can configure AutoDarkMode to run it. Right-click on the AutoDarkMode icon in the system tray and click **Open config directory**.

In the config directory, open the file `scripts.yaml` and add the following to it. The file should already contain an example for a script. You can just delete that or comment it out for reference.

Make sure to replace the paths to the script and your desired light and dark images!

``` yaml
Enabled: true
Component:
  TimeoutMillis: 10000
  Scripts:
  - Name: Span wallpaper change
    Command: Powershell
    ArgsLight: [C:\Users\val\Documents\set-windows-wallpaper.ps1, -File, C:\Users\val\Pictures\Wallpaper\wallpaper-day.jpg, -Style, Span]
    ArgsDark: [C:\Users\val\Documents\set-windows-wallpaper.ps1, -File, C:\Users\val\Pictures\Wallpaper\wallpaper-night.jpg, -Style, Span]
    AllowedSources: [Any]
```

See the [AutoDarkMode wiki](https://github.com/AutoDarkMode/Windows-Auto-Night-Mode/wiki/How-to-add-custom-scripts) for reference on adding custom scripts.

# Test it

Now, you can test the script through AutoDarkMode by forcing a switch to the light and dark theme. Right-click on the AutoDarkMode icon in system tray and click the corresponding command. Your span wallpaper should change as configured.

If it doesn't, make sure that the script works when run directly and that the config in `scripts.yaml` is correct. You can also consult the `service.log` file written by AutoDarkMode. It was very helpful in developing this script!
