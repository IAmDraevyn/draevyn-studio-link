# Draevyn Studio Link — Pass 03 Embedded Prompter + Tier Foundation

## Goal

The prompter should be viewable during the stream/session without forcing host or guests into separate windows.

Pass 03 adds an embedded AEROS Prompter panel inside the VDO/Draevyn pages.

## Key files

```text
custom/draevyn/draevyn-tier-config.js
custom/draevyn/draevyn-prompter-embed.css
custom/draevyn/draevyn-vdo-patch.js
custom/draevyn/draevyn-launch.html
custom/draevyn/aeros-prompter/index.html
custom/draevyn/aeros-prompter/draevyn-prompter-addon.js
```

## New behavior

On supported VDO UI pages, the Draevyn ribbon now has:

```text
Launcher
Prompter
Cue Board
```

Clicking `Prompter` opens the AEROS Prompter embedded as a right-side panel.

It stays in the same VDO page, so guests and hosts do not need to manage extra windows.

## Launcher additions

The launcher now includes:

```text
Open Director
Director + Embedded Prompter
Open Guest Entry
Guest + Embedded Prompter
Open Host Prompter
Copy Guest Prompter Link
```

## Test URLs

```text
http://127.0.0.1:5501/custom/draevyn/draevyn-launch.html
http://127.0.0.1:5501/index.html?director=draevynstudio&openprompter=1
http://127.0.0.1:5501/index.html?room=draevynstudio&openprompter=1
http://127.0.0.1:5501/custom/draevyn/aeros-prompter/index.html?room=draevynstudio&role=host
http://127.0.0.1:5501/custom/draevyn/aeros-prompter/index.html?room=draevynstudio&role=guest
```

## Tier behavior foundation

| Tier | Attribution | Embedded Prompter | Detach/New Window | White Label | Multi-guest cue tools | Tier simulation |
|---|---|---:|---:|---:|---:|---:|
| Free | Required | Yes | No/future-limited | No | No | No |
| Creator | Removed | Yes | Yes | No | No | No |
| Pro | Removed | Yes | Yes | Yes | Yes | No |
| Studio | Removed | Yes | Yes | Yes | Yes | No |
| Developer Full | Internal | Yes | Yes | Yes | Yes | Yes |

## Current limitation

This is still static/local logic. It creates UI behavior and tier structure, not true DRM.

True enforcement later should use:

```text
signed builds
hosted login
license keys
server-side exports
payment integration
compiled/minified releases
```

## Developer tier testing

In local testing, open a URL with:

```text
?tier=developer
```

or:

```text
?developer=1
```

Then the embedded prompter panel will show the developer tier selector.

Example:

```text
http://127.0.0.1:5501/index.html?director=draevynstudio&openprompter=1&tier=developer
```
