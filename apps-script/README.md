# Report store and mailer (Google Apps Script)

**Save.** Every finished report is saved to the `reports` folder in Google Drive, inside a folder for that day (IST).
There is one folder per day, created by that day's first report. Every report from any participant that day goes
into it. Reports are never saved loose in `reports`.

```
reports/  (16mN8-eyhyVqLxNZy3OpXky1R2ueGYKNW)
└── 2026-09-25/
    ├── 10-42-07_Anu_R_Amiable.pdf
    └── 14-03-51_Priya_S_Driver.pdf
```

Each file's Drive description holds the name, style, sub-style, both scores and the save time.

**Email.** On the results page a participant can email their report to one address. The email comes from
ping@pelaicollective.com. It has the subject "Your Pelai Collective Social Styles report", a short summary of their
profile, and the PDF attached. Only a report the script has just saved can be emailed. The limit is
3 sends per report, within 6 hours of saving.

## Before you start: let the admin account send as ping@pelaicollective.com

The script runs under admin@pelaicollective.com, so ping@pelaicollective.com must be a
**"Send mail as"** address of that account:

- **If ping@ is an alias or group** on the admin user (Google Workspace Admin console > Users > admin > Alternate email):
  in admin's Gmail go to Settings > Accounts > **Send mail as** > *Add another email address*, enter
  ping@pelaicollective.com and untick "Treat as an alias" only if you want replies kept separate.
- **If ping@ is its own mailbox** (a separate user): add it the same way in admin's Gmail. Google sends a
  confirmation code to ping@; open that mailbox and confirm.

`testSetup` (step 5) tells you whether this is working.

## Set up (once, signed in as admin@pelaicollective.com)

1. Keep the `reports` folder owned by admin@pelaicollective.com and **not** shared by link. Only the people it is
   shared with can open the reports.
2. Go to <https://script.google.com> and create a project named "Pelai Social Styles report store".
3. Replace the contents of `Code.gs` with `apps-script/Code.gs` from this repository.
4. Open Project Settings, tick "Show appsscript.json manifest file in editor", and replace
   `appsscript.json` with the one in this folder.
5. Choose the `testSetup` function and click **Run**. Approve the Drive and Gmail permissions. The log should show:
   - `Saving reports into: reports (owner: admin@pelaicollective.com)`
   - `Emails will be sent from ping@pelaicollective.com` (if it says NOT READY, finish the section above)
   - the number of emails left today (about 1,500 for Google Workspace accounts)
6. Click **Deploy > New deployment**, type **Web app**, with
   *Execute as*: **Me (admin@pelaicollective.com)** and *Who has access*: **Anyone**.
7. Copy the **Web app URL** (it ends in `/exec`) into `saveEndpoint` in `social_styles/config.js` and merge it into `main`.
   The "Email your report" box appears on the site once this is set.

To change the script later:

1. Paste the new `Code.gs` over the old one and click **Save**.
2. Run `testSetup` once. If Google asks for permissions again (for example, fetching the email logo from the
   website), approve them. Otherwise the web app keeps running the old permissions and fails.
3. **Deploy > Manage deployments > ✏️ Edit > Version: New version > Deploy**. This keeps the same Web app URL.

The email header shows the logo from `social_styles/assets/pelai-logo-email.png` on the live site. If it can't be
fetched, the email is sent without it.
If you change `SAVE_TOKEN` in `Code.gs`, change `saveToken` in `social_styles/config.js` to match.
To change the 3-send limit, edit `MAX_EMAILS_PER_REPORT` in `Code.gs` and the note in `social_styles/index.html`.
