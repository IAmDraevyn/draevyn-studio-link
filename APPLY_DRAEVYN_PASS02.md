# Apply Instructions — Draevyn Studio Link Pass 02

1. Make sure Pass 01 is already applied.

2. Commit or stash current work first:

```powershell
git status
git add -A
git commit -m "Save work before Draevyn pass 02"
```

3. Extract this ZIP over your repo root:

```text
C:\EXOLIN\dev\draevyn-studio-link\
```

4. Choose replace/overwrite.

5. Run Live Server and test:

```text
/custom/draevyn/draevyn-launch.html
/custom/draevyn/aeros-prompter/index.html?room=draevynstudio&role=host
/custom/draevyn/aeros-prompter/index.html?room=draevynstudio&role=guest
/custom/draevyn/draevyn-prompt-board.html?room=draevynstudio&role=host
/custom/draevyn/draevyn-prompt-board.html?room=draevynstudio&role=guest
/index.html?director=draevynstudio
/index.html?room=draevynstudio
```

6. Commit after testing:

```powershell
git status
git add -A
git commit -m "Add AEROS prompter add-on and fix cue board scaling"
git push
```
