/*
 * Pelai Collective — Social Styles Self-Assessment settings.
 *
 * saveEndpoint: the Web app URL of the Google Apps Script in apps-script/Code.gs
 *               (Deploy > Manage deployments > Web app URL). Leave empty to turn
 *               saving off; the assessment and PDF download still work.
 * saveToken:    must match SAVE_TOKEN in apps-script/Code.gs. It filters out
 *               casual misuse of the endpoint; it is not a secret, since anyone
 *               can read this file.
 */
window.SS_CONFIG = {
  saveEndpoint: "",
  saveToken: "pelai-social-styles-v1"
};
