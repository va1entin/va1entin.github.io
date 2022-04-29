---
author: Valentin Heidelberger
comments: false
date: "2018-09-10T19:31:23Z"
header_img: /img/tags/raspberrypi.webp
subtitle: ""
tags:
- technology
- linux
- raspberrypi
- homeserver
title: 'Raspberry Pi: Configure WLAN/WiFi + SSH before first boot'
toc: true
---
# Why
Lots of Raspberry Pis are used for purposes requiring a wireless network connection. Configuring WLAN for the Pi requires a config file including the network's name and access keys. To save time otherwise spent on connecting the Pi to a screen and keyboard or wired network to configure this, you can just create the config file before even booting the Pi for the first time. Here's how that works.

# How
**Having flashed the Raspbian image onto your Pi**, use your file explorer or terminal to move to a newly created partition called **"boot"** on the micro SD card.

Create a file called **wpa_supplicant.conf** in the root of that partition and paste the contents corresponding to the WPA version you're using.

Change the *country* parameter as well as the *ssid* and *psk* accordingly and save the file:

## WPA3 / WPA2 mixed network
``` conf
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=US

network={
     ssid="Your network name/SSID"
     psk="Your WPA security key"
     key_mgmt=WPA-PSK-SHA256
     ieee80211w=2
}
```

## WPA2-only network
``` conf
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=US

network={
     ssid="Your network name/SSID"
     psk="Your WPA security key"
     key_mgmt=WPA-PSK
}
```

Having created the config for WLAN, create another (empty) file simply called **ssh** in the **"boot"** partition. If you're on Windows, make sure that both **ssh** and **wpa_supplicant.conf** don't have any other extension such as *.txt*.

Once the files are saved, eject the SD card safely, put it in your Pi and boot it up. You should be able to connect via SSH using the default user *pi* and password *raspberry* shortly after.

# Pi appears on network but login via SSH doesn't work
The process outlined in this article has always worked on my Raspberry Pi 4 and Zero W. On my old Pi 1 B+ however, it usually does not work - at least not without manual intervention!

The Pi 1 would appear on the network and be *reachable* via SSH but *login* was not possible with the usual pi / raspberry credentials. The problem being that this default user had not yet been properly created.

After having added the files as described above, I had to connect the Pi to a monitor, boot it up and wait...

It took at least 30 seconds after the systemd boot was finished for a prompt to appear - so be patient. The prompt then went straight into an interactive wizard which asked about language, keyboard layout and also created the user. Only after completing this wizard, I was able to login via SSH with the default user.

I'm not sure why this is happening. On multiple tries, I also got a varying amount of steps in the wizard, sometimes more, sometimes fewer.

According to some folks in the Raspberry Pi forums, zeroing the SD card before flashing the Raspberry Pi OS image is supposed to help. In my case it didn't but I'm still document the command for you to try.

Replace **/dev/sdg** with your SD card!

``` bash
sudo dd if=/dev/zero of=/dev/sdg bs=8192 status=progress
```