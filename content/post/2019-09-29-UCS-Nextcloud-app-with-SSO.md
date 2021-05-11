---
author: Valentin Heidelberger
comments: false
date: "2019-09-29T13:42:20Z"
header_img: /img/posts/lightbulb_saya-kimura.jpg
subtitle: ""
tags:
- technology
- linux
title: Nextcloud for UCS now comes with SSO out of the box
---
A few weeks ago I've held a talk involving a solution I built @[univention](https://univention.com) for a customer using Univention Corporate Server and Nextcloud at this year's Nextcloud conference. The video of that will probably be available in the next few weeks and I'll share it here once it's available.

UPDATE: See [here](/blog/Nextcloud-conference-2019.html) for the video of the talk.

Another interesting thing regarding Nextcloud and UCS happened in the meantime though: The [Nextcloud app for UCS](https://www.univention.com/products/univention-app-center/app-catalog/nextcloud/) now comes with pre-configured Single Sign-On (SSO) using SAML. This is very cool because lots of our customers want to make use of SSO but the configuration is not always trivial. Using a [blog post](https://www.univention.com/blog-en/2019/02/how-to-single-sign-on-for-nextcloud/) I wrote for the Univention blog in February, Nextcloud, namely Arthur Schiwon aka @[blizzz](https://github.com/blizzz), were able to [bake the configuration](https://github.com/nextcloud/univention-app/issues/91) into the app and thus make it really easy for people to get started with UCS, Nextcloud and SSO! If you'd like to find out more about SSO with SAML, feel free to check out my [blog post](https://www.univention.com/blog-en/2019/06/brief-introduction-saml-a-secure-comfortable-web-access/) about it.
