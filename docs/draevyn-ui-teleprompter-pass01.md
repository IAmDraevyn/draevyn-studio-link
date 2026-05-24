# Draevyn Studio Link — UI + Prompt Board Pass 01

## What this patch does

This patch begins converting the VDO.Ninja fork from a raw utility interface into a Draevyn-specific streaming workflow.

## Added

- `custom/draevyn/draevyn-vdo-theme.css`
- `custom/draevyn/draevyn-vdo-patch.js`
- `custom/draevyn/draevyn-prompt-board.html`
- Updated `custom/draevyn/draevyn-launch.html`

## Patched

- `index.html`
- `devices.html`
- `dock.html`

## Test URLs

Use your Live Server port. Example:

```text
http://127.0.0.1:5501/custom/draevyn/draevyn-launch.html
http://127.0.0.1:5501/index.html?room=draevynstudio
http://127.0.0.1:5501/index.html?director=draevynstudio
http://127.0.0.1:5501/index.html?scene&room=draevynstudio
http://127.0.0.1:5501/devices.html?room=draevynstudio
http://127.0.0.1:5501/dock.html?room=draevynstudio
http://127.0.0.1:5501/custom/draevyn/draevyn-prompt-board.html?room=draevynstudio&role=host
```

## Teleprompter / Prompt Board note

Pass 01 adds a Prompt Board so the host can manage cue lines and guests can view prompts.

Current sync behavior:

- Same-browser sync uses BroadcastChannel/localStorage.
- Guest prompt links can be generated.
- This is enough to design and test the user flow.

Not yet included:

- True remote multi-guest live sync over VDO data channels.
- Deep AEROS teleprompter suite import/export.
- Automatic speaker assignment by VDO guest name.

Those should be added in the next integration pass after the page flow and CSS are stable.

## Commit suggestion

```powershell
git add -A
git commit -m "Add Draevyn VDO theme and prompt board pass 01"
git push
```
