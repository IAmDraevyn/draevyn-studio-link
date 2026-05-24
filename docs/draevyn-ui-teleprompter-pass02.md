# Draevyn Studio Link — Pass 02

## Focus

Pass 02 separates two tools that were previously blurred together:

1. **AEROS Prompter Add-On**
   - Full teleprompter/script tool copied in from the current functional AEROS Standalone Prompter.
   - Located at `custom/draevyn/aeros-prompter/index.html`.

2. **Prompt Board / Cue Board**
   - Lightweight cue/turn-order board.
   - Located at `custom/draevyn/draevyn-prompt-board.html`.
   - Now has improved guest scaling.

## New URLs

Host prompter:

```text
http://127.0.0.1:5501/custom/draevyn/aeros-prompter/index.html?room=draevynstudio&role=host
```

Guest prompter:

```text
http://127.0.0.1:5501/custom/draevyn/aeros-prompter/index.html?room=draevynstudio&role=guest
```

Host cue board:

```text
http://127.0.0.1:5501/custom/draevyn/draevyn-prompt-board.html?room=draevynstudio&role=host
```

Guest cue board:

```text
http://127.0.0.1:5501/custom/draevyn/draevyn-prompt-board.html?room=draevynstudio&role=guest
```

## What changed

- Prompt Board guest mode now uses full width.
- Prompt Board no longer leaves a massive blank right-side area.
- Prompt Board font and timeline scale better.
- Launcher now has AEROS Prompter actions.
- VDO top ribbon now has separate `Prompter` and `Cue Board` buttons.
- AEROS Prompter now has a Draevyn room/role add-on bar.
- Guest prompter mode hides the heavy setup side panel.

## Important

This pass connects the **functional AEROS prompter as an add-on** to Draevyn Studio Link.

It does not yet provide true remote host-to-guest prompter synchronization.

Remote sync options for Pass 03:

- VDO data-channel bridge
- WebSocket relay
- Hosted Supabase/Realtime room
- Broadcast from Director page into guest pages
