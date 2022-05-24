---
author: Valentin Heidelberger
comments: false
date: "2022-05-20T18:24:29Z"
header_img: "/img/tags/home.webp"
title: Android TV Cheat Sheet
subtitle: "Removing ads, installing custom apps, fixing quirks ..."
tags:
- android
- cheatsheet
- technology
toc: true
---
Recently, I ventured further into the world of Android TV using Android 11 on a [Xiaomi TV Stick 4K](https://www.mi.com/global/product/xiaomi-tv-stick-4k/). In this post I'll share some insights to get the most out of your Android TV.

Keep in mind that not all of these might work the same way or at all on any Android TV device! Most of them should, though. When in doubt, try and search for your device's name and what you're trying to do.

My main focus is to enable a customized, ad-free experience as well as to document quirks that I've encountered.

Note that some of the following things can be achieved by various means. For example, installing custom apps is also possible through certain third-party downloader apps. I'm focussing on achieving everything without third-party tools, notably the Android Debug Bridge (adb) which provides a command line interface for interacting with Android devices. It comes with an initial learning curve but enables many more possibilities in the long-run and is usable across devices without relying on third parties.

# Managing the device with adb

## Getting adb

Download the Android platform tools for your OS [here](https://developer.android.com/studio/releases/platform-tools). The zip file contains an executable `adb` among other things.

Having unzipped the archive, move into it's content using your CLI - in my case Bash on Linux.

```bash
cd platform-tools
./adb version
```

You should see output stating the adb version you have now.

## Activating debug access on Android TV


Now, you need to allow debug access on your Android TV. To access the corresponding setting, you need to enable `Developer options`, which are hidden behind a little trick in Android.

Open `Settings` -> `Device preferences` and move to a section called `About [device]` or similar. In here you'll find various information like Android version, device model and also **Android TV OS build**. Tap/click on this a few times until a message appears on the bottom of the screen. It should tell you to press a few more times to activate `Developer options`.

Once `Developer options` are activated you should see them as a category when opening `Settings` -> `Device preferences`. Move into `Developer options`, scroll down to `USB debugging` and activate it.

You can connect with adb through USB but I recommend using the wireless network, because it's much easier once you've gotten the hang of it. Some devices (especially devices in "Stick" format) don't even have USB ports anymore or you need a special cable.

## Connecting to Android TV with adb

Next, you need to find out the IP address of your Android TV device.

In Android TV the IP address can be found in `Settings` -> `Device preferences` -> `About` -> `Status`. Your router's web interface should also have it somewhere.

Once you have the IP address of your device (in my case 192.168.178.10), run the following command to connect with adb. Make sure to use your device's actual IP address when copy-pasting:

```bash
adb connect 192.168.178.10
```

adb might say something like `Failed to authenticate [...]`. If that happens, look at your TV screen. You should see a pop-up window, asking you to click `OK` to allow access. This is a security feature to make sure not anyone can access your Android TV through adb just because they're in your network.

After having allowed access, run the following to check whether the connection was established:

```bash
adb devices
```

It should put out a `List of devices attached` with one element: Your device's IP address.

**Note**, that it is considered a **security risk** to leave ADB debugging activated on Android *permanently*. It's highly encouraged to deactivate it when you're done and only re-activate when needed.


# Ad-free YouTube

`SmartTubeNext` is an amazing third-party YouTube client for TVs. It's ad-free and contains many more comfort features like SponsorBlock. It's also highly customizable - I thoroughly recommend it.

You can find it's code and get the APK file needed for installation [on GitHub](https://github.com/yuliskov/SmartTubeNext).

Scroll down to `latest stable download` and download the linked file.

[Having connected to your device using adb](#managing-the-device-with-adb), you can install the APK file as follows:

```bash
adb install smarttube_stable.apk
```

Make sure that the filename is correct and execute it.

# Ad-free launcher

(Most) Android TV devices come with the standard Google Launcher as default. It's looking slick but is unfortunately full of ads - not exactly what you might expect from **your device**, that you bought with **your money**.

Luckily there are many ad-free launchers out there that you can just install instead. A big name mentioned in many places would be "ATV Launcher", which is well established and has many features.

ATV launcher's design was a bit too crowded for my taste, some features require the paid version and it's proprietary afaik.

If you don't care about lots of widgets and are simply looking for a free, slick and **open source** launcher, I highly recommend `FLauncher`. It's source code can be found [on GitLab](https://gitlab.com/etienn01/flauncher).

You can install it from the [Play Store](https://play.google.com/store/apps/details?id=me.efesser.flauncher&hl=en&gl=US).

If you want to set a custom background image in FLauncher, check the chapter on [uploading files onto Android TV](#upload-files-onto-android-tv). Once your desired image is in the file system, you can easily set it as background image in FLauncher's settings.

# Upload files onto Android TV

[Having connected to your device using adb](#managing-the-device-with-adb), you can push local files to Android TV as follows:

```bash
adb push my-local-image.png /sdcard/Pictures/my-remote-image.png
```

**Note**, that `/sdcard` represents the part of Android's file system sometimes referred to as "internal SD card". It's basically the space where user data (Pictures, Music, Downloads, ...) exists, which is why you usually want to put your files there.

# Custom functions for physical remote buttons

Some Android TV devices come with physical remotes that exhibit buttons with weird functions - for instance my Xiaomi TV stick has a button that start's a non-removable pre-installed app that doesn't even work. With `Button Mapper` you can change what most of these buttons do ("remap" them).

This is also very helpful when using a custom launcher ([see above](#ad-free-launcher) to find out which one I recommend), because the home button (at least in my case) can be hard-wired to start the Google launcher and not another one which you might've set as default. In Button Mapper, just choose your home button and modify it to start an app - your desired launcher.

You can find Button Mapper [in the Play Store](https://play.google.com/store/apps/details?id=flar2.homebutton&hl=en&gl=US) and install it directly on your Android TV device.

Setting it up is self-explanatory so I won't go into much detail here. Note, that some buttons might not be changeable - the premium version promises to allow for more buttons to be modified but I didn't try it yet.

# Volume too low or too high / Changing volume without remote

This was a funny one: Xiaomi's TV Stick comes with a remote which automatically configures itself to control your TV as well. That's very handy, because you only need one remote to turn your TV on/off, change the volume and navigate through Android TV at the same time.

Unfortunately, I've found the sound of any media playing through Android TV to be **really** quiet. I've had to put my TV on 100% volume to hear anything. For any other device 20% was more than enough.

The problem was that Android TV also has it's own volume level - like any other Android device. The remote wasn't changing that one though, because it was changing the TV's volume instead.

So there are two volume levels to be adjusted but the remote can only change one. It is most likely possible to un-pair the Android TV remote and TV, turn Android's volume up and pair the remote again but I find the following way to be much quicker.

With the following adb commands, we get a shell on Android TV and then simulate "volume up" button presses. I just did this a few times until the volume was on max and left it there. You should see a volume bar appear in Android TV, when you execute one of the `input` commands.

```bash
# Get a shell on your Android TV
adb shell
# Send a volume up key event
input keyevent 24
# Send a volume down key event
input keyevent 25
```

Thanks to ce4 on [Android StackExchange](https://android.stackexchange.com/questions/25828/how-can-i-remotely-change-the-volume) for documenting this!

There is another, arguably more elegant way to do this using the `media` command in the adb shell. It allows you to directly set the volume to your desired value. I couldn't find a `media` executable on my device though so I'm just documenting it for the sake of completeness. You can find a good example on [StackOverflow](https://stackoverflow.com/questions/21055947/adb-command-to-set-volume).
