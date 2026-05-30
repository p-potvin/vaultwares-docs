# BACKUP_EXPORT_POLICY
Applies when: backups, exports, migrations, archive creation, restore planning.
Do:
- Define what is included (data+metadata+blobs) and how to restore.
- Prefer a restore test over “backup succeeded” claims.
- Determine lock state collisions potential
Do not:
- Produce partial backups without stating exclusions.
Done when:
- Backup is restorable and the restore path is documented.
