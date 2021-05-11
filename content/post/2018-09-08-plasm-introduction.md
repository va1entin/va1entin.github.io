---
author: Valentin Heidelberger
comments: false
date: "2018-09-08T11:40:23Z"
header_img: /img/blog-bg.webp
subtitle: An introduction to plasm
tags:
- technology
title: Simple file encryption module for Python projects
toc: true
---
# tl;dr
Plasm focuses on a very specific use case: encrypting and decrypting files using public key encryption. If plasm doesn't fit the scope of what you want to do, feel free to have a look at [pynacl's documentation](https://pynacl.readthedocs.io) and use it directly.

# Why
I have experimented a lot with camera software for the Raspberry Pi. One project that particularly stuck with me is [motionEye](https://github.com/ccrisan/motioneye), a web frontend for the motion daemon, which allows you to easily set up an open source motion triggered camera for about 50€. MotionEye also offers a cloud upload functionality, which I like a lot. Unfortunately it doesn't allow the user to encrypt their media files before uploading them. Since I wanted to use Google Drive as my data grave but at the same time not upload unencrypted media files into the cloud, I decided to build a simple python module to easily hack file encryption into motionEye.

# What it is
The result of this is [plasm](https://github.com/va1entin/plasm), which stands for `PynacL AbStraction Module`. Plasm is based on [pynacl](https://github.com/pyca/pynacl), which in turn binds to [libsodium](https://libsodium.org).
Plasm uses public key encryption and is supposed to make the **creation of public key pairs** as well as **encryption and decryption of files** very simple.
One key requirement for me was that plasm had to be able to encrypt using only a public key. The private key, which is required to decrypt, shouldn't be required so that I could store it in a safe place on another device. To accomplish this, I chose to use the `sealedBox` construct, because it only requires a public key. The main difference of the `sealedBox` compared to another construct simply called `Box` is that it doesn't offer cryptographic proof of the sender’s authorship, which is out of scope for plasm anyway.
Additionally, I wanted to protect the private key by encrypting it as well using secret key encryption. That's why plasm requires a password for creating a key pair and decrypting files. The password is used to encrypt and decrypt the key so that an attacker needs both the private key file **and** the password to be able to decrypt files.

# Installation and how it works
Please have a look at the [README](https://github.com/va1entin/plasm/blob/master/README.md) to find out how to use plasm.

Plasm is currently not available via PyPi, but you can install it directly from Github as follows:
``` bash
wget https://github.com/va1entin/plasm/-/archive/master/plasm-master.zip
unzip plasm-master.zip
cd plasm-master
pip install .
```

# Integration with motionEye
The integration with motionEye currently requires a little patch to be applied to it's `uploadservices.py`, which is located at `/usr/local/lib/python2.7/dist-packages/motioneye/uploadservices.py` on Raspbian. You can download it directly [here](https://github.com/va1entin/plasm/raw/master/integrations/motioneye-uploadservices.patch) (right click -> save as).
Make sure to change the path to your public key accordingly and add `remove_input_file=True` as shown in the [README](https://github.com/va1entin/plasm/blob/master/README.md), if you want plasm to remove the unencrypted input file once encryption is finished.
Plasm also logs what it's doing using the logging module by default. Most logging happens at debug log level currently. Have a look at the [motionEye wiki](https://github.com/ccrisan/motioneye/wiki/Configuration-File) to find out how to enable debug logging.

# Conclusion
Plasm is licensed under the Apache 2.0 License. Feel free to report issues or create merge requests at [Github](https://github.com/va1entin/plasm). Please note that I don't plan to extend plasm's scope on other use cases at the moment to keep it as simple as possible. If plasm doesn't fit the scope of what you want to do, feel free to have a look at [pynacl's documentation](https://pynacl.readthedocs.io) and use it directly.
