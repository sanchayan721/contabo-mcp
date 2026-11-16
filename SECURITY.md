# Security Policy

## Supported version

Only the latest `main` branch is supported with security fixes. Please update before
reporting.

## How to report

- Preferred: GitHub **private vulnerability reporting** — open this repository, go to
  the **Security** tab → **Report a vulnerability**.
- For sensitive matters, email **bhunia.sanchayan@gmail.com**.

**Never open public issues containing Contabo credentials, API tokens, or request-ids
tied to your account.** Request-ids from error messages are fine; anything that could
identify or authenticate your account is not.

## What to expect

We acknowledge reports on a best-effort basis within **7 days**, then investigate and
coordinate a fix and disclosure with you.

## Scope

This tool stores Contabo credentials only in environment variables and never logs them.
If you find any path that leaks credentials or tokens (logs, errors, generated URLs,
process listings), that is in scope — please report it.
