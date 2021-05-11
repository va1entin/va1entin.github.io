---
author: Valentin Heidelberger
comments: false
date: "2018-03-17T20:01:00Z"
header_img: /img/blog-bg.webp
subtitle: ""
tags:
- technology
title: Userscript to hide YouTube comments
toc: true
---

# Why
Most comments below YouTube videos are, well, irrelevant, to say the least.
Since they're pretty much in the middle of the page, they still regularly caught my eyes and distracted me when I was checking the recommended videos and scrolled down the site.
That's why I built a little userscript to hide the comments by default and make them visible with the click of a button.

# Installing the script

## Chrome
Just [download the script](https://github.com/va1entin/configs/raw/master/userscripts/hide-yt-comments.user.js) by right-clicking and selecting *Save link as*. Open `chrome://extensions` and drag-and-drop the file into Chrome. Chrome should ask, if you want to install it. You can also disable or remove it here.

Alternatively, you can also use a dedicated userscript manager from the Chrome web store. Read the paragraph on Firefox, to learn how to install the script in such a manager.

## Firefox and others
Firefox requires you to install a userscript manager add-on. One of the most famous ones is Greasemonkey.
I'm using a relatively new add-on called [Tampermonkey](https://addons.mozilla.org/de/firefox/addon/tampermonkey/), though, because it is available across different browsers and also offers a nice configuration interface with a built-in editor.
Feel free to use whatever you want. I'll describe how to install the script in Tampermonkey here.

After Tampermonkey is installed, click on the following link. Tampermonkey should ask, if you want to install the script: [Click to install](https://github.com/va1entin/configs/raw/master/userscripts/hide-yt-comments.user.js)

# Using the script
With the script enabled, comments will be hidden by default.

You can make them visible by **clicking the button** *Show* and **scrolling a little**.

![Userscript to hide YouTube comments](/img/posts/yt-comments-userscript.webp)

You can also easily modify the texts on the buttons. Just open the script and change the two values of the two variables at the very top as you wish.

# Source code
The source is [available on GitHub.](https://github.com/va1entin/configs/raw/master/userscripts/hide-yt-comments.user.js)
