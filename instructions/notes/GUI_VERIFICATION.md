# GUI Verification Policy Notes

Welcome to the VaultWares GUI verification policy! This guide outlines how we ensure that our user-facing changes look correct and function properly before they are merged.

## Why Visual Verification Matters

Code tests (unit tests, integration tests) can verify that logic works, but they cannot tell you if a button is rendering off-screen, if a color contrast is unreadable, or if a layout breaks on mobile. Visual verification is mandatory for front-end changes.

## Guidelines for Verifying the GUI

### 1. Visual Evidence is Required
If your code changes introduce any user-visible modifications to the frontend UI (HTML, CSS, JS, JSX, TSX), you must provide visual evidence that the change worked.
- You cannot claim a UI task is "working" based purely on a 200 OK network response or passing unit tests.

### 2. Automated Screenshots (Playwright)
We rely on automated tools to capture this evidence. When prompted by the pre-commit process, you must use the `frontend_verification_instructions` tool to write and execute a Playwright script.
- This script should navigate to the changed page, interact with it if necessary, and generate screenshots (or video recordings) of the final state.

### 3. Cross-Platform Considerations
When taking screenshots, ensure you are testing the environment correctly. If the feature is responsive, verify it at desktop and mobile breakpoints. Ensure it looks correct in both the "warm" and "console" (dark) VaultWares themes.

## When is it "Done"?
GUI verification is complete when clear, legible screenshots (and media recordings if applicable) have been generated, reviewed against the acceptance criteria, and attached to the Pull Request or task evidence.
