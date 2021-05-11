---
author: Valentin Heidelberger
comments: true
date: "2018-01-09T18:01:00Z"
header_img: /img/blog-bg.webp
subtitle: ""
tags:
- technology
title: Fix NoScript 10 (Quantum) default settings
---
The release of Firefox 57 was a major disruptive event in the Mozilla community. One of the major changes was the migration of add-ons away from XUL/XPCOM to WebExtensions. While this change makes it easier for developers to integrate their existing (Chrome) add-ons with Firefox, it also forced Firefox add-on developers to rewrite their entire add-ons from scratch. Some devs (like the very popular DownThemAll) were [very frustrated](https://www.downthemall.net/re-downthemall-and-webextensions-or-why-why-i-am-done-with-mozilla/) and abandoned decades of code and tens of thousands of users.

Giorgio Maone, the developer of NoScript, one of the most famous and important add-ons, decided to not let his users down and migrated it to WebExtensions. The result is an entirely new UI and a whole new workflow. Being a NoScript user for about 10 years now, it took me quite some time to get used to everything but I managed to get used to the new NoScript.

But there's one thing I didn't get used to: the new default settings.

The new NoScript comes with quite a lot of websites, that are fully trusted by default. Some of these might be totally rational to **most** users (google.com, youtube.com, etc...), others not so much (wlxrs.com, a parked domain, as far as I can tell). Nonetheless, I don't want NoScript to decide who I, as it's user, trust.
Another weird default setting are the "default" permissions for websites. There are 3 primary states: Default, Trusted and Untrusted.

*Default* = frames, fetch, "other"

*Trusted* = Anything

*Untrusted* = Nothing

Since every site, that is not explicitly *trusted* or *untrusted*, gets assigned the "*default*" state, it is allowed to do **some things** and it's not even entirely clear what these are ("other").

So I modified the default config, to not allow anything by default and also not trust or untrust any website. You can import this config either by downloading [this file](/attachments/noscript_clean_config.txt) and using the *import* button on the NoScript options page to upload it or by copy pasting the following JSON into the text field that appears at the bottom of the page when the "Debug" checkbox is activated:

``` json
{
  "DEFAULT": {
    "capabilities": [],
    "temp": false
  },
  "TRUSTED": {
    "capabilities": [
      "script",
      "object",
      "media",
      "frame",
      "font",
      "webgl",
      "fetch",
      "other"
    ],
    "temp": false
  },
  "UNTRUSTED": {
    "capabilities": [],
    "temp": false
  },
  "sites": {
    "trusted": [],
    "untrusted": [],
    "custom": {},
    "temp": []
  },
  "enforced": true,
  "autoAllowTop": false
}
```
