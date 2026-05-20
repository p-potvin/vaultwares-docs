# GUI_VERIFICATION
Applies when: web UI, docs site UI, dashboards, admin panels, SPAs.
Do:
- Navigate at least 2 links deep and back.
- Check DevTools Console and Network for blocking errors.
- Trigger hover/focus state and an empty/error state relevant to the change.
- Cross-check with a second modality when feasible (curl/Invoke-WebRequest or Playwright).
Do not:
- Mark “working” from a single screenshot or 200 OK.
Done when:
- You can list pages visited and what you inspected.
