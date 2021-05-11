---
author: Valentin Heidelberger
comments: false
date: "2018-08-25T12:30:21Z"
header_img: /img/tags/linux.webp
subtitle: ""
tags:
- technology
- linux
title: Setting up unattended upgrades on Debian
toc: true
---
# Why
I have a Raspberry Pi running on Raspbian in my home network. It mainly provides a DNS server based on [Pi Hole](https://pi-hole.net/) and runs some cronjobs for me.
Of course you don't want to login to such a system regularly and install package upgrades. That's where unattended upgrades come into play.
I'll tell you how to set unattended upgrades up on Debian and walk you through some config parameters that I find very useful.

# How
Firstly, you need to install the unattended-upgrades pkg:
``` bash
apt install unattended-upgrades
```
unattended-upgrades is run automatically by the cronjob */etc/cron.daily/apt-compat*.

## The config file
Now let's have a look at the config file:
``` bash
vim /etc/apt/apt.conf.d/50unattended-upgrades
```

The config file might look a bit messy at first due to a LOT of comments and the (in my opinion) unaesthetic apt config syntax.
The most interesting part to begin with is the "Origins-Pattern":
``` conf
Unattended-Upgrade::Origins-Pattern {
      "o=Debian,a=stable";
      "o=Debian,a=stable-updates";
      "o=Debian,a=proposed-updates";
      "origin=Debian,codename=${distro_codename},label=Debian-Security";
};
```

## Defining package origins
The Origins-Pattern defines from where unattended-upgrades will install upgrades. If an origin is missing here, package upgrades from there will be ignored. Which origins to configure here is totally up to you of course. Maybe you have installed some exotic PPA, which you always want to upgrade manually?
To find out how to configure the origins you want, you can have a look at apt's lists:
``` bash
val@pi:~ $ ls /var/lib/apt/lists/ | grep InRelease
archive.raspberrypi.org_debian_dists_stretch_InRelease
raspbian.raspberrypi.org_raspbian_dists_stretch_InRelease
```

These InRelease files provide the information you need. To find out their origin and suite (o= and a=), use the grep command:
``` bash
val@pi:~ $ grep -E '(Origin|Suite)' /var/lib/apt/lists/archive.raspberrypi.org_debian_dists_stretch_InRelease
Origin: Raspberry Pi Foundation
Suite: stable
```

So the origin of this particular apt list is "Raspberry Pi Foundation" and it's suite is "stable". To configure this for unattended-upgrades, you'd adapt the config to look as follows:
``` conf
Unattended-Upgrade::Origins-Pattern {
      "o=Raspberry Pi Foundation,a=stable";
      "o=Raspbian,a=stable";
      "o=Debian,a=stable";
      "o=Debian,a=stable-updates";
      "o=Debian,a=proposed-updates";
      "origin=Debian,codename=${distro_codename},label=Debian-Security";
};
```

## Defining package blacklist
If you don't want to upgrade certain packages from a defined origin automatically, you can put them in the blacklist, that should already be in the config file:
``` conf
Unattended-Upgrade::Package-Blacklist {
//      "vim";
//      "libc6";
//      "libc6-dev";
//      "libc6-i686";
};
```

## Automatically remove unused dependencies (autoremove)
To automatically remove unused dependencies, set the following config parameter to true:
``` conf
Unattended-Upgrade::Remove-Unused-Dependencies "false";
```

## Automatically reboot
Some packages require a reboot. You probably want to control when that happens. In my case the pi reboots at 2 AM, when everyone's usually asleep, if needed.
``` conf
Unattended-Upgrade::Automatic-Reboot-Time "02:00";
```
# Debugging
unattended-upgrades offers a debug parameter, that makes debugging very easy. With *--apt-debug* and *--verbose* you can get even more debug output.
To debug previous runs of unattended-upgrades, check the log files: */var/log/unattended-upgrades/unattended-upgrades.log* and */var/log/unattended-upgrades/unattended-upgrades-dpkg.log*.
``` bash
val@pi:~ $ sudo unattended-upgrades --dry-run --debug
sudo: unable to resolve host pi
Initial blacklisted packages:
Initial whitelisted packages:
Starting unattended upgrades script
Allowed origins are: ['o=Raspberry Pi Foundation,a=stable', 'o=Raspbian,a=stable', 'o=Debian,a=stable', 'o=Debian,a=stable-updates', 'o=Debian,a=proposed-updates', 'origin=Debian,codename=stretch,label=Debian-Security']
...
```
