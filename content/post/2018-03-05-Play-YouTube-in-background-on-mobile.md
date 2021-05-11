---
author: Valentin Heidelberger
comments: true
date: "2018-03-05T21:14:00Z"
header_img: /img/blog-bg.webp
subtitle: ""
tags:
- technology
title: How to play YouTube in background on mobile
---

One of the most requested features for mobile devices in, well, forever, is playing YouTube videos without having the app in foreground. YouTube introduced this feature with YouTube Red for paying customers. So if you're lucky enough to live in one of the countries, where you can actually subscribe to YouTube Red, you can pay a few bucks per month to get this.

If you're not so lucky (like me) or just don't want to pay, you could still use a mobile browser. Until recently at least, when YouTube blocked playing videos without having the according tab open on mobile devices. This is accomplished by utilizing the so called page visibility and fullscreen API. This allows a webpage to check, if you're *actually* viewing the page.

Luckily, [Timothy Chien](https://timdream.org/) built an add-on for Firefox that blocks these APIs and allows you to listen to YouTube videos with another tab open or Firefox in background entirely on mobile.

Just download Firefox from your favourite app store, if you haven't already, and visit [this page](https://addons.mozilla.org/en-US/firefox/addon/video-background-play-fix) to install the add-on.

This way you don't need to access YouTube in desktop mode, change your user-agent or do anything else.

Also, the code for the add-on is [available on GitHub](https://github.com/mozilla/video-bg-play). So feel free to contribute!
