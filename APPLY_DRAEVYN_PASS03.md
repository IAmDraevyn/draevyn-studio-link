# Apply Instructions — Draevyn Studio Link Pass 03

1. Make sure Pass 01 and Pass 02 are already applied.

2. Save current work first:

```powershell
git status
git add -A
git commit -m "Save work before Draevyn pass 03"
```

3. Extract this ZIP over your repo root:

```text
C:\EXOLIN\dev\draevyn-studio-link\
```

4. Choose replace/overwrite.

5. Run Live Server.

6. Test:

```text
/custom/draevyn/draevyn-launch.html
/index.html?director=draevynstudio&openprompter=1
/index.html?room=draevynstudio&openprompter=1
/index.html?director=draevynstudio&openprompter=1&tier=developer
/custom/draevyn/aeros-prompter/index.html?room=draevynstudio&role=host
/custom/draevyn/aeros-prompter/index.html?room=draevynstudio&role=guest
```

7. Commit after testing:

```powershell
git status
git add -A
git commit -m "Embed AEROS prompter in VDO pages and add tier foundation"
git push
```
