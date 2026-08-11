# GoDaddy contact email setup

The contact form sends enquiries through your GoDaddy mailbox to `mtsharma1@gmail.com`.

## GoDaddy Professional Email / Titan

Add these environment variables locally and in Vercel:

```env
GODADDY_SMTP_HOST=smtpout.secureserver.net
GODADDY_SMTP_PORT=465
GODADDY_SMTP_SECURE=true
GODADDY_SMTP_USER=info@cunnectit.com
GODADDY_SMTP_PASSWORD=
CONTACT_FROM_EMAIL=info@cunnectit.com
```

Use the mailbox password for `GODADDY_SMTP_PASSWORD`.

## Microsoft 365 email purchased through GoDaddy

Use these three connection values instead:

```env
GODADDY_SMTP_HOST=smtp.office365.com
GODADDY_SMTP_PORT=587
GODADDY_SMTP_SECURE=false
```

SMTP Authentication must be enabled for the mailbox. If the account uses multi-factor authentication, create and use an app password.

Redeploy the Vercel project after adding or changing the variables. Never place the mailbox password in source code or commit it to Git.
