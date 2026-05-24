# Apply Instructions — Draevyn Studio Link UI + Prompt Board Pass 01

1. Back up or commit your current branch first.

```powershell
git status
git add -A
git commit -m "Save work before Draevyn UI pass 01"
```

2. Extract this ZIP over your repo root:

```text
C:\EXOLIN\dev\draevyn-studio-link\
```

3. Choose replace/overwrite when Windows asks.

4. Run Live Server from the repo root.

5. Test:

```text
/custom/draevyn/draevyn-launch.html
/index.html?room=draevynstudio
/index.html?director=draevynstudio
/index.html?scene&room=draevynstudio
/devices.html?room=draevynstudio
/dock.html?room=draevynstudio
/custom/draevyn/draevyn-prompt-board.html?room=draevynstudio&role=host
```

6. If the pages look right:

```powershell
git status
git add -A
git commit -m "Add Draevyn VDO theme and prompt board pass 01"
git push
```
