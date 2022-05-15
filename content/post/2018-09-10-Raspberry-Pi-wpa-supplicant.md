---
author: Valentin Heidelberger
comments: false
date: "2022-05-15T14:03:59Z"
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
Lots of Raspberry Pis are used for purposes that require a wireless network connection and remote access. To save time otherwise spent on connecting the Pi to a screen and keyboard or wired network to configure this, you can just configure network, SSH and an initial user before the first boot.

This post documents an interactive and a non-interactive approach.

# Interactively with Raspberry Pi Imager

The Raspberry Pi Foundation provides an imaging tool, allowing you to not only flash the current Raspberry Pi OS to a given device but also to configure a few things in the same step.

You can find it [here](https://www.raspberrypi.com/software/).

The tool is quite self-explanatory, so I won't go into much detail here.

Select the source image and destination in the tool, click the “settings” button – the picture of a cogwheel – before clicking “Write”, and use the Advanced options menu to enter a username and password, along with any other preconfiguration you want.

Put the flashed micro SD card into your Pi, boot it up and enjoy!

# Non-interactively with config files

If you don't want to use the official imaging tool or you want to keep a set of config files to use often, here is another non-interactive approach.

To flash the image, you can use the official Imager, another interactive tool like [Etcher](https://www.balena.io/etcher/) or a [CLI tool like `dd`](https://www.raspberrypi.com/documentation/computers/getting-started.html#installing-images-on-linux).

**Having flashed the Raspberry Pi OS image onto your Pi**, use your file explorer or terminal to move to a newly created partition called `boot` on the micro SD card.

## Initial user (mandatory)

Since 2022, Raspberry Pi OS doesn't come with the well-known default user `pi` anymore. Instead, it asks you to create a user yourself on first boot interactively.

To create a user automatically on first boot, you have to provide a file `userconf` containing your desired user and password in the `boot` partition.

The file must contain your username and encrypted password like so:

```
username:encrypted-password
```

Make sure you are in the boot partition and use the following command, replacing `myuser` and `mypassword`, to create the file:

```bash
echo "myuser:$(echo 'mypassword' | openssl passwd -6 -stdin)" > userconf
```

For example, the combination `myuser` and `mypassword` should look like this:

```bash
$ cat userconf
myuser:$6$e1HRSQqoAr3UL0M8$nvsMz1SHlraA1R.2FZwbAq3CnM743E9.DZqBOYtnS317TaNbMoPM3OPskUmiTWUFwT.2y5k2FM7HrufRGi2Nr/
```

If you're on Windows, make sure that `userconf` doesn't have any other extension such as *.txt*.

## WLAN

Create a file called `wpa_supplicant.conf` in the root of the `boot` partition and paste the contents corresponding to the WPA version you're using.

If you're on Windows, make sure that `wpa_supplicant.conf` doesn't have any other extension such as *.txt*.

Change the *country* parameter as well as the *ssid* and *psk* accordingly and save the file:

### WPA3 / WPA2 mixed network
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

### WPA2-only network
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

## SSH

Create an empty file simply called `ssh` in the `boot` partition. If you're on Windows, make sure that `ssh` doesn't have any other extension such as *.txt*.

## First boot

Once all the files are saved, eject the SD card safely, put it in your Pi and boot it up. You should be able to connect via SSH using the user and password you've set before shortly after.
