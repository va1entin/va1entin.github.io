---
author: Valentin Heidelberger
comments: false
date: "2020-12-05T17:11:08Z"
header_img: /img/tags/linux.webp
subtitle: ""
tags:
- technology
- linux
- music
title: 'Simple CLI audio metadata editor: tag_dat.py'
---
Audio metadata is often not particularly easy to manage in a simple and quick manner. There's lots of tools providing this feature but many of them have a ton of other additional functionality or are full-on music library managers. I wanted a very simple command-line tool to quickly change the title, artist and album tags of audio metadata - the result is "tag_dat.py" and available in my [tools repository](https://github.com/va1entin/tools/tree/master/tag_dat).

tag_dat.py iterates over a file or all files in a given path (default: current path), sets the filename (without file ending) as *title* and given arguments *album* and *artist* as audio tags. The script uses the amazing "mutagen" library under the hood.

Here are a few usage examples:

```bash
# Set MyArtist and MyAlbum for all files in current path
./tag_dat.py -ar MyArtist -al MyAlbum

# Set MyArtist and MyAlbum for my_file.mp3
./tag_dat.py -ar MyArtist -al MyAlbum -f my_file.mp3

# Set MyArtist and MyAlbum for all files in path music/MyAlbum/
./tag_dat.py -ar MyArtist -al MyAlbum -p music/MyAlbum/
```
