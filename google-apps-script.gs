/* Paste this whole file into Google Sheets → Extensions → Apps Script.
   It saves every form submission from the wedding website as a new row.  */

// Optional: put your email here to get an email for every response, e.g. "you@gmail.com"
const NOTIFY_EMAIL = "";

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Responses") || ss.insertSheet("Responses");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp", "Form", "Full Name", "Email", "Mobile", "Attending",
                     "Guests", "Events", "Who will cry first", "Note"]);
    sheet.setFrozenRows(1);
  }
  const p = e.parameter;
  const row = [new Date(), p.form || "", p.name || "", p.email || "",
               p.phone ? "'" + p.phone : "", p.attending || "", p.guests || "",
               p.events || "", p.cry || "", p.note || ""];
  sheet.appendRow(row);

  if (NOTIFY_EMAIL) {
    MailApp.sendEmail(NOTIFY_EMAIL, "New wedding response: " + (p.form || "") + " – " + (p.name || "Guest"),
      ["Form: " + p.form, "Name: " + p.name, "Email: " + p.email, "Mobile: " + p.phone,
       "Attending: " + p.attending, "Guests: " + p.guests, "Events: " + p.events,
       "Cry first: " + p.cry, "Note: " + p.note].join("\n"));
  }
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
