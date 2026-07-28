# Incident Response Policy Notes

Welcome to the VaultWares incident response policy! This document outlines how we react when things go wrong in production, ensuring swift mitigation and thorough post-mortems.

## The Goal of Incident Response

During an active incident (downtime, data loss, security breach), the absolute priority is **mitigation**. Stop the bleeding first. Figuring out *why* it happened (root cause analysis) comes second. Blame is never part of the process.

## Guidelines for Managing Incidents

### 1. Communication is Critical
If you discover a critical issue, escalate it immediately.
- Do not try to silently fix a production database corruption on your own.
- Notify the team, declare an incident, and keep a log of every action taken.

### 2. Read the Alerts Documentation
Familiarize yourself with `docs-content/operations/deploy-alerts.mdx`. This document explains how our notification pipeline works. If an alert fires, you need to know where it routes and who is on call.

### 3. Do No Harm
When mitigating, prioritize safe, reversible actions.
- Rolling back a deployment is usually safer than trying to hotfix code on the fly.
- Disconnecting a compromised server from the tailnet is safer than trying to clean it while it's still running.

### 4. The Post-Mortem
Every significant incident requires a post-mortem document. This document must cover:
- What happened (timeline).
- How we detected it.
- How we mitigated it.
- The root cause.
- Action items to prevent it from ever happening again.

## When is it "Done"?
An incident is resolved when the service is fully restored, a post-mortem has been written and reviewed, and all preventative action items have been assigned to tracking tickets (Jira).
