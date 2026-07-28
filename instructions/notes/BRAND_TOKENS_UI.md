# Brand Tokens & UI Notes

Welcome to the VaultWares Brand Tokens & UI policy! This document explains how we maintain a consistent visual identity across all our projects using the VaultWares Redesign system.

## The Importance of Brand Consistency

A unified visual language builds trust and makes our products feel like a cohesive suite rather than a collection of disjointed tools. Our design tokens (colors, spacing, typography) are the building blocks of this identity.

## Guidelines for UI Development

### 1. Always Use the Token System
When building interfaces, never use hardcoded hex colors, arbitrary pixel values for padding/margins, or custom font stacks.
- Always consume the CSS variables or styled-component tokens provided by the **VaultWares Redesign** theme.
- For example, use `var(--vw-color-primary)` instead of `#e50914`.
- Use `var(--vw-spacing-md)` instead of `16px`.

### 2. The VaultWares Redesign Theme
This is our canonical source of truth for visual design. If you are building a new application or modifying an existing one, ensure it implements this theme. The theme is designed to handle both "warm" and "console" modes gracefully.

### 3. Submodule Integration
For user-facing apps, the `vaultwares-themes` repository should be included as a git submodule. This ensures that when the design team updates a token, the changes can be pulled down and applied across all apps systematically.
*Note:* Do not patch or modify the theme files directly inside the submodule directory of a project. Updates to the theme must happen in the standalone `vaultwares-themes` repository first.

### 4. Accessibility and Contrast
Our tokens are carefully calibrated to meet accessibility contrast ratios. By strictly adhering to the token system, you ensure that our applications remain readable and accessible to all users.

## When is it "Done"?
A UI task is complete when it uses no hardcoded styling values, strictly adheres to the VaultWares Redesign tokens, and visually matches our brand guidelines across both light and dark (console) modes.
