# Backup and Export Policy Notes

Welcome to the VaultWares backup and export policy! This guide expands on how we handle data backups, archives, and exports to ensure data integrity and completeness.

## The Goal of Backups

Backups are our last line of defense against data loss, hardware failure, or human error. An export is only useful if it contains everything needed to restore the system to its previous state. Partial backups are often as bad as no backups because they give a false sense of security.

## Guidelines for Backups and Exports

### 1. Understand What Constitutes a "Full" Backup
Before running or configuring a backup, you must understand all the components that make up the system's state. This typically includes:
- **Database records** (SQL dumps, JSON documents).
- **Configuration files** (environment variables, settings).
- **Binary assets/Media blobs** (images, videos, user uploads).

### 2. Explicitly Handle Media and Blobs
*Crucial detail:* If the system you are backing up contains binary blobs or media files, **you must ensure the export explicitly includes them or clearly documents that they are excluded.** Never leave it ambiguous. If someone restores a database but the referenced images are missing, the backup has failed its primary purpose.

### 3. Verification over Assumption
Never assume a backup script worked just because it didn't throw an error.
- Always verify the output archive.
- Ensure the file size makes sense.
- Try unpacking it in a safe environment to confirm the contents are intact.

## When is it "Done"?
A backup or export task is complete when the archive has been generated, its contents (including or intentionally excluding media) are verified, and the process is documented so it can be repeated safely in the future.
