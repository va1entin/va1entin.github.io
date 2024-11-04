---
author: Valentin Heidelberger
comments: false
date: "2019-11-14T18:21:22Z"
subtitle: ""
tags:
- technology
- linux
title: Get Ledger Live working on NixOS
toc: true
---

The [Ledger Nano series](https://ledger.com) are hardware wallets for crypto currencies. They're managed through an application called [Ledger Live](https://shop.ledger.com/pages/ledger-live). Ledger Live runs on linux but might - depending on your distro - require some adjustments in order to correctly identify the device via USB.
I couldn't test whether this config works with all Ledger devices so far. Feel free to drop me a [tweet](https://twitter.com/valhei) if you have anything to add to this post and I'll gladly update it.

On NixOS I needed the following additional config snippets to use my Ledger fully:

# Define a group called "plugdev"
```nix
groups.plugdev = {};
```

# Add user(s) to "plugdev"
Note that you your user will most likely already be in various other groups such as *networkmanager* or *wheel*. Just append plugdev to the *extraGroups* list.
Replace *myUser* with your user name.

```nix
users.users = {
...
  myUser = {
  extraGroups = [ "plugdev" ];
...
  };
};
```

# Add extra rules for udev
Ledger provides udev rules which need to be added kind of hidden (linux -> Troubleshooting -> Option 3) [on their website](https://support.ledger.com/hc/en-us/articles/115005165269-Fix-connection-issues). You can check out my NixOS config containing these rules [on GitHub](https://github.com/va1entin/nixos-config/blob/master/ledger.nix). I've decided to not statically post them here and instead refer to the GitHub mirror of my NixOS config, because they might change with Ledger firmware updates. You must change "val" to your username.

I'm not entirely sure whether it's really necessary but I reload the rules after I've changed them and rebuilt NixOS just to make sure they are being applied:

```bash
udevadm trigger
udevadm control --reload-rules
```
