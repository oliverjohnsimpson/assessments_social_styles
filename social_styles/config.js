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
  saveEndpoint: "https://script.google.com/macros/s/AKfycbxxrzCvlmKASqeVchEs-R2Mu7fSXRF9ZMr_QVWEB_h59VV8aC-4LP4cABpGtCSAuVmF/exec",
  saveToken: "pelai-social-styles-v1"
};
