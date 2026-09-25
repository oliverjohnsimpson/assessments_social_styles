# Report store (Google Apps Script)

Saves every finished report to Google Drive in a folder for that day (IST).

```
<root folder 16mN8-eyhyVqLxNZy3OpXky1R2ueGYKNW>
└── 2026-09-25
    ├── 10-42-07_Anu_R_Amiable.pdf
    └── 14-03-51_Priya_S_Driver.pdf
```

Each file's Drive description holds the name, style, sub-style, both scores and the save time.

## Set up (once, signed in as admin@pelaicollective.com)

1. Make sure the root folder is owned by (or editable by) admin@pelaicollective.com and is **not** shared by link.
   Only people the folder is shared with can open the reports.
2. Go to <https://script.google.com> and create a new project named "Pelai Social Styles report store".
3. Replace the contents of `Code.gs` with `apps-script/Code.gs` from this repository.
4. Open Project Settings, tick "Show appsscript.json manifest file in editor", and replace
   `appsscript.json` with the one in this folder.
5. Choose the `testSetup` function and click **Run**. Approve the Drive permission.
   The log should show the folder name and the admin as owner.
6. Click **Deploy > New deployment**, type **Web app**, with
   *Execute as*: **Me (admin@pelaicollective.com)** and *Who has access*: **Anyone**.
7. Copy the **Web app URL** (it ends in `/exec`) into `saveEndpoint` in `config.js` on the website.

To change the script later, use **Deploy > Manage deployments > Edit > New version** so the URL stays the same.
If you change `SAVE_TOKEN` in `Code.gs`, change `saveToken` in `config.js` to match.
