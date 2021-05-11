---
author: Valentin Heidelberger
date: "2017-12-19T17:27:20Z"
header_img: /img/posts/lightbulb_saya-kimura.jpg
subtitle: with a Sysinternals tool
tags:
- technology
title: Generating CPU load on Windows
---
I recently wanted to check, if there was a problem with my CPU under heavy load, when running on Windows. For such purposes [CPUSTRES.exe from the Sysinternals suite](http://download.sysinternals.com/files/CPUSTRES.zip) is very helpful.

CPUSTRES is a handy little tool to check your process for faults on heavy load.
It comes with a simple GUI and allows you to instantly put heavy CPU load on your system.

CPUSTRES comes as a simple standalone program with a GUI and 4 threads to activate. You can also assign different intesities per thread. Task manager helps checking how much load is actually put on the CPU.

![CPUSTRES screenshot](/img/posts/cpustres.webp)
